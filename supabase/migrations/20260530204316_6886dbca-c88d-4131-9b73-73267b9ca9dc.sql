
CREATE OR REPLACE FUNCTION public.create_appointment_safely(
  p_client_name TEXT,
  p_client_email TEXT,
  p_client_phone TEXT,
  p_service_id UUID,
  p_staff_id UUID,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ,
  p_business_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conflict INTEGER;
  v_appt public.appointments;
BEGIN
  SELECT COUNT(*) INTO v_conflict
  FROM public.appointments
  WHERE staff_id = p_staff_id
    AND status <> 'cancelado'
    AND tstzrange(start_time, end_time, '[)') && tstzrange(p_start_time, p_end_time, '[)');
  IF v_conflict > 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'El horario seleccionado ya no está disponible');
  END IF;

  SELECT COUNT(*) INTO v_conflict
  FROM public.time_blocks
  WHERE staff_id = p_staff_id
    AND tstzrange(start_time, end_time, '[)') && tstzrange(p_start_time, p_end_time, '[)');
  IF v_conflict > 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'El horario está bloqueado');
  END IF;

  INSERT INTO public.appointments
    (business_id, service_id, staff_id, start_time, end_time, client_name, client_email, client_phone, status)
  VALUES
    (p_business_id, p_service_id, p_staff_id, p_start_time, p_end_time, p_client_name, p_client_email, NULLIF(p_client_phone,''), 'pendiente')
  RETURNING * INTO v_appt;

  RETURN jsonb_build_object('success', true, 'appointment', to_jsonb(v_appt));
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_broken_payment_proof_urls()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  WITH cleared AS (
    UPDATE public.appointments
    SET payment_proof_url = NULL
    WHERE payment_proof_url IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM storage.objects o
        WHERE o.bucket_id = 'payment_proofs'
          AND position(o.name in payment_proof_url) > 0
      )
    RETURNING 1
  )
  SELECT COUNT(*) INTO v_count FROM cleared;
  RETURN v_count;
END;
$$;
