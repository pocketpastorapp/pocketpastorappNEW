
-- Add indexes for foreign key constraints to improve query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages (user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_verses_user_id ON public.favorite_verses (user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON public.user_notes (user_id);
