-- The old policy ("own race_results", FOR ALL USING (true)) let any logged-in
-- client INSERT/UPDATE/DELETE any row in race_results directly — including
-- forging a fake time/rank for themselves or anyone else, completely
-- bypassing submit-race-result's server-side validation and endsAt check.
--
-- All legitimate writes already go through submit-race-result, which uses
-- the service_role key and therefore bypasses RLS entirely — so removing
-- client write access here does not affect that edge function at all.
-- Reads stay public (qual true) since the leaderboard needs to show every
-- participant, not just the current user.

drop policy if exists "own race_results" on public.race_results;

create policy "race_results readable by anyone"
  on public.race_results
  for select
  using (true);

-- Intentionally no insert/update/delete policy for anon/authenticated:
-- writes are service_role-only (submit-race-result edge function).
