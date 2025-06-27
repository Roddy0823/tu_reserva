
-- Agregar campo para foto de perfil del personal
ALTER TABLE public.staff_members ADD COLUMN photo_url text;

-- Crear bucket para las fotos del personal si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('staff-photos', 'staff-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para que los dueños puedan subir fotos de su personal
CREATE POLICY "Los dueños pueden subir fotos de su personal"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'staff-photos' AND
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE owner_user_id = auth.uid()
  )
);

-- Política para que todos puedan ver las fotos del personal (para reservas)
CREATE POLICY "Cualquiera puede ver fotos del personal"
ON storage.objects FOR SELECT
USING (bucket_id = 'staff-photos');

-- Política para que los dueños puedan eliminar fotos de su personal
CREATE POLICY "Los dueños pueden eliminar fotos de su personal"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'staff-photos' AND
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE owner_user_id = auth.uid()
  )
);
