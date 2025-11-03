
-- Fix multiple permissive policies performance issue on cluster_verses table
-- First, drop all existing policies on cluster_verses
DROP POLICY IF EXISTS "Users can view cluster verses for their clusters" ON public.cluster_verses;
DROP POLICY IF EXISTS "Users can view cluster verses from their own clusters" ON public.cluster_verses;
DROP POLICY IF EXISTS "cluster_verses_select_policy" ON public.cluster_verses;
DROP POLICY IF EXISTS "Users can create cluster verses for their clusters" ON public.cluster_verses;
DROP POLICY IF EXISTS "Users can create cluster verses in their own clusters" ON public.cluster_verses;
DROP POLICY IF EXISTS "cluster_verses_insert_policy" ON public.cluster_verses;

-- Create single, optimized policies for cluster_verses
CREATE POLICY "Users can view their cluster verses" 
ON public.cluster_verses 
FOR SELECT 
USING (
  cluster_id IN (
    SELECT id FROM public.verse_clusters WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their cluster verses" 
ON public.cluster_verses 
FOR INSERT 
WITH CHECK (
  cluster_id IN (
    SELECT id FROM public.verse_clusters WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their cluster verses" 
ON public.cluster_verses 
FOR UPDATE 
USING (
  cluster_id IN (
    SELECT id FROM public.verse_clusters WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their cluster verses" 
ON public.cluster_verses 
FOR DELETE 
USING (
  cluster_id IN (
    SELECT id FROM public.verse_clusters WHERE user_id = auth.uid()
  )
);
