
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

  console.log('useSubscription: business data', business);

  // Get all subscription plans
  const { data: plans = [], isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      console.log('Fetching subscription plans...');
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_cop', { ascending: true });
      
      if (error) {
        console.error('Error fetching plans:', error);
        throw error;
      }
      console.log('Plans fetched:', data);
      return data as SubscriptionPlan[];
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get business subscription
  const { 
    data: subscription, 
    isLoading: subscriptionLoading,
    error: subscriptionError
  } = useQuery({
    queryKey: ['business-subscription', business?.id],
    queryFn: async () => {
      if (!business?.id) {
        console.log('No business ID available');
        return null;
      }
      
      console.log('Fetching business subscription for:', business.id);
      const { data, error } = await supabase
        .from('business_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('business_id', business.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching subscription:', error);
        throw error;
      }
      console.log('Subscription fetched:', data);
      return data as BusinessSubscription | null;
    },
    enabled: !!business?.id,
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Get current month usage
  const { data: currentUsage, isLoading: usageLoading, error: usageError } = useQuery({
    queryKey: ['monthly-usage', business?.id],
    queryFn: async () => {
      if (!business?.id) {
        console.log('No business ID for usage check');
        return null;
      }
      
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      console.log('Fetching usage for:', { businessId: business.id, year, month });
      const { data, error } = await supabase
        .from('monthly_usage')
        .select('*')
        .eq('business_id', business.id)
        .eq('year', year)
        .eq('month', month)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching usage:', error);
        throw error;
      }
      console.log('Usage fetched:', data);
      return data as MonthlyUsage | null;
    },
    enabled: !!business?.id,
    retry: 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Check if business can accept bookings
  const { data: canAcceptBookings = true } = useQuery({
    queryKey: ['can-accept-booking', business?.id],
    queryFn: async () => {
      if (!business?.id) return false;
      
      console.log('Checking booking acceptance for:', business.id);
      const { data, error } = await supabase
        .rpc('can_accept_booking', { business_uuid: business.id });
      
      if (error) {
        console.error('Error checking booking acceptance:', error);
        return true; // Default to allowing bookings if error
      }
      console.log('Can accept bookings:', data);
      return data as boolean;
    },
    enabled: !!business?.id,
    retry: 1,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Create checkout session
  const createCheckoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      console.log('Creating checkout for plan:', planId);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId },
      });
      
      if (error) {
        console.error('Checkout error:', error);
        throw error;
      }
      console.log('Checkout created:', data);
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      console.error('Checkout mutation error:', error);
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
      console.log('Opening customer portal...');
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Portal error:', error);
        throw error;
      }
      console.log('Portal created:', data);
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      console.error('Portal mutation error:', error);
      toast({
        title: "Error al abrir portal de cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle errors
  if (plansError || subscriptionError || usageError) {
    console.error('Subscription hook errors:', { plansError, subscriptionError, usageError });
  }

  const isFreePlan = subscription?.subscription_plans?.name === 'Gratuito' || !subscription;
  const currentBookings = currentUsage?.completed_bookings || 0;
  const maxBookings = subscription?.subscription_plans?.max_bookings_per_month || 10;
  const hasReachedLimit = isFreePlan && currentBookings >= maxBookings;

  const isLoading = plansLoading || subscriptionLoading || usageLoading;

  console.log('useSubscription state:', {
    isLoading,
    plansCount: plans.length,
    hasSubscription: !!subscription,
    isFreePlan,
    currentBookings,
    maxBookings,
    hasReachedLimit
  });

  return {
    plans,
    subscription,
    currentUsage,
    canAcceptBookings,
    isFreePlan,
    hasReachedLimit,
    currentBookings,
    maxBookings,
    isLoading,
    error: plansError || subscriptionError || usageError,
    createCheckout: createCheckoutMutation.mutate,
    openCustomerPortal: customerPortalMutation.mutate,
    isCreatingCheckout: createCheckoutMutation.isPending,
    isOpeningPortal: customerPortalMutation.isPending,
  };
};
