import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AppointmentUpdateData {
  id: string;
  start_time?: string;
  end_time?: string;
  staff_id?: string;
  service_id?: string;
}

export const useAppointmentUpdate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateAppointmentMutation = useMutation({
    mutationFn: async (updateData: AppointmentUpdateData) => {
      // Obtener datos completos de la cita antes de actualizar
      const { data: appointment, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          services (name, price),
          staff_members (full_name)
        `)
        .eq('id', updateData.id)
        .single();

      if (fetchError) throw fetchError;

      // Actualizar la cita en la base de datos
      const { error } = await supabase
        .from('appointments')
        .update({
          start_time: updateData.start_time || appointment.start_time,
          end_time: updateData.end_time || appointment.end_time,
          staff_id: updateData.staff_id || appointment.staff_id,
          service_id: updateData.service_id || appointment.service_id,
        })
        .eq('id', updateData.id);
      
      if (error) throw error;

      // Si la cita está confirmada y se cambió fecha/hora/personal, actualizar Google Calendar
      if (appointment.status === 'confirmado' && 
          (updateData.start_time || updateData.end_time || updateData.staff_id)) {
        try {
          // Obtener datos actualizados para la sincronización
          const updatedStaffId = updateData.staff_id || appointment.staff_id;
          let staffName = appointment.staff_members?.full_name || '';
          
          // Si cambió el personal, obtener el nuevo nombre
          if (updateData.staff_id && updateData.staff_id !== appointment.staff_id) {
            const { data: newStaff } = await supabase
              .from('staff_members')
              .select('full_name')
              .eq('id', updateData.staff_id)
              .single();
            staffName = newStaff?.full_name || '';
          }

          await supabase.functions.invoke('google-calendar-sync', {
            body: {
              action: 'update',
              appointmentId: appointment.id,
              appointmentData: {
                appointment_id: appointment.id,
                business_id: appointment.business_id,
                start_time: updateData.start_time || appointment.start_time,
                end_time: updateData.end_time || appointment.end_time,
                client_name: appointment.client_name,
                client_email: appointment.client_email,
                client_phone: appointment.client_phone,
                service_name: appointment.services?.name || '',
                staff_name: staffName,
                price: appointment.services?.price || 0,
              }
            }
          });
        } catch (syncError) {
          console.warn('Error sincronizando cambios con Google Calendar:', syncError);
          // No fallar la operación principal por errores de sincronización
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['available-time-slots'] });
      toast({
        title: "Cita actualizada",
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar cita",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    updateAppointment: updateAppointmentMutation.mutate,
    isUpdating: updateAppointmentMutation.isPending,
  };
};