
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppointmentInsert } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "./useBusiness";
import { parseISO, isSameMinute, getDay } from "date-fns";

export const useCreateAppointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: AppointmentInsert) => {
      console.log('=== CREATING APPOINTMENT ===');
      console.log('Appointment data:', appointmentData);

      const startTime = parseISO(appointmentData.start_time);
      const endTime = parseISO(appointmentData.end_time);

      // 1. Verificar que el personal puede realizar este servicio
      const { data: staffService, error: serviceError } = await supabase
        .from('staff_services')
        .select('*')
        .eq('staff_id', appointmentData.staff_id)
        .eq('service_id', appointmentData.service_id)
        .single();

      if (serviceError || !staffService) {
        console.error('❌ Staff service validation failed:', serviceError);
        throw new Error('El personal seleccionado no está habilitado para realizar este servicio. Por favor selecciona otro especialista.');
      }

      // 2. Verificar que el personal está activo
      const { data: staffMember, error: staffError } = await supabase
        .from('staff_members')
        .select(`
          is_active, 
          full_name,
          works_monday, works_tuesday, works_wednesday, works_thursday, 
          works_friday, works_saturday, works_sunday,
          work_start_time, work_end_time,
          monday_start_time, monday_end_time,
          tuesday_start_time, tuesday_end_time,
          wednesday_start_time, wednesday_end_time,
          thursday_start_time, thursday_end_time,
          friday_start_time, friday_end_time,
          saturday_start_time, saturday_end_time,
          sunday_start_time, sunday_end_time
        `)
        .eq('id', appointmentData.staff_id)
        .single();

      if (staffError || !staffMember?.is_active) {
        console.error('❌ Staff member validation failed:', staffError);
        throw new Error('El personal seleccionado no está activo actualmente');
      }

      // 3. Verificar que el personal trabaja en el día seleccionado
      const dayOfWeek = getDay(startTime);
      const workDayFields = [
        'works_sunday', 'works_monday', 'works_tuesday', 'works_wednesday', 
        'works_thursday', 'works_friday', 'works_saturday'
      ];
      
      if (!staffMember[workDayFields[dayOfWeek]]) {
        throw new Error('El personal seleccionado no trabaja en el día solicitado');
      }

      // 4. Validar duración del servicio
      const { data: service, error: serviceDurationError } = await supabase
        .from('services')
        .select('duration_minutes, name')
        .eq('id', appointmentData.service_id)
        .single();

      if (serviceDurationError) {
        console.error('❌ Service validation failed:', serviceDurationError);
        throw new Error('Error al verificar los detalles del servicio');
      }

      const calculatedDurationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      if (calculatedDurationMinutes !== service.duration_minutes) {
        console.error('❌ Duration mismatch:', { calculated: calculatedDurationMinutes, expected: service.duration_minutes });
        throw new Error(`La duración de la cita (${calculatedDurationMinutes} min) no coincide con la duración del servicio ${service.name} (${service.duration_minutes} min)`);
      }

      // 5. Verificar que no hay conflictos con otras citas ACTIVAS
      const { data: conflictingAppointments, error: conflictError } = await supabase
        .from('appointments')
        .select('id, start_time, end_time, status, client_name')
        .eq('staff_id', appointmentData.staff_id)
        .in('status', ['pendiente', 'confirmado'])
        .gte('start_time', startTime.toISOString().split('T')[0] + 'T00:00:00.000Z')
        .lte('start_time', startTime.toISOString().split('T')[0] + 'T23:59:59.999Z');

      if (conflictError) {
        console.error('❌ Conflict check failed:', conflictError);
        throw new Error('Error al verificar conflictos de horarios');
      }

      // Verificar superposiciones de tiempo más precisas
      const hasConflict = conflictingAppointments?.some(appointment => {
        const existingStart = parseISO(appointment.start_time);
        const existingEnd = parseISO(appointment.end_time);
        
        const hasOverlap = (
          // Nueva cita empieza durante una existente
          (startTime >= existingStart && startTime < existingEnd) ||
          // Nueva cita termina durante una existente
          (endTime > existingStart && endTime <= existingEnd) ||
          // Nueva cita engloba una existente
          (startTime <= existingStart && endTime >= existingEnd) ||
          // Coincidencias exactas
          isSameMinute(startTime, existingStart) ||
          isSameMinute(endTime, existingEnd)
        );

        if (hasOverlap) {
          console.log('❌ Appointment conflict detected with:', appointment.client_name, 'at', appointment.start_time);
        }

        return hasOverlap;
      });

      if (hasConflict) {
        throw new Error('Este horario ya está ocupado. Por favor selecciona otro horario.');
      }

      // 6. Verificar bloqueos de tiempo
      const { data: timeBlocks, error: blockError } = await supabase
        .from('time_blocks')
        .select('id, start_time, end_time, reason')
        .eq('staff_id', appointmentData.staff_id)
        .gte('start_time', startTime.toISOString().split('T')[0] + 'T00:00:00.000Z')
        .lte('end_time', endTime.toISOString().split('T')[0] + 'T23:59:59.999Z');

      if (blockError) {
        console.error('❌ Time block check failed:', blockError);
        throw new Error('Error al verificar bloqueos de horarios');
      }

      const hasTimeBlockConflict = timeBlocks?.some(block => {
        const blockStart = parseISO(block.start_time);
        const blockEnd = parseISO(block.end_time);
        
        const hasOverlap = (
          (startTime >= blockStart && startTime < blockEnd) ||
          (endTime > blockStart && endTime <= blockEnd) ||
          (startTime <= blockStart && endTime >= blockEnd) ||
          isSameMinute(startTime, blockStart) ||
          isSameMinute(endTime, blockEnd)
        );

        if (hasOverlap) {
          console.log('❌ Time block conflict:', block.reason);
        }

        return hasOverlap;
      });

      if (hasTimeBlockConflict) {
        throw new Error('Este horario no está disponible debido a un bloqueo programado.');
      }

      // Si todas las validaciones pasan, crear la cita
      console.log('✅ All validations passed, creating appointment...');
      
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select(`
          *,
          staff_members (
            full_name
          ),
          services (
            name,
            duration_minutes
          )
        `)
        .single();

      if (error) {
        console.error('❌ Database insertion failed:', error);
        throw new Error('Error al crear la cita: ' + error.message);
      }

      console.log('✅ Appointment created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['available-time-slots'] });
      toast({
        title: "Cita creada exitosamente",
        description: "Tu cita se ha agendado correctamente con el especialista",
      });
    },
    onError: (error: Error) => {
      console.error('❌ Appointment creation error:', error);
      toast({
        title: "Error al crear la cita",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createAppointment: createAppointmentMutation.mutate,
    isCreating: createAppointmentMutation.isPending,
    error: createAppointmentMutation.error,
  };
};
