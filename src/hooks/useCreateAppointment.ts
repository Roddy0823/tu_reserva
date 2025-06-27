
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppointmentInsert } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "./useBusiness";
import { parseISO, isAfter, isBefore } from "date-fns";

export const useCreateAppointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: AppointmentInsert) => {
      console.log('Creating appointment with data:', appointmentData);

      const startTime = parseISO(appointmentData.start_time);
      const endTime = parseISO(appointmentData.end_time);

      // 1. VALIDACIÓN CRÍTICA: Verificar que el personal puede realizar este servicio
      const { data: staffService, error: serviceError } = await supabase
        .from('staff_services')
        .select('*')
        .eq('staff_id', appointmentData.staff_id)
        .eq('service_id', appointmentData.service_id)
        .single();

      if (serviceError) {
        console.error('Error checking staff service capability:', serviceError);
        if (serviceError.code === 'PGRST116') {
          throw new Error('El personal seleccionado no está habilitado para realizar este servicio. Por favor selecciona otro especialista.');
        }
        throw new Error('Error al verificar las capacidades del personal');
      }

      if (!staffService) {
        throw new Error('El personal seleccionado no puede realizar este servicio');
      }

      console.log('Staff service validation passed:', staffService);

      // 2. Verificar que el personal está activo
      const { data: staffMember, error: staffError } = await supabase
        .from('staff_members')
        .select('is_active, full_name')
        .eq('id', appointmentData.staff_id)
        .single();

      if (staffError) {
        console.error('Error checking staff member:', staffError);
        throw new Error('Error al verificar el estado del personal');
      }

      if (!staffMember?.is_active) {
        throw new Error('El personal seleccionado no está activo actualmente');
      }

      // 3. Validar duración del servicio
      const { data: service, error: serviceDurationError } = await supabase
        .from('services')
        .select('duration_minutes, name')
        .eq('id', appointmentData.service_id)
        .single();

      if (serviceDurationError) {
        console.error('Error fetching service details:', serviceDurationError);
        throw new Error('Error al verificar los detalles del servicio');
      }

      // Verificar que la duración calculada coincide con la duración del servicio
      const calculatedDurationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      if (calculatedDurationMinutes !== service.duration_minutes) {
        console.error('Duration mismatch:', { calculated: calculatedDurationMinutes, expected: service.duration_minutes });
        throw new Error(`La duración de la cita (${calculatedDurationMinutes} min) no coincide con la duración del servicio ${service.name} (${service.duration_minutes} min)`);
      }

      // 4. Verificar que no hay conflictos con otras citas ACTIVAS (no canceladas)
      const { data: conflictingAppointments, error: conflictError } = await supabase
        .from('appointments')
        .select('id, start_time, end_time, status')
        .eq('staff_id', appointmentData.staff_id)
        .in('status', ['pendiente', 'confirmado']) // Solo citas activas
        .or(`and(start_time.lte.${appointmentData.start_time},end_time.gt.${appointmentData.start_time}),and(start_time.lt.${appointmentData.end_time},end_time.gte.${appointmentData.end_time}),and(start_time.gte.${appointmentData.start_time},end_time.lte.${appointmentData.end_time})`);

      if (conflictError) {
        console.error('Error checking conflicts:', conflictError);
        throw new Error('Error al verificar conflictos de horarios');
      }

      if (conflictingAppointments && conflictingAppointments.length > 0) {
        console.log('Conflicting appointments found:', conflictingAppointments);
        throw new Error('Este horario ya está ocupado. Por favor selecciona otro horario.');
      }

      // 5. Verificar que no hay bloqueos de tiempo que se superpongan
      const { data: timeBlocks, error: blockError } = await supabase
        .from('time_blocks')
        .select('id, start_time, end_time, reason')
        .eq('staff_id', appointmentData.staff_id)
        .or(`and(start_time.lte.${appointmentData.start_time},end_time.gt.${appointmentData.start_time}),and(start_time.lt.${appointmentData.end_time},end_time.gte.${appointmentData.end_time}),and(start_time.gte.${appointmentData.start_time},end_time.lte.${appointmentData.end_time})`);

      if (blockError) {
        console.error('Error checking time blocks:', blockError);
        throw new Error('Error al verificar bloqueos de horarios');
      }

      if (timeBlocks && timeBlocks.length > 0) {
        console.log('Time blocks found that conflict:', timeBlocks);
        throw new Error('Este horario no está disponible debido a un bloqueo programado.');
      }

      // Si todas las validaciones pasan, crear la cita
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
        console.error('Error creating appointment:', error);
        throw new Error('Error al crear la cita: ' + error.message);
      }

      console.log('Appointment created successfully:', data);
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
      console.error('Appointment creation error:', error);
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
