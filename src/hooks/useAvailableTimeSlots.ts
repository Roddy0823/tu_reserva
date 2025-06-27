
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addMinutes, startOfDay, endOfDay, isAfter, isBefore, parseISO } from "date-fns";

export const useAvailableTimeSlots = (staffId?: string, date?: Date, serviceDuration?: number) => {
  const query = useQuery({
    queryKey: ['available-time-slots', staffId, date, serviceDuration],
    queryFn: async () => {
      if (!staffId || !date || !serviceDuration) return [];

      console.log('Checking availability for:', { staffId, date, serviceDuration });

      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      // Obtener citas existentes para el día
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('start_time, end_time, status')
        .eq('staff_id', staffId)
        .gte('start_time', dayStart.toISOString())
        .lte('start_time', dayEnd.toISOString())
        .in('status', ['pendiente', 'confirmado']);

      if (appointmentsError) throw appointmentsError;

      console.log('Existing appointments:', appointments);

      // Obtener bloqueos de tiempo para el día
      const { data: timeBlocks, error: timeBlocksError } = await supabase
        .from('time_blocks')
        .select('start_time, end_time, reason')
        .eq('staff_id', staffId)
        .gte('start_time', dayStart.toISOString())
        .lte('end_time', dayEnd.toISOString());

      if (timeBlocksError) throw timeBlocksError;

      console.log('Time blocks:', timeBlocks);

      // Generar slots de tiempo disponibles (de 8:00 a 19:00 cada 30 minutos)
      const availableSlots: string[] = [];
      const startHour = 8;
      const endHour = 19;
      const slotDuration = 30; // minutos

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const slotStart = new Date(date);
          slotStart.setHours(hour, minute, 0, 0);
          
          const slotEnd = addMinutes(slotStart, serviceDuration);
          
          // No permitir slots que terminen después del horario laboral
          if (slotEnd.getHours() > endHour) {
            continue;
          }

          // Verificar si el slot no se superpone con citas existentes
          const hasAppointmentConflict = appointments?.some(appointment => {
            const appointmentStart = parseISO(appointment.start_time);
            const appointmentEnd = parseISO(appointment.end_time);
            
            return (
              (isAfter(slotStart, appointmentStart) && isBefore(slotStart, appointmentEnd)) ||
              (isAfter(slotEnd, appointmentStart) && isBefore(slotEnd, appointmentEnd)) ||
              (isBefore(slotStart, appointmentStart) && isAfter(slotEnd, appointmentEnd)) ||
              slotStart.getTime() === appointmentStart.getTime()
            );
          });

          // Verificar si el slot no se superpone con bloqueos de tiempo
          const hasTimeBlockConflict = timeBlocks?.some(block => {
            const blockStart = parseISO(block.start_time);
            const blockEnd = parseISO(block.end_time);
            
            return (
              (isAfter(slotStart, blockStart) && isBefore(slotStart, blockEnd)) ||
              (isAfter(slotEnd, blockStart) && isBefore(slotEnd, blockEnd)) ||
              (isBefore(slotStart, blockStart) && isAfter(slotEnd, blockEnd)) ||
              slotStart.getTime() === blockStart.getTime()
            );
          });

          // Si no hay conflictos, agregar el slot
          if (!hasAppointmentConflict && !hasTimeBlockConflict) {
            availableSlots.push(format(slotStart, 'HH:mm'));
          }
        }
      }

      console.log('Available slots:', availableSlots);
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
