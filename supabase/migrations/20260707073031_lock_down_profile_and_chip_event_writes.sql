
-- ============================================================
-- FIX 1: profiles table — stop direct client writes to reward
-- fields and username (chips/keys/hourglasses/level/xp/
-- completed_tasks/repeated_pixels/username). These must only be
-- changed via the SECURITY DEFINER functions (_credit_reward,
-- increment_profile_reward, merge_guest_progress) or the
-- change-username edge function.
-- ============================================================

-- Drop the old blanket policies that allowed updating any column
-- on your own row.
drop policy if exists "own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Re-add a narrower UPDATE policy: still scoped to your own row,
-- but the trigger below is what actually blocks protected columns.
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Users can still read their own row for anything not covered by
-- the public "Viewable for ranking" policy (kept as-is).

create or replace function public.protect_profile_reward_columns()
returns trigger
language plpgsql
as $$
begin
  -- RPCs that are allowed to change these fields set this
  -- session-local flag right before they perform the update.
  if current_setting('kodpiksel.allow_reward_write', true) = 'true' then
    return new;
  end if;

  if new.chips is distinct from old.chips
     or new.keys is distinct from old.keys
     or new.hourglasses is distinct from old.hourglasses
     or new.level is distinct from old.level
     or new.xp is distinct from old.xp
     or new.repeated_pixels is distinct from old.repeated_pixels
     or new.completed_tasks is distinct from old.completed_tasks
     or new.username is distinct from old.username
  then
    raise exception 'These fields can only be changed via server-side functions';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_protect_profile_reward_columns on public.profiles;
create trigger trg_protect_profile_reward_columns
before update on public.profiles
for each row execute function public.protect_profile_reward_columns();

-- Let the reward-crediting functions flip the flag before writing.
create or replace function public._credit_reward(p_user_id uuid, p_delta_chips integer DEFAULT 0, p_delta_keys integer DEFAULT 0, p_delta_hourglasses integer DEFAULT 0, p_task_id text DEFAULT NULL::text, p_source text DEFAULT 'other'::text)
 returns profiles
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_profile public.profiles;
  v_new_chips int;
  v_new_keys int;
  v_new_hourglasses int;
  v_tasks jsonb;
begin
  if p_delta_chips < 0 or p_delta_chips > 100
     or p_delta_keys < -100 or p_delta_keys > 100
     or p_delta_hourglasses < -100 or p_delta_hourglasses > 100 then
    raise exception 'reward delta out of allowed range';
  end if;

  select * into v_profile from public.profiles where id = p_user_id for update;
  if not found then
    raise exception 'profile not found';
  end if;

  v_new_keys := v_profile.keys + p_delta_keys;
  v_new_hourglasses := v_profile.hourglasses + p_delta_hourglasses;
  if v_new_keys < 0 or v_new_hourglasses < 0 then
    raise exception 'insufficient balance';
  end if;

  v_tasks := coalesce(v_profile.completed_tasks, '[]'::jsonb);

  if p_task_id is not null then
    if v_tasks @> to_jsonb(p_task_id) then
      return v_profile;
    end if;
    v_tasks := v_tasks || jsonb_build_array(p_task_id);
  end if;

  v_new_chips := v_profile.chips + p_delta_chips;

  perform set_config('kodpiksel.allow_reward_write', 'true', true);

  update public.profiles
     set chips           = v_new_chips,
         keys            = v_new_keys,
         hourglasses     = v_new_hourglasses,
         level           = public.calc_level(v_new_chips),
         completed_tasks = v_tasks
   where id = p_user_id
   returning * into v_profile;

  perform set_config('kodpiksel.allow_reward_write', 'false', true);

  if p_delta_chips > 0 then
    insert into public.chip_events (user_id, amount, source, source_id)
    values (p_user_id, p_delta_chips, p_source, p_task_id);
  end if;

  return v_profile;
end;
$function$;

-- ============================================================
-- FIX 2: chip_events — clients could insert fake ledger rows
-- with arbitrary amounts to fake their leaderboard position.
-- Only _credit_reward (SECURITY DEFINER, owned by postgres,
-- bypasses RLS) should ever write here.
-- ============================================================
drop policy if exists "Users insert own chip events" on public.chip_events;
-- "Leaderboard read access" (SELECT, true) is left as-is.

-- ============================================================
-- FIX 3: merge_guest_progress — no idempotency guard meant any
-- authenticated user could call it repeatedly for unlimited
-- chips/keys/hourglasses. Add a one-time claim table.
-- ============================================================
create table if not exists public.guest_merge_claims (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  merged_at timestamptz not null default now()
);
alter table public.guest_merge_claims enable row level security;

create policy "Users read own guest merge claim"
on public.guest_merge_claims
for select
using (auth.uid() = user_id);

create or replace function public.merge_guest_progress(p_delta_chips integer, p_delta_keys integer, p_delta_hourglasses integer, p_task_ids text[])
 returns profiles
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles;
  v_new_tasks jsonb;
  v_new_chips int;
  t text;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_delta_chips < 0 or p_delta_chips > 5000
     or p_delta_keys < 0 or p_delta_keys > 500
     or p_delta_hourglasses < 0 or p_delta_hourglasses > 500 then
    raise exception 'merge amount out of allowed range';
  end if;

  -- Idempotency: a given account can only ever merge guest progress once.
  if exists (select 1 from public.guest_merge_claims where user_id = v_uid) then
    select * into v_profile from public.profiles where id = v_uid;
    return v_profile;
  end if;
  insert into public.guest_merge_claims (user_id) values (v_uid);

  select * into v_profile from public.profiles where id = v_uid for update;
  if not found then raise exception 'profile not found'; end if;

  v_new_tasks := coalesce(v_profile.completed_tasks, '[]'::jsonb);
  if p_task_ids is not null then
    foreach t in array p_task_ids loop
      if not (v_new_tasks @> to_jsonb(t)) then
        v_new_tasks := v_new_tasks || jsonb_build_array(t);
      end if;
    end loop;
  end if;

  v_new_chips := v_profile.chips + p_delta_chips;

  perform set_config('kodpiksel.allow_reward_write', 'true', true);

  update public.profiles
     set chips           = v_new_chips,
         keys            = keys + p_delta_keys,
         hourglasses     = hourglasses + p_delta_hourglasses,
         level           = public.calc_level(v_new_chips),
         completed_tasks = v_new_tasks
   where id = v_uid
   returning * into v_profile;

  perform set_config('kodpiksel.allow_reward_write', 'false', true);

  if p_delta_chips > 0 then
    insert into public.chip_events (user_id, amount, source, source_id)
    values (v_uid, p_delta_chips, 'guest_merge', null);
  end if;

  return v_profile;
end;
$function$;
