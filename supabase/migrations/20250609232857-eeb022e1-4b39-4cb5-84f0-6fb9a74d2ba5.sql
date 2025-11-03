
-- Fix the get_user_cluster_ids function to have a secure search_path
CREATE OR REPLACE FUNCTION public.get_user_cluster_ids()
 RETURNS TABLE(cluster_id uuid)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  RETURN QUERY 
  SELECT id FROM public.verse_clusters WHERE user_id = current_user_id;
END;
$function$
