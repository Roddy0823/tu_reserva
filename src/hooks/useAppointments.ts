
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/types/database";
import { useBusiness } from "./useBusiness";

export const useAppointments = () => {
  const { business } = useBusiness();

  const {
    data: appointments = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['appointments', business?.id],
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
            name
          )
        `)
        .eq('staff_members.business_id', business.id)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      return data as (Appointment & { 
        staff_members: { full_name: string }, 
        services: { name: string } 
      })[];
    },
    enabled: !!business?.id,
  });

  return {
    appointments,
    isLoading,
    error,
  };
};
