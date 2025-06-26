
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePaymentValidation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const validatePaymentMutation = useMutation({
    mutationFn: async ({ appointmentId, action }: { appointmentId: string; action: 'aprobado' | 'rechazado' }) => {
      const updates: any = {
        payment_status: action,
      };

      // If approving, also change appointment status to confirmed
      if (action === 'aprobado') {
        updates.status = 'confirmado';
      }

      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      
      toast({
        title: variables.action === 'aprobado' ? "Pago aprobado" : "Pago rechazado",
        description: variables.action === 'aprobado' 
          ? "El turno ha sido confirmado automáticamente" 
          : "El pago ha sido rechazado",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    validatePayment: validatePaymentMutation.mutate,
    isValidating: validatePaymentMutation.isPending,
  };
};
