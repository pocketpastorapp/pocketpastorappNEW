
-- Comprehensive cleanup of all duplicate policies on chat_messages table
-- Drop all existing policies to ensure no duplicates remain
DROP POLICY IF EXISTS "Users can view their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_select_policy" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view chat messages" ON public.chat_messages;

DROP POLICY IF EXISTS "Users can insert their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can create their own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert_policy" ON public.chat_messages;

DROP POLICY IF EXISTS "Users can update their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_update_policy" ON public.chat_messages;

DROP POLICY IF EXISTS "Users can delete their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_delete_policy" ON public.chat_messages;

-- Create single, clean policies for all operations
CREATE POLICY "chat_messages_select" 
ON public.chat_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "chat_messages_insert" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chat_messages_update" 
ON public.chat_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "chat_messages_delete" 
ON public.chat_messages 
FOR DELETE 
USING (auth.uid() = user_id);
