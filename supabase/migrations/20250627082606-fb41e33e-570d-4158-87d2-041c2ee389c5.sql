
-- RF-3.1: Gestionar la Desvinculación de Comprobantes de Pago

-- 1. Crear función que se ejecutará cuando se elimine un archivo del storage
CREATE OR REPLACE FUNCTION public.handle_payment_proof_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo procesar si es del bucket payment_proofs
  IF OLD.bucket_id = 'payment_proofs' THEN
    -- Obtener la URL pública del archivo eliminado
    DECLARE
      deleted_url TEXT;
    BEGIN
      -- Construir la URL que estaría almacenada en appointments
      deleted_url := 'https://zvyokkipfoccvlvpliqi.supabase.co/storage/v1/object/public/payment_proofs/' || OLD.name;
      
      -- Actualizar todos los appointments que tengan esta URL
      UPDATE public.appointments 
      SET 
        payment_proof_url = NULL,
        payment_status = 'pendiente'
      WHERE payment_proof_url = deleted_url;
      
      -- Log para debugging (opcional)
      RAISE NOTICE 'Removed payment proof URL from appointments: %', deleted_url;
    END;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Crear el trigger en la tabla storage.objects
CREATE TRIGGER payment_proof_cleanup_trigger
  AFTER DELETE ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_payment_proof_deletion();

-- 3. Añadir índice para mejorar performance de la búsqueda por URL
CREATE INDEX IF NOT EXISTS idx_appointments_payment_proof_url 
ON public.appointments(payment_proof_url) 
WHERE payment_proof_url IS NOT NULL;

-- 4. Función auxiliar para limpiar URLs rotas manualmente (opcional)
CREATE OR REPLACE FUNCTION public.cleanup_broken_payment_proof_urls()
RETURNS INTEGER AS $$
DECLARE
  cleanup_count INTEGER := 0;
  appointment_record RECORD;
  file_exists BOOLEAN;
BEGIN
  -- Iterar sobre todas las citas con comprobantes de pago
  FOR appointment_record IN 
    SELECT id, payment_proof_url 
    FROM public.appointments 
    WHERE payment_proof_url IS NOT NULL
  LOOP
    -- Verificar si el archivo existe en storage
    SELECT EXISTS(
      SELECT 1 FROM storage.objects 
      WHERE bucket_id = 'payment_proofs' 
      AND name = SUBSTRING(appointment_record.payment_proof_url FROM '.*/([^/]+)$')
    ) INTO file_exists;
    
    -- Si el archivo no existe, limpiar la referencia
    IF NOT file_exists THEN
      UPDATE public.appointments 
      SET 
        payment_proof_url = NULL,
        payment_status = 'pendiente'
      WHERE id = appointment_record.id;
      
      cleanup_count := cleanup_count + 1;
    END IF;
  END LOOP;
  
  RETURN cleanup_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
