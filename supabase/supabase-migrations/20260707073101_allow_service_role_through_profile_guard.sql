
-- The register and change-username edge functions write to profiles
-- using the service_role key (not the RPCs). Let those through too,
-- since service_role calls are already fully trusted server-side code.
create or replace function public.protect_profile_reward_columns()
returns trigger
language plpgsql
as $$
begin
  if current_setting('kodpiksel.allow_reward_write', true) = 'true'
     or auth.role() = 'service_role'
  then
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
