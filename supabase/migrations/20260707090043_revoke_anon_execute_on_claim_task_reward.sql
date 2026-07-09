-- Supabase's default privileges grant EXECUTE on newly created public
-- functions to anon as well, independent of the "revoke ... from public"
-- above. claim_task_reward requires auth.uid(), so anon calls always
-- fail anyway, but revoke explicitly for defense in depth / clarity.
revoke execute on function public.claim_task_reward(integer, integer, integer, text, text) from anon;
