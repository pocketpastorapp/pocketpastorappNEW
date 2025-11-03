-- Add covering index for foreign key public.user_notes(user_id)
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON public.user_notes USING btree (user_id);