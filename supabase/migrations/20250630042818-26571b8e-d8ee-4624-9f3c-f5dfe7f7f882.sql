
-- Política para permitir acceso público a businesses por slug de reservas
CREATE POLICY "Allow public access to business by booking slug" 
  ON public.businesses 
  FOR SELECT 
  TO public
  USING (booking_url_slug IS NOT NULL);

-- Política para permitir acceso público a servicios de negocios con slug público
CREATE POLICY "Allow public access to services for booking" 
  ON public.services 
  FOR SELECT 
  TO public
  USING (business_id IN (SELECT id FROM public.businesses WHERE booking_url_slug IS NOT NULL));

-- Política para permitir acceso público a staff de negocios con slug público
CREATE POLICY "Allow public access to staff for booking" 
  ON public.staff_members 
  FOR SELECT 
  TO public
  USING (business_id IN (SELECT id FROM public.businesses WHERE booking_url_slug IS NOT NULL));

-- Política para permitir acceso público a staff_services para booking
CREATE POLICY "Allow public access to staff_services for booking" 
  ON public.staff_services 
  FOR SELECT 
  TO public
  USING (staff_id IN (SELECT id FROM public.staff_members WHERE business_id IN (SELECT id FROM public.businesses WHERE booking_url_slug IS NOT NULL)));

-- Política para permitir la creación de citas por usuarios no autenticados
CREATE POLICY "Allow public appointment creation" 
  ON public.appointments 
  FOR INSERT 
  TO public
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE booking_url_slug IS NOT NULL));
