
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusiness } from './useBusiness';

export const useRealtimeAppointments = () => {
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  useEffect(() => {
    if (!business?.id) return;

    console.log('Setting up realtime subscription for appointments...');

    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `business_id=eq.${business.id}`
        },
        (payload) => {
          console.log('Appointment change detected:', payload);
          
          // Invalidar todas las queries relacionadas con appointments
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          queryClient.invalidateQueries({ queryKey: ['appointments', 'today'] });
          queryClient.invalidateQueries({ queryKey: ['appointments', 'completed'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up appointments realtime subscription...');
      supabase.removeChannel(channel);
    };
  }, [business?.id, queryClient]);
};
