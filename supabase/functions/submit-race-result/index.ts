// supabase/functions/submit-race-result/index.ts
//
// Replaces the client's direct `.upsert()` into race_results. This is the
// ONLY path allowed to write race_results now (see migration 0001). Elapsed
// time and pass/fail are both re-derived here — the client's own numbers
// are never trusted.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';
import { RACE_DEFS, computeCharCount } from '../_shared/raceDefs.ts';

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');
    if (!jwt) return json({ error: 'Giriş tələb olunur.' }, 401);

    const { data: callerData, error: callerErr } = await admin.auth.getUser(jwt);
    if (callerErr || !callerData?.user) return json({ error: 'Giriş tələb olunur.' }, 401);
    const userId = callerData.user.id;

    const { raceId, endsAt, code } = await req.json();
    if (!raceId || typeof code !== 'string') {
      return json({ error: 'raceId və code tələb olunur.' }, 400);
    }

    const def = RACE_DEFS[raceId];
    if (!def) return json({ error: 'Naməlum yarış.' }, 404);

    // ── Re-run the SAME correctness check the client runs. A client-sent
    //    "I passed" boolean is never accepted. ──
    if (!def.validate(code)) {
      return json({ ok: false });
    }

    // Already-completed guard — mirrors the client's "finished" check and
    // makes retries/double-submits harmless.
    if (endsAt) {
      const { data: already } = await admin
        .from('race_results')
        .select('id')
        .eq('user_id', userId).eq('race_id', raceId).eq('ends_at', endsAt).eq('completed', true)
        .maybeSingle();
      if (already) return json({ ok: true, alreadyCompleted: true });
    }

    // ── Elapsed time comes ONLY from the server-recorded start ──
    let elapsed = 0;
    if (endsAt) {
      const { data: startRow } = await admin
        .from('race_starts')
        .select('started_at')
        .eq('user_id', userId)
        .eq('race_id', raceId)
        .eq('ends_at', endsAt)
        .maybeSingle();
      if (!startRow) return json({ error: 'Yarış başlanğıcı tapılmadı.' }, 400);
      elapsed = Math.max(0, Math.floor((Date.now() - new Date(startRow.started_at).getTime()) / 1000));
    }

    const charCount = def.type === 'golf' ? computeCharCount(code) : null;

    const { error: upsertErr } = await admin.from('race_results').upsert({
      user_id: userId,
      race_id: raceId,
      ends_at: endsAt ?? null,
      completed: true,
      time_taken: elapsed,
      char_count: charCount,
      chips_earned: def.chips,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,race_id,ends_at' });

    if (upsertErr) {
      console.error('race_results upsert failed:', upsertErr);
      return json({ error: 'Nəticə yazılmadı.' }, 500);
    }

    // Credit chips through the internal, service_role-only credit function —
    // NOT the user-facing RPC, since this call runs with the service key
    // and has no user session for auth.uid() to resolve. Keyed by race run
    // so a given run can only ever pay out once, even on retries.
    const taskId = `race-${raceId}-${endsAt ?? 'practice'}`;
    const { error: rpcErr } = await admin.rpc('_credit_reward', {
      p_user_id: userId,
      p_delta_chips: def.chips,
      p_delta_keys: 0,
      p_delta_hourglasses: 0,
      p_task_id: taskId,
      p_source: 'race',
    });
    if (rpcErr) console.error('reward credit failed:', rpcErr);

    return json({ ok: true, elapsed, charCount, chipsEarned: def.chips });
  } catch (e) {
    console.error('submit-race-result crashed:', e);
    return json({ error: 'Gözlənilməz xəta baş verdi.' }, 500);
  }
});