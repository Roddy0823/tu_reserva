
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentStatus } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

export const useAppointments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: appointments = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services (
            name,
            duration_minutes,
            price
          ),
          staff_members (
            full_name
          )
        `)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      
      return data as (Appointment & { 
        staff_members: { full_name: string }, 
        services: { name: string, duration_minutes: number, price: number } 
      })[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      // Obtener datos completos de la cita antes de actualizar
      const { data: appointment, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          services (name, price),
          staff_members (full_name)
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Actualizar estado en la base de datos
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;

      // Sincronizar con Google Calendar si es necesario
      try {
        if (status === 'confirmado') {
          // Crear evento en Google Calendar
          await supabase.functions.invoke('google-calendar-sync', {
            body: {
              action: 'create',
              appointmentData: {
                appointment_id: appointment.id,
                business_id: appointment.business_id,
                start_time: appointment.start_time,
                end_time: appointment.end_time,
                client_name: appointment.client_name,
                client_email: appointment.client_email,
                client_phone: appointment.client_phone,
                service_name: appointment.services?.name || '',
                staff_name: appointment.staff_members?.full_name || '',
                price: appointment.services?.price || 0,
              }
            }
          });
        } else if (status === 'cancelado') {
          // Eliminar evento de Google Calendar
          await supabase.functions.invoke('google-calendar-sync', {
            body: {
              action: 'delete',
              appointmentId: appointment.id
            }
          });
        }
      } catch (syncError) {
        console.warn('Error sincronizando con Google Calendar:', syncError);
        // No fallar la operación principal por errores de sincronización
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Estado actualizado",
        description: "El estado de la cita se ha actualizado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar estado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      // Eliminar evento de Google Calendar primero si existe
      try {
        await supabase.functions.invoke('google-calendar-sync', {
          body: {
            action: 'delete',
            appointmentId: id
          }
        });
      } catch (syncError) {
        console.warn('Error eliminando evento de Google Calendar:', syncError);
      }

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Cita eliminada",
        description: "La cita se ha eliminado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al eliminar cita",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    appointments,
    isLoading,
    error,
    updateStatus: updateStatusMutation.mutate,
    deleteAppointment: deleteAppointmentMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeletingAppointment: deleteAppointmentMutation.isPending,
  };
};
