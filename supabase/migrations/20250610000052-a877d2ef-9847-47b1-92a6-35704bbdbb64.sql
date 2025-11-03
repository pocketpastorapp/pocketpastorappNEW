
-- Create a security definer function to get current user ID
-- This avoids re-evaluating auth.uid() for each row
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN auth.uid();
END;
$$;

-- Drop and recreate chat_messages policies with optimized approach
DROP POLICY IF EXISTS "chat_messages_select" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_update" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_delete" ON public.chat_messages;

-- Create optimized policies using the security definer function
CREATE POLICY "chat_messages_select" 
ON public.chat_messages 
FOR SELECT 
USING (user_id = public.get_current_user_id());

CREATE POLICY "chat_messages_insert" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (user_id = public.get_current_user_id());

CREATE POLICY "chat_messages_update" 
ON public.chat_messages 
FOR UPDATE 
USING (user_id = public.get_current_user_id());

CREATE POLICY "chat_messages_delete" 
ON public.chat_messages 
FOR DELETE 
USING (user_id = public.get_current_user_id());

-- Also optimize gift_code_redemptions policies
DROP POLICY IF EXISTS "Users can view their own gift code redemptions" ON public.gift_code_redemptions;
DROP POLICY IF EXISTS "Users can create their own gift code redemptions" ON public.gift_code_redemptions;

CREATE POLICY "gift_code_redemptions_select" 
ON public.gift_code_redemptions 
FOR SELECT 
USING (user_id = public.get_current_user_id());

CREATE POLICY "gift_code_redemptions_insert" 
ON public.gift_code_redemptions 
FOR INSERT 
WITH CHECK (user_id = public.get_current_user_id());
