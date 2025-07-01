
-- Corregir la función create_appointment_safely removiendo FOR UPDATE de las consultas COUNT
CREATE OR REPLACE FUNCTION public.create_appointment_safely(
  p_client_name TEXT,
  p_client_email TEXT, 
  p_client_phone TEXT,
  p_service_id UUID,
  p_staff_id UUID,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ,
  p_business_id UUID
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_staff_service_exists BOOLEAN := FALSE;
  v_conflicting_appointments INTEGER := 0;
  v_conflicting_blocks INTEGER := 0;
  v_staff_works_today BOOLEAN := FALSE;
  v_day_of_week INTEGER;
  v_work_start_time TIME;
  v_work_end_time TIME;
  v_appointment_start_time TIME;
  v_appointment_end_time TIME;
  v_staff_member RECORD;
  v_service RECORD;
  v_new_appointment_id UUID;
  v_result JSON;
BEGIN
  -- 1. Verificar que el staff puede realizar este servicio
  SELECT EXISTS(
    SELECT 1 FROM staff_services ss
    WHERE ss.staff_id = p_staff_id AND ss.service_id = p_service_id
  ) INTO v_staff_service_exists;
  
  IF NOT v_staff_service_exists THEN
    RETURN json_build_object(
      'success', false,
      'error', 'El personal seleccionado no está habilitado para realizar este servicio'
    );
  END IF;

  -- 2. Obtener información del staff member
  SELECT * INTO v_staff_member
  FROM staff_members 
  WHERE id = p_staff_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'El personal seleccionado no está activo'
    );
  END IF;

  -- 3. Verificar que el staff trabaja en el día seleccionado
  v_day_of_week := EXTRACT(DOW FROM p_start_time); -- 0=domingo, 1=lunes, ..., 6=sábado
  
  CASE v_day_of_week
    WHEN 0 THEN -- domingo
      v_staff_works_today := COALESCE(v_staff_member.works_sunday, false);
      v_work_start_time := COALESCE(v_staff_member.sunday_start_time, v_staff_member.work_start_time);
      v_work_end_time := COALESCE(v_staff_member.sunday_end_time, v_staff_member.work_end_time);
    WHEN 1 THEN -- lunes
      v_staff_works_today := COALESCE(v_staff_member.works_monday, false);
      v_work_start_time := COALESCE(v_staff_member.monday_start_time, v_staff_member.work_start_time);
      v_work_end_time := COALESCE(v_staff_member.monday_end_time, v_staff_member.work_end_time);
    WHEN 2 THEN -- martes
      v_staff_works_today := COALESCE(v_staff_member.works_tuesday, false);
      v_work_start_time := COALESCE(v_staff_member.tuesday_start_time, v_staff_member.work_start_time);
      v_work_end_time := COALESCE(v_staff_member.tuesday_end_time, v_staff_member.work_end_time);
    WHEN 3 THEN -- miércoles
      v_staff_works_today := COALESCE(v_staff_member.works_wednesday, false);
      v_work_start_time := COALESCE(v_staff_member.wednesday_start_time, v_staff_member.work_start_time);
      v_work_end_time := COALESCE(v_staff_member.wednesday_end_time, v_staff_member.work_end_time);
    WHEN 4 THEN -- jueves
      v_staff_works_today := COALESCE(v_staff_member.works_thursday, false);
      v_work_start_time := COALESCE(v_staff_member.thursday_start_time, v_staff_member.work_start_time);
      v_work_end_time := COALESCE(v_staff_member.thursday_end_time, v_staff_member.work_end_time);
    WHEN 5 THEN -- viernes
      v_staff_works_today := COALESCE(v_staff_member.works_friday, false);
      v_work_start_time := COALESCE(v_staff_member.friday_start_time, v_staff_member.work_start_time);
      v_work_end_time := COALESCE(v_staff_member.friday_end_time, v_staff_member.work_end_time);
    WHEN 6 THEN -- sábado
      v_staff_works_today := COALESCE(v_staff_member.works_saturday, false);
      v_work_start_time := COALESCE(v_staff_member.saturday_start_time, v_staff_member.work_start_time);
      v_work_end_time := COALESCE(v_staff_member.saturday_end_time, v_staff_member.work_end_time);
  END CASE;

  IF NOT v_staff_works_today THEN
    RETURN json_build_object(
      'success', false,
      'error', 'El personal seleccionado no trabaja en el día solicitado'
    );
  END IF;

  -- 4. Verificar que la cita está dentro del horario laboral
  v_appointment_start_time := p_start_time::TIME;
  v_appointment_end_time := p_end_time::TIME;
  
  IF v_appointment_start_time < v_work_start_time OR v_appointment_end_time > v_work_end_time THEN
    RETURN json_build_object(
      'success', false,
      'error', 'El horario solicitado está fuera del horario laboral del personal'
    );
  END IF;

  -- 5. Verificar duración del servicio
  SELECT * INTO v_service FROM services WHERE id = p_service_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Servicio no encontrado'
    );
  END IF;

  IF EXTRACT(EPOCH FROM (p_end_time - p_start_time))/60 != v_service.duration_minutes THEN
    RETURN json_build_object(
      'success', false,
      'error', 'La duración de la cita no coincide con la duración del servicio'
    );
  END IF;

  -- 6. Verificar conflictos con otras citas ACTIVAS (sin FOR UPDATE en COUNT)
  SELECT COUNT(*) INTO v_conflicting_appointments
  FROM appointments
  WHERE staff_id = p_staff_id 
    AND status IN ('pendiente', 'confirmado')
    AND (
      -- Nueva cita empieza durante una existente
      (p_start_time >= start_time AND p_start_time < end_time) OR
      -- Nueva cita termina durante una existente  
      (p_end_time > start_time AND p_end_time <= end_time) OR
      -- Nueva cita engloba una existente
      (p_start_time <= start_time AND p_end_time >= end_time) OR
      -- Coincidencias exactas
      (p_start_time = start_time OR p_end_time = end_time)
    );

  IF v_conflicting_appointments > 0 THEN
    -- Bloquear las filas específicas para evitar race conditions
    PERFORM 1 FROM appointments
    WHERE staff_id = p_staff_id 
      AND status IN ('pendiente', 'confirmado')
      AND (
        (p_start_time >= start_time AND p_start_time < end_time) OR
        (p_end_time > start_time AND p_end_time <= end_time) OR
        (p_start_time <= start_time AND p_end_time >= end_time) OR
        (p_start_time = start_time OR p_end_time = end_time)
      )
    FOR UPDATE;
    
    RETURN json_build_object(
      'success', false,
      'error', 'Este horario ya está ocupado. Por favor selecciona otro horario.'
    );
  END IF;

  -- 7. Verificar conflictos con bloqueos de tiempo
  SELECT COUNT(*) INTO v_conflicting_blocks
  FROM time_blocks
  WHERE staff_id = p_staff_id
    AND (
      -- Nueva cita empieza durante un bloqueo
      (p_start_time >= start_time AND p_start_time < end_time) OR
      -- Nueva cita termina durante un bloqueo
      (p_end_time > start_time AND p_end_time <= end_time) OR
      -- Nueva cita engloba un bloqueo
      (p_start_time <= start_time AND p_end_time >= end_time) OR
      -- Coincidencias exactas
      (p_start_time = start_time OR p_end_time = end_time)
    );

  IF v_conflicting_blocks > 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Este horario no está disponible debido a un bloqueo programado.'
    );
  END IF;

  -- 8. Si todas las validaciones pasan, crear la cita
  INSERT INTO appointments (
    business_id,
    service_id,
    staff_id,
    start_time,
    end_time,
    client_name,
    client_email,
    client_phone,
    status
  ) VALUES (
    p_business_id,
    p_service_id,
    p_staff_id,
    p_start_time,
    p_end_time,
    p_client_name,
    p_client_email,
    p_client_phone,
    'pendiente'
  ) RETURNING id INTO v_new_appointment_id;

  -- 9. Devolver el resultado exitoso con los datos de la cita creada
  SELECT json_build_object(
    'success', true,
    'appointment', json_build_object(
      'id', a.id,
      'business_id', a.business_id,
      'service_id', a.service_id,
      'staff_id', a.staff_id,
      'start_time', a.start_time,
      'end_time', a.end_time,
      'client_name', a.client_name,
      'client_email', a.client_email,
      'client_phone', a.client_phone,
      'status', a.status,
      'created_at', a.created_at,
      'staff_members', json_build_object(
        'full_name', sm.full_name
      ),
      'services', json_build_object(
        'name', s.name,
        'duration_minutes', s.duration_minutes,
        'price', s.price
      )
    )
  ) INTO v_result
  FROM appointments a
  JOIN staff_members sm ON a.staff_id = sm.id
  JOIN services s ON a.service_id = s.id
  WHERE a.id = v_new_appointment_id;

  RETURN v_result;

EXCEPTION
  WHEN OTHERS THEN
    -- En caso de cualquier error no manejado, devolver error
    RETURN json_build_object(
      'success', false,
      'error', 'Error interno al crear la cita: ' || SQLERRM
    );
END;
$$;
