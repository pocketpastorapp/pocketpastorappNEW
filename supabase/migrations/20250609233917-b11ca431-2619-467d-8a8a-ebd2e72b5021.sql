
-- Add Row Level Security policies to chat_messages table to improve realtime performance
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own messages
CREATE POLICY "Users can view their own chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for users to insert their own messages
CREATE POLICY "Users can insert their own chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own messages (for favorites)
CREATE POLICY "Users can update their own chat messages" 
ON public.chat_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for users to delete their own messages
CREATE POLICY "Users can delete their own chat messages" 
ON public.chat_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_session 
ON public.chat_messages (user_id, session_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_timestamp 
ON public.chat_messages (user_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_timestamp 
ON public.chat_messages (session_id, timestamp);
