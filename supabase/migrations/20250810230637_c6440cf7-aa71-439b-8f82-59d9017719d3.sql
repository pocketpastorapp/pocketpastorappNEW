
-- Deletes all messages for sessions whose last activity is older than p_days
-- Only affects the currently authenticated user (via auth.uid()).
-- Sessions containing any favorited messages are preserved.
CREATE OR REPLACE FUNCTION public.delete_old_chat_sessions(
  p_days int DEFAULT 60
)
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

  WITH old_sessions AS (
    SELECT session_id
    FROM public.chat_messages
    WHERE user_id = current_user_id
      AND session_id IS NOT NULL
    GROUP BY session_id
    HAVING MAX(timestamp) < (now() - make_interval(days => p_days))
       AND BOOL_OR(is_favorite) IS NOT TRUE  -- keep any session that has a favorited message
  )
  DELETE FROM public.chat_messages cm
  USING old_sessions os
  WHERE cm.user_id = current_user_id
    AND cm.session_id = os.session_id;

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN QUERY SELECT COALESCE(v_deleted, 0);
END;
$function$;

COMMENT ON FUNCTION public.delete_old_chat_sessions IS
'Deletes all messages for sessions whose last message is older than p_days for the current user. Preserves any session with favorited messages. Returns total deleted rows.';
