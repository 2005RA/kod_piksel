// supabase/functions/verify-answers/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2';
import bcrypt from 'npm:bcryptjs@2.4.3';
import { getCorsHeaders } from '../_shared/cors.ts';

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const MAX_ATTEMPTS_PER_USERNAME = 5;
const MAX_ATTEMPTS_PER_IP = 20;
const WINDOW_MINUTES = 15;
const TOKEN_TTL_MINUTES = 10;

function getClientIp(req: Request) {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('cf-connecting-ip') ?? 'unknown';
}

async function tooManyAttempts(username: string, ip: string) {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

  const { count: usernameCount } = await admin
    .from('reset_attempts')
    .select('id', { count: 'exact', head: true })
    .ilike('username', username)
    .gte('attempted_at', since);
  if ((usernameCount ?? 0) >= MAX_ATTEMPTS_PER_USERNAME) return true;

  const { count: ipCount } = await admin
    .from('reset_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('attempted_at', since);
  return (ipCount ?? 0) >= MAX_ATTEMPTS_PER_IP;
}

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
    const { username, answers } = await req.json();
    const cleanUsername = (username || '').trim();
    if (!cleanUsername || !Array.isArray(answers) || answers.length !== 2) {
      return json({ error: 'Yanlış sorğu.' }, 400);
    }

    const ip = getClientIp(req);

    if (await tooManyAttempts(cleanUsername, ip)) {
      return json({ error: 'Çox sayda cəhd. Bir az sonra yenidən yoxla.' }, 429);
    }
    await admin.from('reset_attempts').insert({ username: cleanUsername, ip_address: ip });

    const { data: profile } = await admin
      .from('profiles')
      .select('id')
      .ilike('username', cleanUsername)
      .maybeSingle();
    if (!profile) return json({ error: 'Cavablar yanlışdır.' }, 401);

    const { data: stored } = await admin
      .from('security_answers')
      .select('question_id, answer_hash')
      .eq('user_id', profile.id)
      .in('question_id', answers.map(a => a.questionId));

    if (!stored || stored.length !== 2) return json({ error: 'Cavablar yanlışdır.' }, 401);

    for (const a of answers) {
      const row = stored.find(s => s.question_id === a.questionId);
      const ok = row && await bcrypt.compare((a.answer || '').trim().toLowerCase(), row.answer_hash);
      if (!ok) return json({ error: 'Cavablar yanlışdır.' }, 401);
    }

    const { data: tokenRow, error: tokenErr } = await admin
      .from('password_reset_tokens')
      .insert({
        user_id: profile.id,
        expires_at: new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000).toISOString(),
      })
      .select('token')
      .single();
    if (tokenErr) return json({ error: 'Token yaradıla bilmədi.' }, 500);

    return json({ token: tokenRow.token });
  } catch {
    return json({ error: 'Gözlənilməz xəta baş verdi.' }, 500);
  }
});