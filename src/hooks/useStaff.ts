
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/types/database";

export const useStaff = (businessId?: string) => {
  const query = useQuery({
    queryKey: ['staff', businessId],
    queryFn: async () => {
      let query = supabase
        .from('staff_members')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      // Si se proporciona businessId (para reservas públicas), filtrar por ese negocio
      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching staff:', error);
        throw error;
      }
      return data as StaffMember[];
    },
    enabled: !businessId || !!businessId, // Siempre habilitado, o habilitado si hay businessId
  });

  return {
    staffMembers: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
