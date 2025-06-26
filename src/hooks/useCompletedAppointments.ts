
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/types/database";
import { useBusiness } from "./useBusiness";

export const useCompletedAppointments = () => {
  const { business } = useBusiness();

  const {
    data: appointments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointments', 'completed', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
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
        .eq('status', 'completado')
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data as (Appointment & { 
        staff_members: { full_name: string }, 
        services: { name: string, duration_minutes: number, price: number } 
      })[];
    },
    enabled: !!business?.id,
  });

  // Calculate statistics
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const thisMonthAppointments = appointments.filter(apt => 
    new Date(apt.start_time) >= startOfMonth
  );

  const stats = {
    total: appointments.length,
    totalRevenue: appointments.reduce((sum, apt) => sum + (apt.services?.price || 0), 0),
    thisMonth: thisMonthAppointments.length,
    thisMonthRevenue: thisMonthAppointments.reduce((sum, apt) => sum + (apt.services?.price || 0), 0),
  };

  return {
    appointments,
    stats,
    isLoading,
    error,
    refetch,
  };
};
