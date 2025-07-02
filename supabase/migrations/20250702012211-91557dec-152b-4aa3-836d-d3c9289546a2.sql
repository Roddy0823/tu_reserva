
-- Corregir las políticas RLS para la tabla services
-- El problema es que las políticas actuales no están permitiendo correctamente la inserción

-- Primero, eliminar todas las políticas existentes conflictivas
DROP POLICY IF EXISTS "Anyone can view services for booking" ON public.services;
DROP POLICY IF EXISTS "Business owners can insert their services" ON public.services;
DROP POLICY IF EXISTS "Business owners can update their services" ON public.services;
DROP POLICY IF EXISTS "Business owners can delete their services" ON public.services;
DROP POLICY IF EXISTS "Business owners can view their services" ON public.services;
DROP POLICY IF EXISTS "Allow public access to services for booking" ON public.services;
DROP POLICY IF EXISTS "Cualquier persona puede ver los servicios (para la página de r" ON public.services;
DROP POLICY IF EXISTS "Los dueños pueden gestionar los servicios de su negocio" ON public.services;

-- Crear políticas nuevas y más específicas

-- Permitir a los dueños ver sus propios servicios
CREATE POLICY "Business owners can view their own services" 
  ON public.services 
  FOR SELECT 
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Permitir a los dueños crear servicios para su negocio
CREATE POLICY "Business owners can create their own services" 
  ON public.services 
  FOR INSERT 
  TO authenticated
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Permitir a los dueños actualizar sus propios servicios
CREATE POLICY "Business owners can update their own services" 
  ON public.services 
  FOR UPDATE 
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Permitir a los dueños eliminar sus propios servicios
CREATE POLICY "Business owners can delete their own services" 
  ON public.services 
  FOR DELETE 
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Permitir acceso público de solo lectura para las páginas de reservas
CREATE POLICY "Public can view services for booking" 
  ON public.services 
  FOR SELECT 
  TO public
  USING (business_id IN (SELECT id FROM public.businesses WHERE booking_url_slug IS NOT NULL));
