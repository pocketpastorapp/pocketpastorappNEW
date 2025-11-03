
-- Comprehensive cleanup of all remaining duplicate policies on cluster_verses table
-- Drop any remaining policies that might still exist
DROP POLICY IF EXISTS "Users can update their cluster verses" ON public.cluster_verses;
DROP POLICY IF EXISTS "cluster_verses_update_policy" ON public.cluster_verses;
DROP POLICY IF EXISTS "Users can update cluster verses for their clusters" ON public.cluster_verses;
DROP POLICY IF EXISTS "Users can update cluster verses from their own clusters" ON public.cluster_verses;

DROP POLICY IF EXISTS "Users can delete their cluster verses" ON public.cluster_verses;
DROP POLICY IF EXISTS "cluster_verses_delete_policy" ON public.cluster_verses;
DROP POLICY IF EXISTS "Users can delete cluster verses for their clusters" ON public.cluster_verses;
DROP POLICY IF EXISTS "Users can delete cluster verses from their own clusters" ON public.cluster_verses;

-- Also ensure we clean up any remaining SELECT/INSERT duplicates
DROP POLICY IF EXISTS "Users can view their cluster verses" ON public.cluster_verses;
DROP POLICY IF EXISTS "Users can insert their cluster verses" ON public.cluster_verses;

-- Now recreate single, clean policies for all operations
CREATE POLICY "cluster_verses_select" 
ON public.cluster_verses 
FOR SELECT 
USING (
  cluster_id IN (
    SELECT id FROM public.verse_clusters WHERE user_id = auth.uid()
  )
);

CREATE POLICY "cluster_verses_insert" 
ON public.cluster_verses 
FOR INSERT 
WITH CHECK (
  cluster_id IN (
    SELECT id FROM public.verse_clusters WHERE user_id = auth.uid()
  )
);

CREATE POLICY "cluster_verses_update" 
ON public.cluster_verses 
FOR UPDATE 
USING (
  cluster_id IN (
    SELECT id FROM public.verse_clusters WHERE user_id = auth.uid()
  )
);

CREATE POLICY "cluster_verses_delete" 
ON public.cluster_verses 
FOR DELETE 
USING (
  cluster_id IN (
    SELECT id FROM public.verse_clusters WHERE user_id = auth.uid()
  )
);
