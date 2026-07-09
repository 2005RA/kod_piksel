-- Lock down increment_profile_reward: it currently trusts whatever
-- p_task_id the caller passes, including null, which skips the
-- "already did this task" idempotency guard in _credit_reward and lets
-- anyone mint unlimited chips/keys/hourglasses by calling the RPC
-- directly from devtools in a loop.
--
-- Fix: introduce claim_task_reward, a public-facing wrapper that requires
-- a non-null p_task_id (so every client-initiated claim is deduped
-- server-side), and revoke direct EXECUTE on increment_profile_reward
-- from `authenticated`. Internal SECURITY DEFINER callers
-- (claim_race_reward, claim_weekly_reward) are owned by postgres and keep
-- working unaffected, since ownership grants implicit privilege
-- regardless of the authenticated revoke.

create or replace function public.claim_task_reward(
  p_delta_chips integer default 0,
  p_delta_keys integer default 0,
  p_delta_hourglasses integer default 0,
  p_task_id text default null,
  p_source text default 'other'
)
returns profiles
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  if p_task_id is null then
    raise exception 'p_task_id is required for client-initiated reward claims';
  end if;

  return public._credit_reward(v_uid, p_delta_chips, p_delta_keys, p_delta_hourglasses, p_task_id, p_source);
end;
$$;

revoke all on function public.claim_task_reward(integer, integer, integer, text, text) from public;
grant execute on function public.claim_task_reward(integer, integer, integer, text, text) to authenticated;

revoke execute on function public.increment_profile_reward(integer, integer, integer, text, text) from authenticated;
