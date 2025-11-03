
-- Create a security definer function to get user's cluster IDs
-- This avoids re-evaluating auth.uid() for each row
CREATE OR REPLACE FUNCTION public.get_user_cluster_ids()
RETURNS TABLE(cluster_id uuid)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  RETURN QUERY 
  SELECT id FROM public.verse_clusters WHERE user_id = current_user_id;
END;
$$;

-- Drop existing policies on cluster_verses
DROP POLICY IF EXISTS "cluster_verses_select" ON public.cluster_verses;
DROP POLICY IF EXISTS "cluster_verses_insert" ON public.cluster_verses;
DROP POLICY IF EXISTS "cluster_verses_update" ON public.cluster_verses;
DROP POLICY IF EXISTS "cluster_verses_delete" ON public.cluster_verses;

-- Create optimized policies using the security definer function
CREATE POLICY "cluster_verses_select" 
ON public.cluster_verses 
FOR SELECT 
USING (cluster_id IN (SELECT cluster_id FROM public.get_user_cluster_ids()));

CREATE POLICY "cluster_verses_insert" 
ON public.cluster_verses 
FOR INSERT 
WITH CHECK (cluster_id IN (SELECT cluster_id FROM public.get_user_cluster_ids()));

CREATE POLICY "cluster_verses_update" 
ON public.cluster_verses 
FOR UPDATE 
USING (cluster_id IN (SELECT cluster_id FROM public.get_user_cluster_ids()));

CREATE POLICY "cluster_verses_delete" 
ON public.cluster_verses 
FOR DELETE 
USING (cluster_id IN (SELECT cluster_id FROM public.get_user_cluster_ids()));
