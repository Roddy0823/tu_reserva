
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addMinutes, startOfDay, endOfDay, isAfter, isBefore, parseISO, getDay } from "date-fns";

export const useAvailableTimeSlots = (staffId?: string, date?: Date, serviceDuration?: number, serviceId?: string) => {
  const query = useQuery({
    queryKey: ['available-time-slots', staffId, date, serviceDuration, serviceId],
    queryFn: async () => {
      if (!staffId || !date || !serviceDuration) return [];

      console.log('Checking availability for:', { staffId, date, serviceDuration, serviceId });

      // 1. VALIDACIÓN CRÍTICA: Verificar que el personal puede realizar el servicio
      if (serviceId) {
        const { data: staffService, error: serviceError } = await supabase
          .from('staff_services')
          .select('*')
          .eq('staff_id', staffId)
          .eq('service_id', serviceId)
          .single();

        if (serviceError) {
          console.error('Staff cannot perform this service:', serviceError);
          return []; // No slots available if staff can't perform service
        }

        if (!staffService) {
          console.log('No staff-service relationship found');
          return [];
        }

        console.log('Staff service validation passed:', staffService);
      }

      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      // 2. Obtener información del personal incluyendo horarios de trabajo y días laborales
      const { data: staffMember, error: staffError } = await supabase
        .from('staff_members')
        .select(`
          work_start_time, 
          work_end_time, 
          works_monday, 
          works_tuesday, 
          works_wednesday, 
          works_thursday, 
          works_friday, 
          works_saturday, 
          works_sunday,
          monday_start_time,
          monday_end_time,
          tuesday_start_time,
          tuesday_end_time,
          wednesday_start_time,
          wednesday_end_time,
          thursday_start_time,
          thursday_end_time,
          friday_start_time,
          friday_end_time,
          saturday_start_time,
          saturday_end_time,
          sunday_start_time,
          sunday_end_time,
          is_active
        `)
        .eq('id', staffId)
        .single();

      if (staffError) throw staffError;

      // Verificar que el personal está activo
      if (!staffMember?.is_active) {
        console.log('Staff member is not active');
        return [];
      }

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

      // Obtener horarios específicos para el día seleccionado
      const dayTimeFields = [
        { start: 'sunday_start_time', end: 'sunday_end_time' },
        { start: 'monday_start_time', end: 'monday_end_time' },
        { start: 'tuesday_start_time', end: 'tuesday_end_time' },
        { start: 'wednesday_start_time', end: 'wednesday_end_time' },
        { start: 'thursday_start_time', end: 'thursday_end_time' },
        { start: 'friday_start_time', end: 'friday_end_time' },
        { start: 'saturday_start_time', end: 'saturday_end_time' }
      ];
      
      const dayTimeField = dayTimeFields[dayOfWeek];
      
      // Usar horarios específicos del día o horarios generales como fallback
      const workStartTime = staffMember?.[dayTimeField.start] || staffMember?.work_start_time || '08:00';
      const workEndTime = staffMember?.[dayTimeField.end] || staffMember?.work_end_time || '18:00';

      console.log('Day-specific work hours:', { workStartTime, workEndTime, dayOfWeek });

      // 3. Obtener citas existentes ACTIVAS para el día (excluir canceladas)
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('start_time, end_time, status')
        .eq('staff_id', staffId)
        .gte('start_time', dayStart.toISOString())
        .lte('start_time', dayEnd.toISOString())
        .in('status', ['pendiente', 'confirmado']); // Solo citas activas

      if (appointmentsError) throw appointmentsError;

      console.log('Existing active appointments:', appointments);

      // 4. Obtener bloqueos de tiempo para el día
      const { data: timeBlocks, error: timeBlocksError } = await supabase
        .from('time_blocks')
        .select('start_time, end_time, reason')
        .eq('staff_id', staffId)
        .gte('start_time', dayStart.toISOString())
        .lte('end_time', dayEnd.toISOString());

      if (timeBlocksError) throw timeBlocksError;

      console.log('Time blocks:', timeBlocks);

      // Convertir horarios de trabajo a horas numéricas
      const [startHour, startMinute] = workStartTime.split(':').map(Number);
      const [endHour, endMinute] = workEndTime.split(':').map(Number);

      console.log('Work hours for this day:', { workStartTime, workEndTime, startHour, startMinute, endHour, endMinute });

      // 5. Generar slots de tiempo disponibles dentro del horario de trabajo
      const availableSlots: string[] = [];
      const slotDuration = 30; // minutos

      // Crear fecha de inicio basada en el horario de trabajo del día específico
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

        // Verificar si el slot no se superpone con citas existentes ACTIVAS
        const hasAppointmentConflict = appointments?.some(appointment => {
          const appointmentStart = parseISO(appointment.start_time);
          const appointmentEnd = parseISO(appointment.end_time);
          
          return (
            (isAfter(currentSlot, appointmentStart) && isBefore(currentSlot, appointmentEnd)) ||
            (isAfter(slotEnd, appointmentStart) && isBefore(slotEnd, appointmentEnd)) ||
            (isBefore(currentSlot, appointmentStart) && isAfter(slotEnd, appointmentEnd)) ||
            currentSlot.getTime() === appointmentStart.getTime() ||
            slotEnd.getTime() === appointmentEnd.getTime()
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
            currentSlot.getTime() === blockStart.getTime() ||
            slotEnd.getTime() === blockEnd.getTime()
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
