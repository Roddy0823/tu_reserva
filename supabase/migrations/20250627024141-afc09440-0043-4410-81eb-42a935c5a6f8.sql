
-- Crear el bucket para fotos del personal
INSERT INTO storage.buckets (id, name, public)
VALUES ('staff-photos', 'staff-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Agregar la columna photo_url a la tabla staff_members si no existe
ALTER TABLE public.staff_members 
ADD COLUMN IF NOT EXISTS photo_url text;

-- Crear políticas de storage para el bucket staff-photos
CREATE POLICY "Cualquiera puede ver fotos del personal"
ON storage.objects FOR SELECT
USING (bucket_id = 'staff-photos');

CREATE POLICY "Los dueños pueden subir fotos de su personal"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'staff-photos' AND
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE owner_user_id = auth.uid()
  )
);

CREATE POLICY "Los dueños pueden actualizar fotos de su personal"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'staff-photos' AND
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE owner_user_id = auth.uid()
  )
);

CREATE POLICY "Los dueños pueden eliminar fotos de su personal"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'staff-photos' AND
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE owner_user_id = auth.uid()
  )
);
