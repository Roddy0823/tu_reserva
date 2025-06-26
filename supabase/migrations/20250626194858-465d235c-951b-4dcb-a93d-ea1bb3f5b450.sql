
-- Create business_settings table
CREATE TABLE public.business_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  min_advance_hours INTEGER NOT NULL DEFAULT 2,
  max_advance_days INTEGER NOT NULL DEFAULT 30,
  allow_same_day_booking BOOLEAN NOT NULL DEFAULT true,
  cancellation_policy TEXT NOT NULL DEFAULT 'flexible',
  cancellation_hours INTEGER NOT NULL DEFAULT 24,
  require_confirmation BOOLEAN NOT NULL DEFAULT true,
  auto_confirm_bookings BOOLEAN NOT NULL DEFAULT false,
  cancellation_policy_text TEXT DEFAULT '',
  email_new_booking BOOLEAN NOT NULL DEFAULT true,
  email_booking_cancelled BOOLEAN NOT NULL DEFAULT true,
  email_booking_confirmed BOOLEAN NOT NULL DEFAULT true,
  email_payment_received BOOLEAN NOT NULL DEFAULT true,
  email_daily_summary BOOLEAN NOT NULL DEFAULT false,
  email_weekly_report BOOLEAN NOT NULL DEFAULT false,
  sms_new_booking BOOLEAN NOT NULL DEFAULT false,
  sms_booking_reminder BOOLEAN NOT NULL DEFAULT false,
  browser_notifications BOOLEAN NOT NULL DEFAULT true,
  sound_notifications BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for business owners to manage their settings
CREATE POLICY "Business owners can manage their settings" 
  ON public.business_settings 
  FOR ALL 
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX idx_business_settings_business_id ON public.business_settings(business_id);
