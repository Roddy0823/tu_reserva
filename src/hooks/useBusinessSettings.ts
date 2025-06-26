
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BusinessSettings {
  id?: string;
  business_id: string;
  min_advance_hours: number;
  max_advance_days: number;
  allow_same_day_booking: boolean;
  cancellation_policy: string;
  cancellation_hours: number;
  require_confirmation: boolean;
  auto_confirm_bookings: boolean;
  cancellation_policy_text: string;
  email_new_booking: boolean;
  email_booking_cancelled: boolean;
  email_booking_confirmed: boolean;
  email_payment_received: boolean;
  email_daily_summary: boolean;
  email_weekly_report: boolean;
  sms_new_booking: boolean;
  sms_booking_reminder: boolean;
  browser_notifications: boolean;
  sound_notifications: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useBusinessSettings = (businessId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get business settings
  const {
    data: settings,
    isLoading,
    error
  } = useQuery({
    queryKey: ['business-settings', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return data as BusinessSettings | null;
    },
  });

  // Update business settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData: Partial<BusinessSettings>) => {
      // Check if settings exist
      const { data: existingSettings } = await supabase
        .from('business_settings')
        .select('id')
        .eq('business_id', businessId)
        .maybeSingle();

      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('business_settings')
          .update({
            ...settingsData,
            updated_at: new Date().toISOString()
          })
          .eq('business_id', businessId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('business_settings')
          .insert({
            business_id: businessId,
            ...settingsData,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-settings', businessId] });
      toast({
        title: "Configuración actualizada",
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar configuración",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
};
