-- Fix security warning: set stable search_path for trigger function
CREATE OR REPLACE FUNCTION public.set_default_sort_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  max_order integer;
BEGIN
  IF NEW.sort_order IS NULL THEN
    SELECT COALESCE(MAX(sort_order), 0) INTO max_order
    FROM public.verse_clusters
    WHERE user_id = NEW.user_id;
    NEW.sort_order := max_order + 1;
  END IF;
  RETURN NEW;
END;
$function$;