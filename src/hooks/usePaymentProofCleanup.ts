
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePaymentProofCleanup = () => {
  const { toast } = useToast();

  const cleanupBrokenUrlsMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('cleanup_broken_payment_proof_urls');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (cleanupCount) => {
      toast({
        title: "Limpieza completada",
        description: `${cleanupCount} URLs de comprobantes rotas fueron limpiadas`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error en la limpieza",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    cleanupBrokenUrls: cleanupBrokenUrlsMutation.mutate,
    isCleaningUp: cleanupBrokenUrlsMutation.isPending,
  };
};
