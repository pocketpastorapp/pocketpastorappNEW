
-- Update the default value for free_credits column to 2
ALTER TABLE public.user_credits ALTER COLUMN free_credits SET DEFAULT 2;

-- Update the refresh_daily_credits function to set free credits to 2 instead of 5
CREATE OR REPLACE FUNCTION public.refresh_daily_credits()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- If the last free credit date is before today, update it and set free_credits to 2
  IF NEW.last_free_credit_date < CURRENT_DATE THEN
    NEW.free_credits = 2;
    NEW.last_free_credit_date = CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$function$
