-- Fix: claim_weekly_reward previously took a `date` param, which the client
-- built via `someLocalDate.toISOString().slice(0,10)`. That silently converts
-- a *local* midnight into its UTC calendar date, which for timezones ahead of
-- UTC (e.g. Baku, UTC+4) rolls back to the previous day. The date was then
-- cast to timestamptz (interpreted as UTC midnight), shifting the whole
-- reward week ~4-24h earlier than the real local Mon 00:00 -> Sun 24:00 week.
--
-- Fix: accept a timestamptz (an absolute instant) instead of a date. The
-- client now passes `localMondayMidnight.toISOString()` directly, which
-- correctly represents "local Monday 00:00" as an absolute instant regardless
-- of timezone. No conversion ambiguity left.

drop function if exists public.claim_weekly_reward(date);

create or replace function public.claim_weekly_reward(p_week_start timestamptz)
returns table(rank integer, keys_awarded integer, hourglasses_awarded integer)
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_uid uuid := auth.uid();
  v_rank int;
  v_keys int;
  v_hg int;
  -- Deterministic per-week bucket key for the idempotency check below.
  -- Always the same value for the same absolute week, regardless of session tz.
  v_week_key date := (p_week_start at time zone 'UTC')::date;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  if exists (
    select 1 from public.weekly_reward_claims
    where user_id = v_uid and week_start = v_week_key
  ) then
    return;
  end if;

  select ranked.rank into v_rank from (
    select user_id, row_number() over (order by sum(amount) desc) as rank
    from public.chip_events
    where created_at >= p_week_start
      and created_at <  (p_week_start + interval '7 days')
    group by user_id
  ) ranked where ranked.user_id = v_uid;

  if v_rank is null then return; end if;

  select wt.keys, wt.hourglasses into v_keys, v_hg
  from public.weekly_reward_tiers wt
  where v_rank between wt.min_rank and wt.max_rank
  order by wt.min_rank limit 1;

  insert into public.weekly_reward_claims (user_id, week_start, rank)
  values (v_uid, v_week_key, v_rank);

  if coalesce(v_keys, 0) > 0 or coalesce(v_hg, 0) > 0 then
    perform public.increment_profile_reward(0, coalesce(v_keys, 0), coalesce(v_hg, 0), null, 'weekly_reward');
  end if;

  return query select v_rank, coalesce(v_keys, 0), coalesce(v_hg, 0);
end;
$function$;

grant execute on function public.claim_weekly_reward(timestamptz) to anon, authenticated, service_role;
