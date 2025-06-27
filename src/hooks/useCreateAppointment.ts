
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

      // Validaciones antes de crear la cita
      const startTime = parseISO(appointmentData.start_time);
      const endTime = parseISO(appointmentData.end_time);

      // 1. Verificar que no hay conflictos con otras citas ACTIVAS (no canceladas)
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

      // 2. Verificar que no hay bloqueos de tiempo que se superpongan
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

      // 3. Verificar que el personal puede realizar este servicio
      const { data: staffService, error: serviceError } = await supabase
        .from('staff_services')
        .select('*')
        .eq('staff_id', appointmentData.staff_id)
        .eq('service_id', appointmentData.service_id)
        .single();

      if (serviceError && serviceError.code !== 'PGRST116') {
        console.error('Error checking staff service:', serviceError);
        throw new Error('Error al verificar los servicios del personal');
      }

      // Si no hay relación staff_services, permitir (para compatibilidad)
      if (!staffService) {
        console.log('No specific staff-service relation found, allowing appointment');
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
            name
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
        description: "Tu cita se ha agendado correctamente",
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
