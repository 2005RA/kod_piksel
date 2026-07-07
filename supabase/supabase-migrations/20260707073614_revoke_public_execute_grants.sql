
-- The prior revoke-from-anon didn't stick because EXECUTE was granted to
-- PUBLIC (Postgres's default for new functions), and anon inherits PUBLIC's
-- privileges regardless of a role-specific revoke. Revoke from PUBLIC itself,
-- then explicitly re-grant only to the roles that actually need it.

revoke execute on function public.claim_race_reward(integer, timestamptz, text) from public;
grant execute on function public.claim_race_reward(integer, timestamptz, text) to authenticated;

revoke execute on function public.claim_weekly_reward(timestamptz) from public;
grant execute on function public.claim_weekly_reward(timestamptz) to authenticated;

revoke execute on function public.increment_profile_reward(integer, integer, integer, text, text) from public;
grant execute on function public.increment_profile_reward(integer, integer, integer, text, text) to authenticated;

revoke execute on function public.merge_guest_progress(integer, integer, integer, text[]) from public;
grant execute on function public.merge_guest_progress(integer, integer, integer, text[]) to authenticated;

-- handle_new_user is trigger-only, no session should call it directly
revoke execute on function public.handle_new_user() from public;
