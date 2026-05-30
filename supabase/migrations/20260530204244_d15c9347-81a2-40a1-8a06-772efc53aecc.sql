
-- ============= ENUMS =============
DO $$ BEGIN
  CREATE TYPE public.appointment_status AS ENUM ('pendiente','confirmado','cancelado','completado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_validation_status AS ENUM ('pendiente','aprobado','rechazado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.subscription_status AS ENUM ('active','cancelled','past_due');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============= TIMESTAMP TRIGGER =============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============= BUSINESSES =============
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  logo_url TEXT,
  booking_url_slug TEXT NOT NULL UNIQUE,
  bank_account_details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.businesses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "businesses_public_read" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "businesses_owner_insert" ON public.businesses FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "businesses_owner_update" ON public.businesses FOR UPDATE TO authenticated USING (auth.uid() = owner_user_id);
CREATE POLICY "businesses_owner_delete" ON public.businesses FOR DELETE TO authenticated USING (auth.uid() = owner_user_id);
CREATE TRIGGER trg_businesses_updated BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= BUSINESS_SETTINGS =============
CREATE TABLE public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE UNIQUE,
  min_advance_hours INTEGER NOT NULL DEFAULT 2,
  max_advance_days INTEGER NOT NULL DEFAULT 60,
  allow_same_day_booking BOOLEAN NOT NULL DEFAULT true,
  cancellation_policy TEXT NOT NULL DEFAULT 'flexible',
  cancellation_hours INTEGER NOT NULL DEFAULT 24,
  require_confirmation BOOLEAN NOT NULL DEFAULT false,
  auto_confirm_bookings BOOLEAN NOT NULL DEFAULT true,
  cancellation_policy_text TEXT NOT NULL DEFAULT '',
  email_new_booking BOOLEAN NOT NULL DEFAULT true,
  email_booking_cancelled BOOLEAN NOT NULL DEFAULT true,
  email_booking_confirmed BOOLEAN NOT NULL DEFAULT true,
  email_payment_received BOOLEAN NOT NULL DEFAULT true,
  email_daily_summary BOOLEAN NOT NULL DEFAULT false,
  email_weekly_report BOOLEAN NOT NULL DEFAULT false,
  sms_new_booking BOOLEAN NOT NULL DEFAULT false,
  sms_booking_reminder BOOLEAN NOT NULL DEFAULT false,
  browser_notifications BOOLEAN NOT NULL DEFAULT true,
  sound_notifications BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_settings TO authenticated;
GRANT ALL ON public.business_settings TO service_role;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bs_owner_all" ON public.business_settings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()));
CREATE TRIGGER trg_bs_updated BEFORE UPDATE ON public.business_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============= SUBSCRIPTION_PLANS =============
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cop INTEGER NOT NULL DEFAULT 0,
  max_bookings_per_month INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscription_plans TO anon, authenticated;
GRANT ALL ON public.subscription_plans TO service_role;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans_public_read" ON public.subscription_plans FOR SELECT USING (true);

INSERT INTO public.subscription_plans (name, description, price_cop, max_bookings_per_month) VALUES
  ('Gratuito','Plan inicial gratuito',0,10),
  ('Profesional','Reservas ilimitadas',49000,NULL);

-- ============= BUSINESS_SUBSCRIPTIONS =============
CREATE TABLE public.business_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE UNIQUE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status public.subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 month'),
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_subscriptions TO authenticated;
GRANT ALL ON public.business_subscriptions TO service_role;
ALTER TABLE public.business_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subs_owner_all" ON public.business_subscriptions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()));

-- ============= MONTHLY_USAGE =============
CREATE TABLE public.monthly_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  completed_bookings INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, year, month)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.monthly_usage TO authenticated;
GRANT ALL ON public.monthly_usage TO service_role;
ALTER TABLE public.monthly_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usage_owner_all" ON public.monthly_usage FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()));

-- ============= SERVICES =============
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  confirmation_message TEXT,
  image_url TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price NUMERIC NOT NULL DEFAULT 0,
  accepts_cash BOOLEAN DEFAULT true,
  accepts_transfer BOOLEAN DEFAULT false,
  min_advance_days INTEGER DEFAULT 0,
  is_monday_active BOOLEAN DEFAULT true,
  is_tuesday_active BOOLEAN DEFAULT true,
  is_wednesday_active BOOLEAN DEFAULT true,
  is_thursday_active BOOLEAN DEFAULT true,
  is_friday_active BOOLEAN DEFAULT true,
  is_saturday_active BOOLEAN DEFAULT false,
  is_sunday_active BOOLEAN DEFAULT false,
  monday_start TEXT, monday_end TEXT,
  tuesday_start TEXT, tuesday_end TEXT,
  wednesday_start TEXT, wednesday_end TEXT,
  thursday_start TEXT, thursday_end TEXT,
  friday_start TEXT, friday_end TEXT,
  saturday_start TEXT, saturday_end TEXT,
  sunday_start TEXT, sunday_end TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_public_read" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_owner_write" ON public.services FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()));

