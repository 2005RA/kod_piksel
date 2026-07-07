// supabase/functions/start-race/index.ts
//
// Called the moment a timed race's countdown starts. Records a server
// timestamp so submit-race-result can compute elapsed time from the server
// clock instead of trusting Date.now() on the player's machine.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

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

    const { raceId, endsAt } = await req.json();
    if (!raceId || !endsAt) return json({ error: 'raceId və endsAt tələb olunur.' }, 400);

    // Idempotent — don't let a restart reset the clock.
    const { data: existing } = await admin
      .from('race_starts')
      .select('started_at')
      .eq('user_id', userId)
      .eq('race_id', raceId)
      .eq('ends_at', endsAt)
      .maybeSingle();

    if (existing) return json({ started_at: existing.started_at });

    const startedAt = new Date().toISOString();
    const { error: insErr } = await admin.from('race_starts').insert({
      user_id: userId, race_id: raceId, ends_at: endsAt, started_at: startedAt,
    });
    if (insErr) {
      console.error('race_starts insert failed:', insErr);
      return json({ error: 'Başlanğıc qeyd edilmədi.' }, 500);
    }

    return json({ started_at: startedAt });
  } catch (e) {
    console.error('start-race crashed:', e);
    return json({ error: 'Gözlənilməz xəta baş verdi.' }, 500);
  }
});