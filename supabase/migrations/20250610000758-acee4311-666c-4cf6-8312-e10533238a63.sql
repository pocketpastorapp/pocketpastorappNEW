
-- Configure tables for optimal real-time performance
-- Add REPLICA IDENTITY FULL to ensure complete row data during updates
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.favorite_verses REPLICA IDENTITY FULL;
ALTER TABLE public.user_notes REPLICA IDENTITY FULL;
ALTER TABLE public.verse_clusters REPLICA IDENTITY FULL;
ALTER TABLE public.cluster_verses REPLICA IDENTITY FULL;

-- Add tables to the supabase_realtime publication for real-time functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.favorite_verses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.verse_clusters;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cluster_verses;

-- Add indexes specifically for real-time filtering performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_user ON public.chat_messages (session_id, user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON public.chat_messages (timestamp DESC);
