-- Add covering index for FK public.chat_messages(user_id)
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages USING btree (user_id);