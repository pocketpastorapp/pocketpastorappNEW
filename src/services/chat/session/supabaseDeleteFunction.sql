
-- SQL function to delete a session and all its messages in one operation
-- This should be executed in your Supabase SQL editor

CREATE OR REPLACE FUNCTION public.delete_session_with_messages(p_user_id UUID, p_session_id TEXT)
RETURNS void AS $$
BEGIN
  DELETE FROM chat_messages 
  WHERE user_id = p_user_id AND session_id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.delete_session_with_messages IS 'Deletes all messages for a specific session belonging to a user';

-- Note: After executing this SQL function in your Supabase SQL editor,
-- you'll need to update the TypeScript types to include this RPC function.
-- For now, we're using direct database operations in the deleteSession function.
