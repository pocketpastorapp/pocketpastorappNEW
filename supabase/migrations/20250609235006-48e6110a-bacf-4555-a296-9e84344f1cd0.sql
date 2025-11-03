
-- Remove additional unused indexes that are not providing any performance benefit
DROP INDEX IF EXISTS idx_chat_messages_user_id;
DROP INDEX IF EXISTS idx_favorite_verses_user_id;
DROP INDEX IF EXISTS idx_user_notes_user_id;
