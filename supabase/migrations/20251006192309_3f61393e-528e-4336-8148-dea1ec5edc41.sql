-- Fix: Add trigger for daily credit refresh on UPDATE operations
-- Triggers can only be on INSERT, UPDATE, DELETE, or TRUNCATE, not SELECT

CREATE TRIGGER refresh_user_credits_daily
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.refresh_daily_credits();

-- Add comment explaining the trigger's purpose
COMMENT ON TRIGGER refresh_user_credits_daily ON public.user_credits IS 
'Automatically refreshes free_credits to 2 when a new day starts during credit updates';