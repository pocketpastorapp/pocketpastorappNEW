
-- Create a table to track gift code redemptions
CREATE TABLE public.gift_code_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  gift_code TEXT NOT NULL,
  credits_awarded INTEGER NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, gift_code)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.gift_code_redemptions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own redemptions
CREATE POLICY "Users can view their own gift code redemptions" 
  ON public.gift_code_redemptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own redemptions
CREATE POLICY "Users can create their own gift code redemptions" 
  ON public.gift_code_redemptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
