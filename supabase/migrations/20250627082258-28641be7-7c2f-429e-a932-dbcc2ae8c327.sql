
-- RF-2.1: Implementar CHECK constraints para integridad de datos

-- 1. Constraints para la tabla appointments
ALTER TABLE public.appointments 
ADD CONSTRAINT appointments_end_time_after_start_time 
CHECK (end_time > start_time);

-- 2. Constraints para la tabla services  
ALTER TABLE public.services 
ADD CONSTRAINT services_duration_positive 
CHECK (duration_minutes > 0);

ALTER TABLE public.services 
ADD CONSTRAINT services_price_non_negative 
CHECK (price >= 0);

-- 3. Constraints para la tabla time_blocks
ALTER TABLE public.time_blocks 
ADD CONSTRAINT time_blocks_end_time_after_start_time 
CHECK (end_time > start_time);

-- 4. Constraints adicionales para staff_members (horarios de trabajo)
ALTER TABLE public.staff_members 
ADD CONSTRAINT staff_work_hours_valid 
CHECK (work_end_time > work_start_time OR (work_start_time IS NULL AND work_end_time IS NULL));

-- Constraints para horarios específicos de cada día
ALTER TABLE public.staff_members 
ADD CONSTRAINT staff_monday_hours_valid 
CHECK (monday_end_time > monday_start_time OR (monday_start_time IS NULL AND monday_end_time IS NULL));

ALTER TABLE public.staff_members 
ADD CONSTRAINT staff_tuesday_hours_valid 
CHECK (tuesday_end_time > tuesday_start_time OR (tuesday_start_time IS NULL AND tuesday_end_time IS NULL));

ALTER TABLE public.staff_members 
ADD CONSTRAINT staff_wednesday_hours_valid 
CHECK (wednesday_end_time > wednesday_start_time OR (wednesday_start_time IS NULL AND wednesday_end_time IS NULL));

ALTER TABLE public.staff_members 
ADD CONSTRAINT staff_thursday_hours_valid 
CHECK (thursday_end_time > thursday_start_time OR (thursday_start_time IS NULL AND thursday_end_time IS NULL));

ALTER TABLE public.staff_members 
ADD CONSTRAINT staff_friday_hours_valid 
CHECK (friday_end_time > friday_start_time OR (friday_start_time IS NULL AND friday_end_time IS NULL));

ALTER TABLE public.staff_members 
ADD CONSTRAINT staff_saturday_hours_valid 
CHECK (saturday_end_time > saturday_start_time OR (saturday_start_time IS NULL AND saturday_end_time IS NULL));

ALTER TABLE public.staff_members 
ADD CONSTRAINT staff_sunday_hours_valid 
CHECK (sunday_end_time > sunday_start_time OR (sunday_start_time IS NULL AND sunday_end_time IS NULL));

-- 5. Constraints para business_settings
ALTER TABLE public.business_settings 
ADD CONSTRAINT business_settings_min_advance_hours_positive 
CHECK (min_advance_hours >= 0);

ALTER TABLE public.business_settings 
ADD CONSTRAINT business_settings_max_advance_days_positive 
CHECK (max_advance_days > 0);

ALTER TABLE public.business_settings 
ADD CONSTRAINT business_settings_cancellation_hours_positive 
CHECK (cancellation_hours >= 0);

-- RF-2.2: Fortalecer políticas RLS - Primero eliminar políticas existentes problemáticas
DROP POLICY IF EXISTS "Users can view their own business" ON public.businesses;
DROP POLICY IF EXISTS "Users can update their own business" ON public.businesses;
DROP POLICY IF EXISTS "Users can insert their own business" ON public.businesses;

DROP POLICY IF EXISTS "Users can view services of their business" ON public.services;
DROP POLICY IF EXISTS "Users can manage services of their business" ON public.services;

DROP POLICY IF EXISTS "Users can view staff of their business" ON public.staff_members;
DROP POLICY IF EXISTS "Users can manage staff of their business" ON public.staff_members;

DROP POLICY IF EXISTS "Users can view appointments of their business" ON public.appointments;
DROP POLICY IF EXISTS "Users can manage appointments of their business" ON public.appointments;

DROP POLICY IF EXISTS "Users can view time_blocks of their staff" ON public.time_blocks;
DROP POLICY IF EXISTS "Users can manage time_blocks of their staff" ON public.time_blocks;

DROP POLICY IF EXISTS "Users can view staff_services of their business" ON public.staff_services;
DROP POLICY IF EXISTS "Users can manage staff_services of their business" ON public.staff_services;

-- Crear políticas RLS más específicas y seguras

-- Políticas para businesses (solo el propietario puede gestionar su negocio)
CREATE POLICY "Business owners can view their own business" 
  ON public.businesses 
  FOR SELECT 
  USING (owner_user_id = auth.uid());

