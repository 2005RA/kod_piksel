// supabase/functions/request-reset/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const MAX_ATTEMPTS_PER_USERNAME = 5;
const MAX_ATTEMPTS_PER_IP = 20;
const WINDOW_MINUTES = 15;

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

  // Also cap by IP so someone can't work around the per-username limit by
  // cycling through many usernames from the same machine.
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
    const { username } = await req.json();
    const cleanUsername = (username || '').trim();
    if (!cleanUsername) return json({ error: 'İstifadəçi adı tələb olunur.' }, 400);

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

    // Always return a 2-question shape, even for unknown usernames, so
    // this endpoint can't be used to enumerate registered accounts.
    if (!profile) {
      return json({
        questions: [
          { questionId: 1, text: 'İlk ev heyvanının adı nədir?' },
          { questionId: 2, text: 'Ən sevimli müəllimin adı nədir?' },
        ],
      });
    }

    const { data: answers } = await admin
      .from('security_answers')
      .select('question_id, security_questions(question_text)')
      .eq('user_id', profile.id);

    if (!answers || answers.length < 2) {
      return json({ error: 'Bu hesab üçün bərpa sualları tapılmadı.' }, 400);
    }

    const shuffled = [...answers].sort(() => Math.random() - 0.5).slice(0, 2);
    return json({
      questions: shuffled.map(a => ({
        questionId: a.question_id,
        text: a.security_questions.question_text,
      })),
    });
  } catch {
    return json({ error: 'Gözlənilməz xəta baş verdi.' }, 500);
  }
});
