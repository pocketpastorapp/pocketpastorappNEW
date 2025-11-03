
-- Add disclaimer_accepted column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN disclaimer_accepted boolean NOT NULL DEFAULT false;

-- Update the existing handle_new_user function to set disclaimer_accepted to false for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer set search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, disclaimer_accepted)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', new.email), false);
  RETURN NEW;
END;
$$;