-- ============= STAFF_MEMBERS =============
CREATE TABLE public.staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  work_start_time TEXT,
  work_end_time TEXT,
  works_monday BOOLEAN DEFAULT true,
  works_tuesday BOOLEAN DEFAULT true,
  works_wednesday BOOLEAN DEFAULT true,
  works_thursday BOOLEAN DEFAULT true,
  works_friday BOOLEAN DEFAULT true,
  works_saturday BOOLEAN DEFAULT false,
  works_sunday BOOLEAN DEFAULT false,
  monday_start_time TEXT, monday_end_time TEXT,
  tuesday_start_time TEXT, tuesday_end_time TEXT,
  wednesday_start_time TEXT, wednesday_end_time TEXT,
  thursday_start_time TEXT, thursday_end_time TEXT,
  friday_start_time TEXT, friday_end_time TEXT,
  saturday_start_time TEXT, saturday_end_time TEXT,
  sunday_start_time TEXT, sunday_end_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.staff_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_members TO authenticated;
GRANT ALL ON public.staff_members TO service_role;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff_public_read" ON public.staff_members FOR SELECT USING (true);
CREATE POLICY "staff_owner_write" ON public.staff_members FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()));

-- ============= STAFF_SERVICES =============
CREATE TABLE public.staff_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (staff_id, service_id)
);
GRANT SELECT ON public.staff_services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_services TO authenticated;
GRANT ALL ON public.staff_services TO service_role;
ALTER TABLE public.staff_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ss_public_read" ON public.staff_services FOR SELECT USING (true);
CREATE POLICY "ss_owner_write" ON public.staff_services FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.staff_members s JOIN public.businesses b ON b.id=s.business_id WHERE s.id=staff_id AND b.owner_user_id=auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.staff_members s JOIN public.businesses b ON b.id=s.business_id WHERE s.id=staff_id AND b.owner_user_id=auth.uid()));

-- ============= APPOINTMENTS =============
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  staff_id UUID NOT NULL REFERENCES public.staff_members(id) ON DELETE RESTRICT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  status public.appointment_status NOT NULL DEFAULT 'pendiente',
  payment_proof_url TEXT,
  payment_status public.payment_validation_status,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.appointments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appt_public_insert" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "appt_public_select" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "appt_owner_update" ON public.appointments FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()));
CREATE POLICY "appt_owner_delete" ON public.appointments FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.owner_user_id = auth.uid()));

-- ============= TIME_BLOCKS =============
CREATE TABLE public.time_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.time_blocks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.time_blocks TO authenticated;
GRANT ALL ON public.time_blocks TO service_role;
ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tb_public_read" ON public.time_blocks FOR SELECT USING (true);
CREATE POLICY "tb_owner_write" ON public.time_blocks FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.staff_members s JOIN public.businesses b ON b.id=s.business_id WHERE s.id=staff_id AND b.owner_user_id=auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.staff_members s JOIN public.businesses b ON b.id=s.business_id WHERE s.id=staff_id AND b.owner_user_id=auth.uid()));

-- ============= can_accept_booking RPC =============
CREATE OR REPLACE FUNCTION public.can_accept_booking(business_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  plan_max INTEGER;
  current_count INTEGER;
  y INTEGER := EXTRACT(YEAR FROM now())::INTEGER;
  m INTEGER := EXTRACT(MONTH FROM now())::INTEGER;
BEGIN
  SELECT sp.max_bookings_per_month INTO plan_max
  FROM public.business_subscriptions bs
  JOIN public.subscription_plans sp ON sp.id = bs.plan_id
  WHERE bs.business_id = business_uuid AND bs.status = 'active'
  LIMIT 1;
  IF plan_max IS NULL THEN RETURN TRUE; END IF;
  SELECT COALESCE(completed_bookings,0) INTO current_count
  FROM public.monthly_usage WHERE business_id = business_uuid AND year = y AND month = m;
  RETURN COALESCE(current_count,0) < plan_max;
END;
$$;

-- ============= STORAGE BUCKET =============
INSERT INTO storage.buckets (id, name, public) VALUES ('payment_proofs','payment_proofs',true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "payment_proofs_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'payment_proofs');
CREATE POLICY "payment_proofs_anyone_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment_proofs');
