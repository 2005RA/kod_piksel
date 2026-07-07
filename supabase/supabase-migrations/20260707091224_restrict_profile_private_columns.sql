-- profiles is intentionally readable by anyone (SELECT true) so the
-- leaderboard/race-result embeds (`profiles(username, avatar_emoji, level)`)
-- can resolve other users' display info. Row-level "true" is fine for that,
-- but it also exposes every kid's exact age, and their private
-- completed_tasks/puzzle_state save data, to any other caller who selects
-- those columns directly.
--
-- Instead of loosening/tightening rows, restrict at the COLUMN level:
-- anon/authenticated lose SELECT on the private columns, but keep it on
-- everything actually used for public display/ranking. The row owner still
-- needs their own age/completed_tasks/puzzle_state, so we give them a
-- SECURITY DEFINER RPC that returns their own full row, bypassing the
-- column grant the same way claim_race_reward already bypasses RLS.

revoke select (age, completed_tasks, puzzle_state) on public.profiles from anon, authenticated;

create or replace function public.get_own_profile()
returns public.profiles
language sql
security definer
set search_path = public
stable
as $$
  select * from public.profiles where id = auth.uid();
$$;

grant execute on function public.get_own_profile() to authenticated;
