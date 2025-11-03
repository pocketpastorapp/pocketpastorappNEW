-- Security Fix 1: Remove conflicting RLS policy on profiles table
-- The "Block anonymous access to profiles" policy conflicts with "Users can only view their own profile data"
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;

-- Security Fix 2: Add explicit financial record protection
-- Prevent any updates to purchase records (financial records should be immutable)
CREATE POLICY "Prevent all purchase updates"
ON public.purchases
FOR UPDATE
USING (false);

-- Prevent any deletions of purchase records (financial records should be permanent)
CREATE POLICY "Prevent all purchase deletions"
ON public.purchases
FOR DELETE
USING (false);

-- Log the security improvements
COMMENT ON POLICY "Prevent all purchase updates" ON public.purchases IS 
'Security: Financial records are immutable - no updates allowed';

COMMENT ON POLICY "Prevent all purchase deletions" ON public.purchases IS 
'Security: Financial records are permanent - no deletions allowed';