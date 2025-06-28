
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusiness } from './useBusiness';

export const useRealtimeTimeBlocks = () => {
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  useEffect(() => {
    if (!business?.id) return;

    console.log('Setting up realtime subscription for time_blocks...');

    const channel = supabase
      .channel('time-blocks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'time_blocks'
        },
        (payload) => {
          console.log('Time block change detected:', payload);
          
          // Invalidar queries relacionadas con time_blocks
          queryClient.invalidateQueries({ queryKey: ['time-blocks'] });
          queryClient.invalidateQueries({ queryKey: ['available-time-slots'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up time_blocks realtime subscription...');
      supabase.removeChannel(channel);
    };
  }, [business?.id, queryClient]);
};
