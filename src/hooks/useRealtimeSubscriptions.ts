
import { useRealtimeAppointments } from './useRealtimeAppointments';
import { useRealtimeTimeBlocks } from './useRealtimeTimeBlocks';

export const useRealtimeSubscriptions = () => {
  useRealtimeAppointments();
  useRealtimeTimeBlocks();
};
