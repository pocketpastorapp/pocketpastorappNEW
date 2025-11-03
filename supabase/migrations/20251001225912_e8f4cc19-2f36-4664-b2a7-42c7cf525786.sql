-- Drop existing SELECT policy on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a more secure SELECT policy that explicitly prevents unauthorized access
CREATE POLICY "Users can only view their own profile data"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Ensure anonymous users have no access
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Update the UPDATE policy to be more explicit
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can only update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Update the INSERT policy to be more explicit
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

CREATE POLICY "Users can only create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Log the security improvement
SELECT log_security_event(
  'rls_policy_updated',
  jsonb_build_object(
    'table', 'profiles',
    'reason', 'Enhanced email address protection',
    'changes', 'Explicit authenticated-only access, anonymous blocked'
  )
);