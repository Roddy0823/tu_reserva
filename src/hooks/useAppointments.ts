
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentInsert } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "./useBusiness";

export const useAppointments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  // Obtener todas las citas del negocio
  const getAllAppointments = () => {
    return useQuery({
      queryKey: ['appointments', 'all', business?.id],
      queryFn: async () => {
        if (!business?.id) return [];
        
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            services (
              name,
              duration_minutes,
              price
            ),
            staff_members!inner (
              full_name,
              business_id
            )
          `)
          .eq('staff_members.business_id', business.id)
          .order('start_time', { ascending: true });
        
        if (error) throw error;
        return data as (Appointment & { 
          services: { name: string; duration_minutes: number; price: number } | null;
          staff_members: { full_name: string };
        })[];
      },
      enabled: !!business?.id,
    });
  };

  // Obtener citas de hoy
  const getTodayAppointments = () => {
    return useQuery({
      queryKey: ['appointments', 'today', business?.id],
      queryFn: async () => {
        if (!business?.id) return [];
        
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            services (
              name,
              duration_minutes,
              price
            ),
            staff_members!inner (
              full_name,
              business_id
            )
          `)
          .eq('staff_members.business_id', business.id)
          .gte('start_time', startOfDay.toISOString())
          .lt('start_time', endOfDay.toISOString())
          .order('start_time', { ascending: true });
        
        if (error) throw error;
        return data as (Appointment & { 
          services: { name: string; duration_minutes: number; price: number } | null;
          staff_members: { full_name: string };
        })[];
      },
      enabled: !!business?.id,
    });
  };

  // Actualizar estado de cita
  const updateAppointmentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Cita actualizada",
        description: "El estado de la cita se ha actualizado correctamente",
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
    getAllAppointments,
    getTodayAppointments,
    updateAppointmentStatus: updateAppointmentStatusMutation.mutate,
    isUpdatingStatus: updateAppointmentStatusMutation.isPending,
  };
};
