CREATE OR REPLACE FUNCTION public.claim_race_reward(p_race_id integer, p_ends_at timestamp with time zone, p_sort_col text)
 RETURNS TABLE(rank integer, keys_awarded integer, hourglasses_awarded integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_uid uuid := auth.uid();
  v_rank int;
  v_keys int;
  v_hg int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_sort_col not in ('time_taken', 'char_count') then
    raise exception 'invalid sort column';
  end if;

  -- Rewards depend on ranking ALL participants, so we must not compute
  -- (and lock in) a rank until the race's own end time has actually
  -- passed. Previously this was only enforced client-side (by only
  -- calling this RPC for races whose endsAt already elapsed), which made
  -- it trivial to get an early/partial ranking — by calling the RPC
  -- directly, via a client timing edge case, or via any stale-race sweep.
  if now() < p_ends_at then
    return;
  end if;

  if exists (
    select 1 from public.race_reward_claims
    where user_id = v_uid and race_id = p_race_id and ends_at = p_ends_at
  ) then
    return;
  end if;

  if not exists (
    select 1 from public.race_results
    where user_id = v_uid and race_id = p_race_id and ends_at = p_ends_at and completed = true
  ) then
    return;
  end if;

  execute format(
    'select rank from (
       select user_id, row_number() over (order by %I asc, completed_at asc) as rank
       from public.race_results
       where race_id = $1 and ends_at = $2 and completed = true
     ) ranked where user_id = $3',
    p_sort_col
  ) into v_rank using p_race_id, p_ends_at, v_uid;

  if v_rank is null then return; end if;

  select rt.keys, rt.hourglasses into v_keys, v_hg
  from public.race_end_reward_tiers rt
  where v_rank between rt.min_rank and rt.max_rank
  order by rt.min_rank limit 1;

  insert into public.race_reward_claims (user_id, race_id, ends_at, rank)
  values (v_uid, p_race_id, p_ends_at, v_rank);

  if coalesce(v_keys, 0) > 0 or coalesce(v_hg, 0) > 0 then
    perform public.increment_profile_reward(0, coalesce(v_keys, 0), coalesce(v_hg, 0), null, 'race_reward');
  end if;

  return query select v_rank, coalesce(v_keys, 0), coalesce(v_hg, 0);
end;
$function$;
