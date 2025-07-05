
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePaymentProofUpload = () => {
  const { toast } = useToast();

  const uploadPaymentProofMutation = useMutation({
    mutationFn: async ({ appointmentId, file }: { appointmentId: string; file: File }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${appointmentId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment_proofs')
        .getPublicUrl(filePath);

      // Update appointment with payment proof URL
      const { data, error } = await supabase
        .from('appointments')
        .update({ payment_proof_url: publicUrl })
        .eq('id', appointmentId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating appointment with payment proof:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No appointment found with ID:', appointmentId);
        throw new Error('No se encontró la cita para actualizar el comprobante');
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Comprobante subido",
        description: "Tu comprobante de pago ha sido enviado para revisión",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al subir comprobante",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    uploadPaymentProof: uploadPaymentProofMutation.mutate,
    isUploading: uploadPaymentProofMutation.isPending,
  };
};
