
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addMinutes, startOfDay, endOfDay, isAfter, isBefore } from "date-fns";

export const useAvailableTimeSlots = (staffId?: string, date?: Date, serviceDuration?: number) => {
  const query = useQuery({
    queryKey: ['available-time-slots', staffId, date, serviceDuration],
    queryFn: async () => {
      if (!staffId || !date || !serviceDuration) return [];

      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      // Obtener citas existentes para el día
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('staff_id', staffId)
        .gte('start_time', dayStart.toISOString())
        .lte('start_time', dayEnd.toISOString())
        .neq('status', 'cancelado');

      if (appointmentsError) throw appointmentsError;

      // Obtener bloqueos de tiempo para el día
      const { data: timeBlocks, error: timeBlocksError } = await supabase
        .from('time_blocks')
        .select('start_time, end_time')
        .eq('staff_id', staffId)
        .gte('start_time', dayStart.toISOString())
        .lte('end_time', dayEnd.toISOString());

      if (timeBlocksError) throw timeBlocksError;

      // Generar slots de tiempo disponibles (de 9:00 a 18:00 cada 30 minutos)
      const availableSlots: string[] = [];
      const startHour = 9;
      const endHour = 18;
      const slotDuration = 30; // minutos

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const slotStart = new Date(date);
          slotStart.setHours(hour, minute, 0, 0);
          
          const slotEnd = addMinutes(slotStart, serviceDuration);
          
          // Verificar si el slot no se superpone con citas existentes
          const hasAppointmentConflict = appointments?.some(appointment => {
            const appointmentStart = new Date(appointment.start_time);
            const appointmentEnd = new Date(appointment.end_time);
            
            return (
              (isAfter(slotStart, appointmentStart) && isBefore(slotStart, appointmentEnd)) ||
              (isAfter(slotEnd, appointmentStart) && isBefore(slotEnd, appointmentEnd)) ||
              (isBefore(slotStart, appointmentStart) && isAfter(slotEnd, appointmentEnd))
            );
          });

          // Verificar si el slot no se superpone con bloqueos de tiempo
          const hasTimeBlockConflict = timeBlocks?.some(block => {
            const blockStart = new Date(block.start_time);
            const blockEnd = new Date(block.end_time);
            
            return (
              (isAfter(slotStart, blockStart) && isBefore(slotStart, blockEnd)) ||
              (isAfter(slotEnd, blockStart) && isBefore(slotEnd, blockEnd)) ||
              (isBefore(slotStart, blockStart) && isAfter(slotEnd, blockEnd))
            );
          });

          // Si no hay conflictos, agregar el slot
          if (!hasAppointmentConflict && !hasTimeBlockConflict) {
            availableSlots.push(format(slotStart, 'HH:mm'));
          }
        }
      }

      return availableSlots;
    },
    enabled: !!(staffId && date && serviceDuration),
  });

  return {
    availableSlots: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
