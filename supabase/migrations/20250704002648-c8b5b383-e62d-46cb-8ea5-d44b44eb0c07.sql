-- El problema es que las políticas públicas permiten a usuarios autenticados ver datos de todos los negocios
-- Vamos a corregir esto limitando las políticas públicas solo a usuarios anónimos

-- Eliminar políticas públicas problemáticas
DROP POLICY IF EXISTS "Public can view services for booking" ON public.services;
DROP POLICY IF EXISTS "Public can view staff for booking" ON public.staff_members;
DROP POLICY IF EXISTS "Public can view staff services for booking" ON public.staff_services;
DROP POLICY IF EXISTS "Public can view time blocks for availability" ON public.time_blocks;

-- Crear políticas públicas SOLO para usuarios anónimos (no autenticados)
CREATE POLICY "Anonymous can view services for booking" 
  ON public.services 
  FOR SELECT 
  TO anon
  USING (business_id IN (SELECT id FROM public.businesses WHERE booking_url_slug IS NOT NULL));

CREATE POLICY "Anonymous can view staff for booking" 
  ON public.staff_members 
  FOR SELECT 
  TO anon
  USING (business_id IN (SELECT id FROM public.businesses WHERE booking_url_slug IS NOT NULL));

CREATE POLICY "Anonymous can view staff services for booking" 
  ON public.staff_services 
  FOR SELECT 
  TO anon
  USING (staff_id IN (
    SELECT sm.id FROM public.staff_members sm 
    JOIN public.businesses b ON sm.business_id = b.id 
    WHERE b.booking_url_slug IS NOT NULL
  ));

CREATE POLICY "Anonymous can view time blocks for availability" 
  ON public.time_blocks 
  FOR SELECT 
  TO anon
  USING (staff_id IN (
    SELECT sm.id FROM public.staff_members sm 
    JOIN public.businesses b ON sm.business_id = b.id 
    WHERE b.booking_url_slug IS NOT NULL
  ));

-- CREAR POLÍTICAS ESPECÍFICAS PARA BOOKING PÚBLICO (usuarios autenticados que usan booking público)
-- Solo para el negocio específico que están viendo en la página de booking

CREATE POLICY "Authenticated users can view specific business services for booking" 
  ON public.services 
  FOR SELECT 
  TO authenticated
  USING (
    -- Solo para su propio negocio (gestión)
    business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())
    OR
    -- O para el negocio específico en el contexto de booking público
    (business_id IN (SELECT id FROM public.businesses WHERE booking_url_slug IS NOT NULL) 
     AND current_setting('app.current_business_id', true)::uuid = business_id)
  );

CREATE POLICY "Authenticated users can view specific business staff for booking" 
  ON public.staff_members 
  FOR SELECT 
  TO authenticated
  USING (
    -- Solo para su propio negocio (gestión)
    business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid())
    OR
    -- O para el negocio específico en el contexto de booking público
    (business_id IN (SELECT id FROM public.businesses WHERE booking_url_slug IS NOT NULL) 
     AND current_setting('app.current_business_id', true)::uuid = business_id)
  );

CREATE POLICY "Authenticated users can view specific business staff services for booking" 
  ON public.staff_services 
  FOR SELECT 
  TO authenticated
  USING (
    staff_id IN (
      SELECT sm.id FROM public.staff_members sm 
      JOIN public.businesses b ON sm.business_id = b.id 
      WHERE (
        -- Solo para su propio negocio (gestión)
        b.owner_user_id = auth.uid()
        OR
        -- O para el negocio específico en el contexto de booking público
        (b.booking_url_slug IS NOT NULL 
         AND current_setting('app.current_business_id', true)::uuid = b.id)
      )
    )
  );

CREATE POLICY "Authenticated users can view specific business time blocks for availability" 
  ON public.time_blocks 
  FOR SELECT 
  TO authenticated
  USING (
    staff_id IN (
      SELECT sm.id FROM public.staff_members sm 
      JOIN public.businesses b ON sm.business_id = b.id 
      WHERE (
        -- Solo para su propio negocio (gestión)
        b.owner_user_id = auth.uid()
        OR
        -- O para el negocio específico en el contexto de booking público
        (b.booking_url_slug IS NOT NULL 
         AND current_setting('app.current_business_id', true)::uuid = b.id)
      )
    )
  );