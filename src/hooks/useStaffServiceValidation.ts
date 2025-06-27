
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStaffServiceValidation = (staffId?: string, serviceId?: string) => {
  const query = useQuery({
    queryKey: ['staff-service-validation', staffId, serviceId],
    queryFn: async () => {
      if (!staffId || !serviceId) return false;

      console.log('Validating staff service:', { staffId, serviceId });

      // Verificar si existe una relación staff_services para este personal y servicio
      const { data: staffService, error } = await supabase
        .from('staff_services')
        .select('*')
        .eq('staff_id', staffId)
        .eq('service_id', serviceId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      const canPerformService = !!staffService;
      console.log('Staff can perform service:', canPerformService);
      
      return canPerformService;
    },
    enabled: !!(staffId && serviceId),
  });

  return {
    canPerformService: query.data || false,
    isLoading: query.isLoading,
    error: query.error,
  };
};
