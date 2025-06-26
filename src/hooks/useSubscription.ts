
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "./useBusiness";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_cop: number;
  max_bookings_per_month: number | null;
  is_active: boolean;
}

interface BusinessSubscription {
  id: string;
  business_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id: string | null;
  subscription_plans: SubscriptionPlan;
}

interface MonthlyUsage {
  id: string;
  business_id: string;
  year: number;
  month: number;
  completed_bookings: number;
}

export const useSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  // Get all subscription plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_cop', { ascending: true });
      
      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });

  // Get business subscription
  const { 
    data: subscription, 
    isLoading: subscriptionLoading 
  } = useQuery({
    queryKey: ['business-subscription', business?.id],
    queryFn: async () => {
      if (!business?.id) return null;
      
      const { data, error } = await supabase
        .from('business_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('business_id', business.id)
        .single();
      
      if (error) throw error;
      return data as BusinessSubscription;
    },
    enabled: !!business?.id,
  });

  // Get current month usage
  const { data: currentUsage, isLoading: usageLoading } = useQuery({
    queryKey: ['monthly-usage', business?.id],
    queryFn: async () => {
      if (!business?.id) return null;
      
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const { data, error } = await supabase
        .from('monthly_usage')
        .select('*')
        .eq('business_id', business.id)
        .eq('year', year)
        .eq('month', month)
        .maybeSingle();
      
      if (error) throw error;
      return data as MonthlyUsage | null;
    },
    enabled: !!business?.id,
  });

  // Check if business can accept bookings
  const { data: canAcceptBookings = true } = useQuery({
    queryKey: ['can-accept-booking', business?.id],
    queryFn: async () => {
      if (!business?.id) return false;
      
      const { data, error } = await supabase
        .rpc('can_accept_booking', { business_uuid: business.id });
      
      if (error) throw error;
      return data as boolean;
    },
    enabled: !!business?.id,
  });

  // Create checkout session
  const createCheckoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      toast({
        title: "Error al crear sesión de pago",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Customer portal
  const customerPortalMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      toast({
        title: "Error al abrir portal de cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isFreePlan = subscription?.subscription_plans?.name === 'Gratuito';
  const currentBookings = currentUsage?.completed_bookings || 0;
  const maxBookings = subscription?.subscription_plans?.max_bookings_per_month || 0;
  const hasReachedLimit = isFreePlan && currentBookings >= maxBookings;

  return {
    plans,
    subscription,
    currentUsage,
    canAcceptBookings,
    isFreePlan,
    hasReachedLimit,
    currentBookings,
    maxBookings,
    isLoading: plansLoading || subscriptionLoading || usageLoading,
    createCheckout: createCheckoutMutation.mutate,
    openCustomerPortal: customerPortalMutation.mutate,
    isCreatingCheckout: createCheckoutMutation.isPending,
    isOpeningPortal: customerPortalMutation.isPending,
  };
};
