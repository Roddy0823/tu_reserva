
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStaffByService = (serviceId: string) => {
  return useQuery({
    queryKey: ['staff-by-service', serviceId],
    queryFn: async () => {
      if (!serviceId) return [];
      
      const { data, error } = await supabase
        .from('staff_services')
        .select(`
          staff_members (
            id,
            full_name,
            email,
            is_active
          )
        `)
        .eq('service_id', serviceId);
      
      if (error) throw error;
      return data.map(item => item.staff_members).filter(Boolean);
    },
    enabled: !!serviceId,
  });
};
