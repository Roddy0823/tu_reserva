
-- Habilitar RLS en todas las tablas principales
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_services ENABLE ROW LEVEL SECURITY;

-- Políticas para businesses
CREATE POLICY "Users can view their own business" 
  ON public.businesses 
  FOR SELECT 
  USING (owner_user_id = auth.uid());

CREATE POLICY "Users can update their own business" 
  ON public.businesses 
  FOR UPDATE 
  USING (owner_user_id = auth.uid());

CREATE POLICY "Users can insert their own business" 
  ON public.businesses 
  FOR INSERT 
  WITH CHECK (owner_user_id = auth.uid());

-- Políticas para services
CREATE POLICY "Users can view services of their business" 
  ON public.services 
  FOR SELECT 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Users can manage services of their business" 
  ON public.services 
  FOR ALL 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Políticas para staff_members
CREATE POLICY "Users can view staff of their business" 
  ON public.staff_members 
  FOR SELECT 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Users can manage staff of their business" 
  ON public.staff_members 
  FOR ALL 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Políticas para appointments
CREATE POLICY "Users can view appointments of their business" 
  ON public.appointments 
  FOR SELECT 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Users can manage appointments of their business" 
  ON public.appointments 
  FOR ALL 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Políticas para time_blocks
CREATE POLICY "Users can view time_blocks of their staff" 
  ON public.time_blocks 
  FOR SELECT 
  USING (staff_id IN (SELECT id FROM public.staff_members WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())));

CREATE POLICY "Users can manage time_blocks of their staff" 
  ON public.time_blocks 
  FOR ALL 
  USING (staff_id IN (SELECT id FROM public.staff_members WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())));

-- Políticas para staff_services
CREATE POLICY "Users can view staff_services of their business" 
  ON public.staff_services 
  FOR SELECT 
  USING (staff_id IN (SELECT id FROM public.staff_members WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())));

CREATE POLICY "Users can manage staff_services of their business" 
  ON public.staff_services 
  FOR ALL 
  USING (staff_id IN (SELECT id FROM public.staff_members WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())));
