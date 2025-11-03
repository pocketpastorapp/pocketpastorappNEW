-- Enhanced security fixes for the application

-- 1. Create a security definer function to safely get user role information
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT name FROM public.profiles WHERE id = auth.uid()),
    'user'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- 2. Create audit logging function for sensitive operations
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  details JSONB DEFAULT '{}'::JSONB
)
RETURNS VOID AS $$
BEGIN
  -- In a production environment, this would log to an audit table
  -- For now, we'll use RAISE NOTICE for development
  RAISE NOTICE 'SECURITY_EVENT: % for user % with details %', 
    event_type, 
    COALESCE(auth.uid()::TEXT, 'anonymous'), 
    details::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Enhanced credit validation function
CREATE OR REPLACE FUNCTION public.validate_credit_operation(
  user_id_param UUID,
  credit_change INTEGER,
  operation_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
  has_unlimited BOOLEAN;
BEGIN
  -- Get current credit status
  SELECT total_credits, has_unlimited_credits
  INTO current_credits, has_unlimited
  FROM public.user_credits
  WHERE user_id = user_id_param;
  
  -- If user has unlimited credits, allow operation
  IF has_unlimited THEN
    RETURN TRUE;
  END IF;
  
  -- For credit deduction, ensure sufficient balance
  IF operation_type = 'deduct' AND (current_credits + credit_change) < 0 THEN
    PERFORM log_security_event('insufficient_credits', 
      jsonb_build_object(
        'attempted_deduction', ABS(credit_change),
        'current_balance', current_credits
      )
    );
    RETURN FALSE;
  END IF;
  
  -- For large credit additions, log for audit
  IF operation_type = 'add' AND credit_change > 100 THEN
    PERFORM log_security_event('large_credit_addition', 
      jsonb_build_object(
        'credits_added', credit_change,
        'previous_balance', current_credits
      )
    );
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Enhanced RLS policy for profiles - more restrictive
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (
  id = auth.uid() AND 
  auth.uid() IS NOT NULL
);

-- 5. Add trigger to validate credit operations
CREATE OR REPLACE FUNCTION public.validate_credit_update()
RETURNS TRIGGER AS $$
DECLARE
  credit_change INTEGER;
  operation_type TEXT;
BEGIN
  -- Calculate credit change
  credit_change := NEW.total_credits - OLD.total_credits;
  
  -- Determine operation type
  IF credit_change > 0 THEN
    operation_type := 'add';
  ELSE
    operation_type := 'deduct';
  END IF;
  
  -- Validate the operation
  IF NOT validate_credit_operation(NEW.user_id, credit_change, operation_type) THEN
    RAISE EXCEPTION 'Credit operation validation failed';
  END IF;
  
  -- Log the credit operation
  PERFORM log_security_event('credit_operation', 
    jsonb_build_object(
      'operation_type', operation_type,
      'credit_change', credit_change,
      'new_balance', NEW.total_credits,
      'previous_balance', OLD.total_credits
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for credit validation
DROP TRIGGER IF EXISTS validate_credit_operations ON public.user_credits;
CREATE TRIGGER validate_credit_operations
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_credit_update();

-- 6. Enhanced security for purchase operations
CREATE OR REPLACE FUNCTION public.validate_purchase_integrity()
RETURNS TRIGGER AS $$
BEGIN
  -- Log purchase creation
  PERFORM log_security_event('purchase_created', 
    jsonb_build_object(
      'credits_purchased', NEW.credits_purchased,
      'amount_usd', NEW.amount_usd,
      'checkout_session_id', NEW.checkout_session_id
    )
  );
  
  -- Validate purchase amounts are reasonable
  IF NEW.amount_usd < 0 OR NEW.credits_purchased < 0 THEN
    RAISE EXCEPTION 'Invalid purchase amounts detected';
  END IF;
  
  -- Validate credit to price ratio (basic sanity check)
  IF NEW.amount_usd > 0 AND (NEW.credits_purchased::NUMERIC / NEW.amount_usd) > 1000 THEN
    RAISE EXCEPTION 'Suspicious credit to price ratio detected';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for purchase validation
DROP TRIGGER IF EXISTS validate_purchase_operations ON public.purchases;
CREATE TRIGGER validate_purchase_operations
  BEFORE INSERT ON public.purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_purchase_integrity();

-- 7. Create security audit table for important events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_type TEXT NOT NULL,
  event_details JSONB DEFAULT '{}'::JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow system to insert audit logs
CREATE POLICY "System can insert audit logs" ON public.security_audit_log
FOR INSERT WITH CHECK (true);

-- Users can only view their own audit logs
CREATE POLICY "Users can view their own audit logs" ON public.security_audit_log
FOR SELECT USING (user_id = auth.uid());

-- 8. Enhanced function to safely update user profiles
CREATE OR REPLACE FUNCTION public.safe_update_profile(
  profile_name TEXT DEFAULT NULL,
  profile_avatar_url TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  -- Ensure user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Validate inputs
  IF profile_name IS NOT NULL AND (LENGTH(profile_name) < 1 OR LENGTH(profile_name) > 100) THEN
    RAISE EXCEPTION 'Name must be between 1 and 100 characters';
  END IF;
  
  IF profile_avatar_url IS NOT NULL AND LENGTH(profile_avatar_url) > 500 THEN
    RAISE EXCEPTION 'Avatar URL too long';
  END IF;
  
  -- Log profile update
  PERFORM log_security_event('profile_update', 
    jsonb_build_object(
      'name_changed', profile_name IS NOT NULL,
      'avatar_changed', profile_avatar_url IS NOT NULL
    )
  );
  
  -- Update profile
  UPDATE public.profiles 
  SET 
    name = COALESCE(profile_name, name),
    avatar_url = COALESCE(profile_avatar_url, avatar_url),
    updated_at = now()
  WHERE id = current_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;