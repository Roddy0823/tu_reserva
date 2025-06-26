
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBusiness } from "./useBusiness";

export const usePendingPayments = () => {
  const { business } = useBusiness();

  const query = useQuery({
    queryKey: ['pending-payments', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services (name, price),
          staff_members (full_name)
        `)
        .eq('business_id', business.id)
        .eq('payment_status', 'pendiente')
        .not('payment_proof_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!business?.id,
  });

  return {
    pendingPayments: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
