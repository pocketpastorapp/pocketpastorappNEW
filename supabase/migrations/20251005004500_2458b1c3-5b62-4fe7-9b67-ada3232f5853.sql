-- Add gender column to profiles table
ALTER TABLE public.profiles
ADD COLUMN gender text CHECK (gender IN ('male', 'female', 'prefer_not_to_say'));

-- Add a comment explaining the column
COMMENT ON COLUMN public.profiles.gender IS 'User gender for personalized communication';
