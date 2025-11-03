
-- Fix the delete_session_messages function to have a secure search_path
CREATE OR REPLACE FUNCTION public.delete_session_messages(p_user_id uuid, p_session_id text)
 RETURNS TABLE(deleted_count integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  result_count INTEGER;
BEGIN
  -- Delete all messages for the specified user and session
  DELETE FROM public.chat_messages 
  WHERE user_id = p_user_id AND session_id = p_session_id;
  
  -- Get the count of deleted rows
  GET DIAGNOSTICS result_count = ROW_COUNT;
  
  -- Return the count
  RETURN QUERY SELECT result_count;
END;
$function$
