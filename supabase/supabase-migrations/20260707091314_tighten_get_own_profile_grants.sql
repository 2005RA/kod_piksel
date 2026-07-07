-- New functions grant EXECUTE to PUBLIC by default, which includes anon.
-- Harmless here (auth.uid() is null for anon, so it just returns no row),
-- but there's no reason to leave it open — restrict to authenticated only,
-- consistent with the rest of the reward RPCs.
revoke execute on function public.get_own_profile() from public;
grant execute on function public.get_own_profile() to authenticated;
