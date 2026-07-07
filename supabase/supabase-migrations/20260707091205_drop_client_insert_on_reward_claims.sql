-- The client has no legitimate reason to INSERT into these tables directly:
-- claim_race_reward / claim_weekly_reward are SECURITY DEFINER and bypass RLS
-- entirely to write claim rows themselves after validating rank/eligibility.
-- The existing "auth.uid() = user_id" INSERT policies let any signed-in user
-- POST a fake row with an arbitrary race_id/rank/ends_at, which can't mint
-- rewards (no trigger grants anything on insert) but does corrupt claim
-- history and can permanently block a real future claim for that race,
-- since claim_race_reward checks exists() on this table first.

drop policy if exists "Users insert own race claims" on public.race_reward_claims;
drop policy if exists "Users insert own weekly claims" on public.weekly_reward_claims;
