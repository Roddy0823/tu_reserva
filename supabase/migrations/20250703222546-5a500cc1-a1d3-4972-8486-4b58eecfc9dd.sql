-- Primero eliminar las políticas problemáticas actuales
DROP POLICY IF EXISTS "Anyone can view staff for booking" ON public.staff_members;
DROP POLICY IF EXISTS "Cualquier persona puede ver el personal (para la página de res" ON public.staff_members;
DROP POLICY IF EXISTS "Anyone can view staff services for booking" ON public.staff_services;
DROP POLICY IF EXISTS "Cualquier persona puede ver las asociaciones (para la página d" ON public.staff_services;

-- Corregir políticas para staff_members
DROP POLICY IF EXISTS "Business owners can view their staff" ON public.staff_members;
DROP POLICY IF EXISTS "Business owners can insert their staff" ON public.staff_members;
DROP POLICY IF EXISTS "Business owners can update their staff" ON public.staff_members;
DROP POLICY IF EXISTS "Business owners can delete their staff" ON public.staff_members;
DROP POLICY IF EXISTS "Los dueños pueden gestionar el personal de su negocio" ON public.staff_members;
DROP POLICY IF EXISTS "Allow public access to staff for booking" ON public.staff_members;

-- Políticas correctas para staff_members
CREATE POLICY "Business owners can manage their staff" 
  ON public.staff_members 
  FOR ALL 
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Public can view staff for booking" 
  ON public.staff_members 
  FOR SELECT 
  TO anon, authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE booking_url_slug IS NOT NULL));

-- Corregir políticas para staff_services
DROP POLICY IF EXISTS "Business owners can view staff services of their business" ON public.staff_services;
DROP POLICY IF EXISTS "Business owners can insert staff services for their business" ON public.staff_services;
DROP POLICY IF EXISTS "Business owners can update staff services of their business" ON public.staff_services;
DROP POLICY IF EXISTS "Business owners can delete staff services of their business" ON public.staff_services;
DROP POLICY IF EXISTS "Los dueños pueden gestionar las asociaciones de su negocio" ON public.staff_services;
DROP POLICY IF EXISTS "Allow public access to staff_services for booking" ON public.staff_services;

-- Políticas correctas para staff_services
CREATE POLICY "Business owners can manage staff services" 
  ON public.staff_services 
  FOR ALL 
  TO authenticated
  USING (staff_id IN (
    SELECT sm.id FROM public.staff_members sm 
    JOIN public.businesses b ON sm.business_id = b.id 
    WHERE b.owner_user_id = auth.uid()
  ));

CREATE POLICY "Public can view staff services for booking" 
  ON public.staff_services 
  FOR SELECT 
  TO anon, authenticated
  USING (staff_id IN (
    SELECT sm.id FROM public.staff_members sm 
    JOIN public.businesses b ON sm.business_id = b.id 
    WHERE b.booking_url_slug IS NOT NULL
  ));

-- Corregir políticas para services
DROP POLICY IF EXISTS "Business owners can view their own services" ON public.services;
DROP POLICY IF EXISTS "Business owners can create their own services" ON public.services;
DROP POLICY IF EXISTS "Business owners can update their own services" ON public.services;
DROP POLICY IF EXISTS "Business owners can delete their own services" ON public.services;
DROP POLICY IF EXISTS "Public can view services for booking" ON public.services;

-- Políticas correctas para services
CREATE POLICY "Business owners can manage their services" 
  ON public.services 
  FOR ALL 
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

CREATE POLICY "Public can view services for booking" 
  ON public.services 
  FOR SELECT 
  TO anon, authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE booking_url_slug IS NOT NULL));

-- Corregir políticas para time_blocks
DROP POLICY IF EXISTS "Business owners can view time blocks of their staff" ON public.time_blocks;
DROP POLICY IF EXISTS "Business owners can insert time blocks for their staff" ON public.time_blocks;
DROP POLICY IF EXISTS "Business owners can update time blocks of their staff" ON public.time_blocks;
DROP POLICY IF EXISTS "Business owners can delete time blocks of their staff" ON public.time_blocks;
DROP POLICY IF EXISTS "Anyone can view time blocks for availability" ON public.time_blocks;
DROP POLICY IF EXISTS "Cualquier persona puede ver los bloqueos (para calcular disponi" ON public.time_blocks;
DROP POLICY IF EXISTS "Los dueños pueden gestionar los bloqueos de su personal" ON public.time_blocks;

-- Políticas correctas para time_blocks
CREATE POLICY "Business owners can manage time blocks" 
  ON public.time_blocks 
  FOR ALL 
  TO authenticated
  USING (staff_id IN (
    SELECT sm.id FROM public.staff_members sm 
    JOIN public.businesses b ON sm.business_id = b.id 
    WHERE b.owner_user_id = auth.uid()
  ));

CREATE POLICY "Public can view time blocks for availability" 
  ON public.time_blocks 
  FOR SELECT 
  TO anon, authenticated
  USING (staff_id IN (
    SELECT sm.id FROM public.staff_members sm 
    JOIN public.businesses b ON sm.business_id = b.id 
    WHERE b.booking_url_slug IS NOT NULL
  ));