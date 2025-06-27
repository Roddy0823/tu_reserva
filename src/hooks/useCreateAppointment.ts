
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppointmentInsert } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "./useBusiness";

export const useCreateAppointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: AppointmentInsert) => {
      console.log('=== CREATING APPOINTMENT WITH ATOMIC FUNCTION ===');
      console.log('Appointment data:', appointmentData);

      // Llamar a la función RPC de Supabase para crear la cita de forma atómica
      const { data, error } = await supabase.rpc('create_appointment_safely', {
        p_client_name: appointmentData.client_name,
        p_client_email: appointmentData.client_email,
        p_client_phone: appointmentData.client_phone || null,
        p_service_id: appointmentData.service_id,
        p_staff_id: appointmentData.staff_id,
        p_start_time: appointmentData.start_time,
        p_end_time: appointmentData.end_time,
        p_business_id: appointmentData.business_id
      });

      if (error) {
        console.error('❌ RPC call failed:', error);
        throw new Error('Error al conectar con el servidor: ' + error.message);
      }

      console.log('📝 RPC response:', data);

      // Verificar si la función devolvió un error
      if (!data.success) {
        console.error('❌ Appointment creation failed:', data.error);
        throw new Error(data.error);
      }

      console.log('✅ Appointment created successfully:', data.appointment);
      return data.appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['available-time-slots'] });
      queryClient.invalidateQueries({ queryKey: ['today-appointments'] });
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
