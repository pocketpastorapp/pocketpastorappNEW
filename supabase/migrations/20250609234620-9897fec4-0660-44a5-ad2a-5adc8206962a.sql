
-- Remove unused indexes that are not providing any performance benefit
DROP INDEX IF EXISTS idx_user_preferences_current_session;
DROP INDEX IF EXISTS idx_chat_messages_session_timestamp;
DROP INDEX IF EXISTS idx_chat_messages_user_timestamp;
DROP INDEX IF EXISTS idx_chat_messages_user_session;
