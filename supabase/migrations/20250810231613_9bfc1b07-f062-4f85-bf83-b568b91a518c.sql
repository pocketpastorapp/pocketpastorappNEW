-- Update delete_old_chat_sessions to delete non-favorites and detach favorites from old sessions
CREATE OR REPLACE FUNCTION public.delete_old_chat_sessions(p_days integer DEFAULT 60)
RETURNS TABLE(deleted_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id uuid := auth.uid();
  v_deleted integer := 0;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_days IS NULL OR p_days < 1 THEN
    RAISE EXCEPTION 'p_days must be >= 1';
  END IF;

  -- 1) Delete NON-favorite messages from any session whose last activity is older than p_days
  WITH old_sessions AS (
    SELECT session_id
    FROM public.chat_messages
    WHERE user_id = current_user_id
      AND session_id IS NOT NULL
    GROUP BY session_id
    HAVING MAX(timestamp) < (now() - make_interval(days => p_days))
  )
  DELETE FROM public.chat_messages cm
  USING old_sessions os
  WHERE cm.user_id = current_user_id
    AND cm.session_id = os.session_id
    AND COALESCE(cm.is_favorite, false) = false;

  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  -- 2) Detach remaining FAVORITE messages from those old sessions so they don't appear in History
  WITH old_sessions AS (
    SELECT session_id
    FROM public.chat_messages
    WHERE user_id = current_user_id
      AND session_id IS NOT NULL
    GROUP BY session_id
    HAVING MAX(timestamp) < (now() - make_interval(days => p_days))
  )
  UPDATE public.chat_messages cm
  SET session_id = NULL
  FROM old_sessions os
  WHERE cm.user_id = current_user_id
    AND cm.session_id = os.session_id
    AND COALESCE(cm.is_favorite, false) = true;

  RETURN QUERY SELECT COALESCE(v_deleted, 0);
END;
$function$;

COMMENT ON FUNCTION public.delete_old_chat_sessions IS
'Deletes non-favorite messages from sessions older than p_days and detaches remaining favorites from those sessions so they no longer appear in History. Returns the number of deleted rows.';