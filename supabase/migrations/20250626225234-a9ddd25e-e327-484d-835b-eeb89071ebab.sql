
-- Crear bucket para almacenar imágenes de servicios
INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-images', 'service-images', true);

-- Crear política para permitir subir imágenes
CREATE POLICY "Anyone can upload service images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'service-images');

-- Crear política para ver imágenes públicamente
CREATE POLICY "Anyone can view service images" ON storage.objects
FOR SELECT USING (bucket_id = 'service-images');

-- Crear política para actualizar imágenes
CREATE POLICY "Anyone can update service images" ON storage.objects
FOR UPDATE USING (bucket_id = 'service-images');

-- Crear política para eliminar imágenes
CREATE POLICY "Anyone can delete service images" ON storage.objects
FOR DELETE USING (bucket_id = 'service-images');

-- Agregar nuevas columnas a la tabla services
ALTER TABLE public.services 
ADD COLUMN image_url TEXT,
ADD COLUMN confirmation_message TEXT,
ADD COLUMN payment_method TEXT DEFAULT 'presencial' CHECK (payment_method IN ('presencial', 'transferencia')),
ADD COLUMN min_advance_days INTEGER DEFAULT 1,
ADD COLUMN monday_start TIME,
ADD COLUMN monday_end TIME,
ADD COLUMN tuesday_start TIME,
ADD COLUMN tuesday_end TIME,
ADD COLUMN wednesday_start TIME,
ADD COLUMN wednesday_end TIME,
ADD COLUMN thursday_start TIME,
ADD COLUMN thursday_end TIME,
ADD COLUMN friday_start TIME,
ADD COLUMN friday_end TIME,
ADD COLUMN saturday_start TIME,
ADD COLUMN saturday_end TIME,
ADD COLUMN sunday_start TIME,
ADD COLUMN sunday_end TIME,
ADD COLUMN is_monday_active BOOLEAN DEFAULT false,
ADD COLUMN is_tuesday_active BOOLEAN DEFAULT false,
ADD COLUMN is_wednesday_active BOOLEAN DEFAULT false,
ADD COLUMN is_thursday_active BOOLEAN DEFAULT false,
ADD COLUMN is_friday_active BOOLEAN DEFAULT false,
ADD COLUMN is_saturday_active BOOLEAN DEFAULT false,
ADD COLUMN is_sunday_active BOOLEAN DEFAULT false;
