
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppointmentInsert } from "@/types/database";

export const useCreateAppointment = () => {
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: Omit<AppointmentInsert, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });

  return {
    createAppointment: createAppointmentMutation.mutate,
    isCreating: createAppointmentMutation.isPending,
    error: createAppointmentMutation.error,
  };
};
