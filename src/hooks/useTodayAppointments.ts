
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/types/database";
import { useBusiness } from "./useBusiness";

export const useTodayAppointments = () => {
  const { business } = useBusiness();

  const {
    data: appointments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointments', 'today', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          staff_members!inner (
            full_name,
            business_id
          ),
          services (
            name,
            duration_minutes,
            price
          )
        `)
        .eq('staff_members.business_id', business.id)
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as (Appointment & { 
        staff_members: { full_name: string }, 
        services: { name: string, duration_minutes: number, price: number } 
      })[];
    },
    enabled: !!business?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Calculate statistics
  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(apt => apt.status === 'confirmado').length,
    pending: appointments.filter(apt => apt.status === 'pendiente').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelado').length,
    completed: appointments.filter(apt => apt.status === 'completado').length,
    totalRevenue: appointments
      .filter(apt => apt.status === 'completado')
      .reduce((sum, apt) => sum + (apt.services?.price || 0), 0),
  };

  return {
    appointments,
    stats,
    isLoading,
    error,
    refetch,
  };
};
