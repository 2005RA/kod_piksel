// supabase/functions/change-username/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const SHADOW_DOMAIN = 'users.kodpiksel.internal';

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
    // ── Identify the caller from their own access token ──
    // We never trust a userId sent in the body — always resolve it from
    // the JWT so a user can only ever rename their own account.
    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');
    if (!jwt) return json({ error: 'Giriş tələb olunur.' }, 401);

    const { data: callerData, error: callerErr } = await admin.auth.getUser(jwt);
    if (callerErr || !callerData?.user) {
      return json({ error: 'Giriş tələb olunur.' }, 401);
    }
    const userId = callerData.user.id;

    const { username } = await req.json();
    const cleanUsername = (username || '').trim();

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
      return json({ error: 'İstifadəçi adı 3-20 simvol, yalnız hərf/rəqəm/alt xətt ola bilər.' }, 400);
    }

    // ── Look up current username so we can no-op cleanly ──
    const { data: currentProfile, error: currentErr } = await admin
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    if (currentErr || !currentProfile) {
      return json({ error: 'Profil tapılmadı.' }, 404);
    }
    if (currentProfile.username.toLowerCase() === cleanUsername.toLowerCase()) {
      // Same name (possibly just a case change) — nothing to collide with.
      if (currentProfile.username === cleanUsername) {
        return json({ success: true, username: cleanUsername });
      }
    } else {
      // ── Case-insensitive uniqueness check, excluding the caller ──
      const { data: existing } = await admin
        .from('profiles')
        .select('id')
        .ilike('username', cleanUsername)
        .neq('id', userId)
        .maybeSingle();
      if (existing) return json({ error: 'Bu istifadəçi adı artıq mövcuddur.' }, 409);
    }

    const newShadowEmail = `${cleanUsername.toLowerCase()}@${SHADOW_DOMAIN}`;

    // ── Update the auth account (email + metadata) first ──
    // If this fails, we bail before touching the profiles row so the two
    // never drift out of sync.
    const { error: authUpdErr } = await admin.auth.admin.updateUserById(userId, {
      email: newShadowEmail,
      email_confirm: true,
      user_metadata: { ...callerData.user.user_metadata, username: cleanUsername },
    });
    if (authUpdErr) {
      // Most likely cause: another auth user already has this shadow email
      // (a race with someone else renaming/registering at the same instant).
      return json({ error: 'Bu istifadəçi adı artıq mövcuddur.' }, 409);
    }

    // ── Now update the profile row to match ──
    const { data: updatedProfile, error: profileErr } = await admin
      .from('profiles')
      .update({ username: cleanUsername })
      .eq('id', userId)
      .select()
      .single();

    if (profileErr) {
      // Roll back the auth email so the two don't end up out of sync.
      await admin.auth.admin.updateUserById(userId, {
        email: `${currentProfile.username.toLowerCase()}@${SHADOW_DOMAIN}`,
        email_confirm: true,
        user_metadata: { ...callerData.user.user_metadata, username: currentProfile.username },
      }).catch(() => {});
      console.error('profile update failed during username change:', profileErr);
      return json({ error: 'İstifadəçi adı yenilənmədi, yenidən cəhd et.' }, 500);
    }

    return json({ success: true, username: cleanUsername, profile: updatedProfile });
  } catch (e) {
    console.error('change-username crashed:', e);
    return json({ error: 'Gözlənilməz xəta baş verdi.' }, 500);
  }
});