-- Add sort_order to verse_clusters for manual reordering
ALTER TABLE public.verse_clusters
ADD COLUMN IF NOT EXISTS sort_order integer;

-- Initialize existing rows: order by created_at ascending so oldest at top
UPDATE public.verse_clusters vc
SET sort_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) AS rn
  FROM public.verse_clusters
) AS sub
WHERE vc.id = sub.id AND vc.sort_order IS NULL;

-- Ensure not null going forward by setting default to next highest order for the user via trigger
-- Create a function to set default sort_order per user
CREATE OR REPLACE FUNCTION public.set_default_sort_order()
RETURNS TRIGGER AS $$
DECLARE
  max_order integer;
BEGIN
  IF NEW.sort_order IS NULL THEN
    SELECT COALESCE(MAX(sort_order), 0) INTO max_order FROM public.verse_clusters WHERE user_id = NEW.user_id;
    NEW.sort_order := max_order + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to apply before insert
DROP TRIGGER IF EXISTS trg_set_default_sort_order ON public.verse_clusters;
CREATE TRIGGER trg_set_default_sort_order
BEFORE INSERT ON public.verse_clusters
FOR EACH ROW EXECUTE FUNCTION public.set_default_sort_order();

-- Helpful index for ordering within a user
CREATE INDEX IF NOT EXISTS idx_verse_clusters_user_sort ON public.verse_clusters(user_id, sort_order);
