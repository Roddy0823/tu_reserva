
-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_cop INTEGER NOT NULL DEFAULT 0,
  max_bookings_per_month INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default plans
INSERT INTO public.subscription_plans (name, description, price_cop, max_bookings_per_month) VALUES 
('Gratuito', 'Plan gratuito con límite de 10 reservas por mes', 0, 10),
('Pro', 'Plan profesional con reservas ilimitadas', 60000, NULL);

-- Create business subscriptions table
CREATE TABLE public.business_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '1 month'),
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id)
);

-- Create monthly usage tracking table
CREATE TABLE public.monthly_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  completed_bookings INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id, year, month)
);

-- Set default free subscription for existing businesses
INSERT INTO public.business_subscriptions (business_id, plan_id)
SELECT b.id, p.id 
FROM public.businesses b
CROSS JOIN public.subscription_plans p
WHERE p.name = 'Gratuito'
ON CONFLICT (business_id) DO NOTHING;

-- Add Row Level Security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscription_plans (public read access)
CREATE POLICY "Anyone can view subscription plans" 
  ON public.subscription_plans 
  FOR SELECT 
  USING (true);

-- RLS policies for business_subscriptions
CREATE POLICY "Business owners can view their subscription" 
  ON public.business_subscriptions 
  FOR SELECT 
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can update their subscription" 
  ON public.business_subscriptions 
  FOR UPDATE 
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

-- RLS policies for monthly_usage
CREATE POLICY "Business owners can view their usage" 
  ON public.monthly_usage 
  FOR ALL 
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

-- Function to update monthly usage when appointments are completed
CREATE OR REPLACE FUNCTION update_monthly_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update when status changes to 'confirmado'
  IF NEW.status = 'confirmado' AND (OLD.status IS NULL OR OLD.status != 'confirmado') THEN
    INSERT INTO public.monthly_usage (business_id, year, month, completed_bookings)
    VALUES (
      NEW.business_id,
      EXTRACT(YEAR FROM NEW.start_time),
      EXTRACT(MONTH FROM NEW.start_time),
      1
    )
    ON CONFLICT (business_id, year, month)
    DO UPDATE SET 
      completed_bookings = monthly_usage.completed_bookings + 1,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update usage
CREATE TRIGGER update_monthly_usage_trigger
  AFTER UPDATE OF status ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_monthly_usage();

-- Function to check if business can accept new bookings
CREATE OR REPLACE FUNCTION can_accept_booking(business_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_plan_max_bookings INTEGER;
  current_usage INTEGER;
  current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
  current_month INTEGER := EXTRACT(MONTH FROM CURRENT_DATE);
BEGIN
  -- Get the max bookings for current plan
  SELECT sp.max_bookings_per_month INTO current_plan_max_bookings
  FROM public.business_subscriptions bs
  JOIN public.subscription_plans sp ON bs.plan_id = sp.id
  WHERE bs.business_id = business_uuid AND bs.status = 'active';
  
  -- If unlimited (NULL), always allow
  IF current_plan_max_bookings IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Get current month usage
  SELECT COALESCE(completed_bookings, 0) INTO current_usage
  FROM public.monthly_usage
  WHERE business_id = business_uuid 
    AND year = current_year 
    AND month = current_month;
  
  -- Check if under limit
  RETURN current_usage < current_plan_max_bookings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_business_subscriptions_business_id ON public.business_subscriptions(business_id);
CREATE INDEX idx_monthly_usage_business_date ON public.monthly_usage(business_id, year, month);