CREATE POLICY "Business owners can update their own business" 
  ON public.businesses 
  FOR UPDATE 
  USING (owner_user_id = auth.uid());

CREATE POLICY "Business owners can insert their own business" 
  ON public.businesses 
  FOR INSERT 
  WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "Business owners can delete their own business" 
  ON public.businesses 
  FOR DELETE 
  USING (owner_user_id = auth.uid());

-- Políticas para services (solo el propietario del negocio puede gestionar servicios)
CREATE POLICY "Business owners can view their services" 
  ON public.services 
  FOR SELECT 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Business owners can insert their services" 
  ON public.services 
  FOR INSERT 
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Business owners can update their services" 
  ON public.services 
  FOR UPDATE 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Business owners can delete their services" 
  ON public.services 
  FOR DELETE 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Políticas públicas para servicios (para la página de reservas)
CREATE POLICY "Anyone can view services for booking" 
  ON public.services 
  FOR SELECT 
  USING (true);

-- Políticas para staff_members (solo el propietario del negocio puede gestionar personal)
CREATE POLICY "Business owners can view their staff" 
  ON public.staff_members 
  FOR SELECT 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Business owners can insert their staff" 
  ON public.staff_members 
  FOR INSERT 
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Business owners can update their staff" 
  ON public.staff_members 
  FOR UPDATE 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Business owners can delete their staff" 
  ON public.staff_members 
  FOR DELETE 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Políticas públicas para staff (para la página de reservas)
CREATE POLICY "Anyone can view staff for booking" 
  ON public.staff_members 
  FOR SELECT 
  USING (true);

-- Políticas para appointments (propietarios pueden gestionar, clientes pueden crear)
CREATE POLICY "Business owners can view their appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Business owners can update their appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Business owners can delete their appointments" 
  ON public.appointments 
  FOR DELETE 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Política para que clientes puedan crear citas (sin autenticación requerida)
CREATE POLICY "Anyone can create appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (true);

-- Políticas para time_blocks (solo propietarios del negocio)
CREATE POLICY "Business owners can view time blocks of their staff" 
  ON public.time_blocks 
  FOR SELECT 
  USING (staff_id IN (
    SELECT id FROM public.staff_members 
    WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())
  ));

CREATE POLICY "Business owners can insert time blocks for their staff" 
  ON public.time_blocks 
  FOR INSERT 
  WITH CHECK (staff_id IN (
    SELECT id FROM public.staff_members 
    WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())
  ));

CREATE POLICY "Business owners can update time blocks of their staff" 
  ON public.time_blocks 
  FOR UPDATE 
  USING (staff_id IN (
    SELECT id FROM public.staff_members 
    WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())
  ));

CREATE POLICY "Business owners can delete time blocks of their staff" 
  ON public.time_blocks 
  FOR DELETE 
  USING (staff_id IN (
    SELECT id FROM public.staff_members 
    WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())
  ));

-- Política pública para time_blocks (para calcular disponibilidad)
CREATE POLICY "Anyone can view time blocks for availability" 
  ON public.time_blocks 
  FOR SELECT 
  USING (true);

-- Políticas para staff_services (solo propietarios del negocio)
CREATE POLICY "Business owners can view staff services of their business" 
  ON public.staff_services 
  FOR SELECT 
  USING (staff_id IN (
    SELECT id FROM public.staff_members 
    WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())
  ));

CREATE POLICY "Business owners can insert staff services for their business" 
  ON public.staff_services 
  FOR INSERT 
  WITH CHECK (staff_id IN (
    SELECT id FROM public.staff_members 
    WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())
  ));

CREATE POLICY "Business owners can update staff services of their business" 
  ON public.staff_services 
  FOR UPDATE 
  USING (staff_id IN (
    SELECT id FROM public.staff_members 
    WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())
  ));

CREATE POLICY "Business owners can delete staff services of their business" 
  ON public.staff_services 
  FOR DELETE 
  USING (staff_id IN (
    SELECT id FROM public.staff_members 
    WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())
  ));

-- Política pública para staff_services (para la página de reservas)
CREATE POLICY "Anyone can view staff services for booking" 
  ON public.staff_services 
  FOR SELECT 
  USING (true);

-- Políticas para business_settings (solo propietarios del negocio)
CREATE POLICY "Business owners can view their business settings" 
  ON public.business_settings 
  FOR SELECT 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Business owners can insert their business settings" 
  ON public.business_settings 
  FOR INSERT 
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Business owners can update their business settings" 
  ON public.business_settings 
  FOR UPDATE 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Business owners can delete their business settings" 
  ON public.business_settings 
  FOR DELETE 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));
