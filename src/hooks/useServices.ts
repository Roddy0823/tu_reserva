
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/database";

export const useServices = (businessId?: string) => {
  const query = useQuery({
    queryKey: ['services', businessId],
    queryFn: async () => {
      let query = supabase
        .from('services')
        .select('*')
        .order('name');

      // Si se proporciona businessId (para reservas públicas), filtrar por ese negocio
      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      return data as Service[];
    },
    enabled: !businessId || !!businessId, // Siempre habilitado, o habilitado si hay businessId
  });

  return {
    services: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
