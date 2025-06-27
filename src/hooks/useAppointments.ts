
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
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
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
