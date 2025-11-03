-- Drop unused index flagged by performance linter
DROP INDEX IF EXISTS public.idx_chat_messages_user_id;