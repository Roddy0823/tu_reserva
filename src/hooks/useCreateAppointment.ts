
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "@/types/database";

interface CreateAppointmentData {
  business_id: string;
  service_id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_email: string;
  client_phone: string;
}

interface CreateAppointmentResponse {
  success: boolean;
  error?: string;
  appointment?: Appointment;
}

export const useCreateAppointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (appointmentData: CreateAppointmentData) => {
      console.log('Creating appointment with data:', appointmentData);
      
      // Usar la función create_appointment_safely para validaciones completas
      const { data, error } = await supabase.rpc('create_appointment_safely', {
        p_client_name: appointmentData.client_name,
        p_client_email: appointmentData.client_email,
        p_client_phone: appointmentData.client_phone || '',
        p_service_id: appointmentData.service_id,
        p_staff_id: appointmentData.staff_id,
        p_start_time: appointmentData.start_time,
        p_end_time: appointmentData.end_time,
        p_business_id: appointmentData.business_id
      });

      if (error) {
        console.error('Error calling create_appointment_safely:', error);
        throw error;
      }

      console.log('Function result:', data);

      // Type cast the response
      const response = data as CreateAppointmentResponse;

      if (!response.success) {
        throw new Error(response.error || 'Error desconocido al crear la cita');
      }

      return response.appointment as Appointment;
    },
    onSuccess: (data) => {
      console.log('Appointment created successfully:', data);
      toast({
        title: "¡Cita creada exitosamente!",
        description: "Tu reserva ha sido confirmada. Recibirás más detalles por email.",
      });
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error: any) => {
      console.error('Error creating appointment:', error);
      
      let errorMessage = "Ocurrió un error al crear la cita. Intenta nuevamente.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error al crear la cita",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  return {
    createAppointment: mutation.mutate,
    isCreating: mutation.isPending,
    ...mutation
  };
};
