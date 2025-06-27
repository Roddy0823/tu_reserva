
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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Cita creada",
        description: "La cita se ha creado correctamente",
      });
    },
    onError: (error) => {
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
