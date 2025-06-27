
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addMinutes, startOfDay, endOfDay, isAfter, isBefore, parseISO, getDay } from "date-fns";

export const useAvailableTimeSlots = (staffId?: string, date?: Date, serviceDuration?: number) => {
  const query = useQuery({
    queryKey: ['available-time-slots', staffId, date, serviceDuration],
    queryFn: async () => {
      if (!staffId || !date || !serviceDuration) return [];

      console.log('Checking availability for:', { staffId, date, serviceDuration });

      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      // Obtener información del personal incluyendo horarios de trabajo y días laborales
      const { data: staffMember, error: staffError } = await supabase
        .from('staff_members')
        .select('work_start_time, work_end_time, works_monday, works_tuesday, works_wednesday, works_thursday, works_friday, works_saturday, works_sunday')
        .eq('id', staffId)
        .single();

      if (staffError) throw staffError;

      console.log('Staff member work schedule:', staffMember);

      // Verificar si el personal trabaja en el día seleccionado
      const dayOfWeek = getDay(date); // 0 = domingo, 1 = lunes, etc.
      const workDayFields = [
        'works_sunday',
        'works_monday', 
        'works_tuesday', 
        'works_wednesday', 
        'works_thursday', 
        'works_friday', 
        'works_saturday'
      ];
      
      const worksOnSelectedDay = staffMember?.[workDayFields[dayOfWeek]];
      
      if (!worksOnSelectedDay) {
        console.log('Staff member does not work on this day');
        return [];
      }

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

      // Usar horarios de trabajo del personal o valores por defecto
      const workStartTime = staffMember?.work_start_time || '08:00';
      const workEndTime = staffMember?.work_end_time || '18:00';
      
      // Convertir horarios de trabajo a horas numéricas
      const [startHour, startMinute] = workStartTime.split(':').map(Number);
      const [endHour, endMinute] = workEndTime.split(':').map(Number);

      console.log('Work hours:', { workStartTime, workEndTime, startHour, startMinute, endHour, endMinute });

      // Generar slots de tiempo disponibles dentro del horario de trabajo
      const availableSlots: string[] = [];
      const slotDuration = 30; // minutos

      // Crear fecha de inicio basada en el horario de trabajo
      const workStart = new Date(date);
      workStart.setHours(startHour, startMinute, 0, 0);
      
      const workEnd = new Date(date);
      workEnd.setHours(endHour, endMinute, 0, 0);

      let currentSlot = new Date(workStart);

      while (currentSlot < workEnd) {
        const slotEnd = addMinutes(currentSlot, serviceDuration);
        
        // No permitir slots que terminen después del horario laboral
        if (slotEnd > workEnd) {
          break;
        }

        // Verificar si el slot no se superpone con citas existentes
        const hasAppointmentConflict = appointments?.some(appointment => {
          const appointmentStart = parseISO(appointment.start_time);
          const appointmentEnd = parseISO(appointment.end_time);
          
          return (
            (isAfter(currentSlot, appointmentStart) && isBefore(currentSlot, appointmentEnd)) ||
            (isAfter(slotEnd, appointmentStart) && isBefore(slotEnd, appointmentEnd)) ||
            (isBefore(currentSlot, appointmentStart) && isAfter(slotEnd, appointmentEnd)) ||
            currentSlot.getTime() === appointmentStart.getTime()
          );
        });

        // Verificar si el slot no se superpone con bloqueos de tiempo
        const hasTimeBlockConflict = timeBlocks?.some(block => {
          const blockStart = parseISO(block.start_time);
          const blockEnd = parseISO(block.end_time);
          
          return (
            (isAfter(currentSlot, blockStart) && isBefore(currentSlot, blockEnd)) ||
            (isAfter(slotEnd, blockStart) && isBefore(slotEnd, blockEnd)) ||
            (isBefore(currentSlot, blockStart) && isAfter(slotEnd, blockEnd)) ||
            currentSlot.getTime() === blockStart.getTime()
          );
        });

        // Si no hay conflictos, agregar el slot
        if (!hasAppointmentConflict && !hasTimeBlockConflict) {
          availableSlots.push(format(currentSlot, 'HH:mm'));
        }

        // Avanzar al siguiente slot
        currentSlot = addMinutes(currentSlot, slotDuration);
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
