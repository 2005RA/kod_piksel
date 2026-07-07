-- Correction: the previous migration's column-level REVOKE had no effect,
-- because anon/authenticated already hold a blanket table-level SELECT
-- grant (from the original `grant all`), and a table-level grant supersedes
-- a column-level revoke. To actually hide age/completed_tasks/puzzle_state,
-- the table-level SELECT has to be revoked and replaced with an explicit
-- column-level grant covering only the public/display columns.

revoke select on public.profiles from anon, authenticated;

grant select (
  id, username, avatar_url, avatar_emoji, level, xp, chips, keys,
  hourglasses, repeated_pixels, created_at
) on public.profiles to anon, authenticated;
