-- Supabase auto-grants EXECUTE to anon/authenticated/service_role on newly
-- created functions in the public schema (separately from the PUBLIC
-- pseudo-role), so the earlier "revoke ... from public" didn't actually
-- touch anon's grant. Revoke it explicitly — get_own_profile is only
-- meaningful for a signed-in caller anyway.
revoke execute on function public.get_own_profile() from anon;
