
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addMinutes, startOfDay, endOfDay, isAfter, isBefore, parseISO, getDay, isSameMinute } from "date-fns";

export const useAvailableTimeSlots = (staffId?: string, date?: Date, serviceDuration?: number, serviceId?: string) => {
  const query = useQuery({
    queryKey: ['available-time-slots', staffId, date, serviceDuration, serviceId],
    queryFn: async () => {
      if (!staffId || !date || !serviceDuration) return [];

      console.log('=== CHECKING AVAILABILITY ===');
      console.log('Staff ID:', staffId);
      console.log('Date:', format(date, 'yyyy-MM-dd'));
      console.log('Service Duration:', serviceDuration, 'minutes');
      console.log('Service ID:', serviceId);

      // 1. VALIDACIÓN CRÍTICA: Verificar que el personal puede realizar el servicio
      if (serviceId) {
        const { data: staffService, error: serviceError } = await supabase
          .from('staff_services')
          .select('*')
          .eq('staff_id', staffId)
          .eq('service_id', serviceId)
          .single();

        if (serviceError || !staffService) {
          console.log('❌ Staff cannot perform this service:', serviceError?.message);
          return [];
        }
        console.log('✅ Staff service validation passed');
      }

      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      // 2. Obtener información del personal y horarios de trabajo
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

      if (staffError || !staffMember?.is_active) {
        console.log('❌ Staff member not found or inactive');
        return [];
      }

      // Verificar si trabaja en el día seleccionado
      const dayOfWeek = getDay(date);
      const workDayFields = [
        'works_sunday', 'works_monday', 'works_tuesday', 'works_wednesday', 
        'works_thursday', 'works_friday', 'works_saturday'
      ];
      
      if (!staffMember[workDayFields[dayOfWeek]]) {
        console.log('❌ Staff does not work on this day');
        return [];
      }

      // Obtener horarios específicos del día
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
      const workStartTime = staffMember[dayTimeField.start] || staffMember.work_start_time || '08:00';
      const workEndTime = staffMember[dayTimeField.end] || staffMember.work_end_time || '18:00';

      console.log('Work hours:', workStartTime, '-', workEndTime);

      // 3. Obtener citas ACTIVAS existentes
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('start_time, end_time, status, service_id')
        .eq('staff_id', staffId)
        .gte('start_time', dayStart.toISOString())
        .lte('start_time', dayEnd.toISOString())
        .in('status', ['pendiente', 'confirmado']);

      if (appointmentsError) {
        console.log('❌ Error fetching appointments:', appointmentsError);
        throw appointmentsError;
      }

      console.log('Active appointments:', appointments?.length || 0);

      // 4. Obtener bloqueos de tiempo
      const { data: timeBlocks, error: timeBlocksError } = await supabase
        .from('time_blocks')
        .select('start_time, end_time, reason')
        .eq('staff_id', staffId)
        .gte('start_time', dayStart.toISOString())
        .lte('end_time', dayEnd.toISOString());

      if (timeBlocksError) {
        console.log('❌ Error fetching time blocks:', timeBlocksError);
        throw timeBlocksError;
      }

      console.log('Time blocks:', timeBlocks?.length || 0);

      // 5. Generar slots disponibles
      const [startHour, startMinute] = workStartTime.split(':').map(Number);
      const [endHour, endMinute] = workEndTime.split(':').map(Number);

      const workStart = new Date(date);
      workStart.setHours(startHour, startMinute, 0, 0);
      
      const workEnd = new Date(date);
      workEnd.setHours(endHour, endMinute, 0, 0);

      const availableSlots: string[] = [];
      const slotInterval = 30; // Intervalos de 30 minutos
      let currentSlot = new Date(workStart);

      console.log('Generating slots from', format(workStart, 'HH:mm'), 'to', format(workEnd, 'HH:mm'));

      while (currentSlot < workEnd) {
        const slotEnd = addMinutes(currentSlot, serviceDuration);
        
        // Verificar que el servicio completo cabe en el horario laboral
        if (slotEnd > workEnd) {
          console.log('⏰ Slot', format(currentSlot, 'HH:mm'), 'would end after work hours');
          break;
        }

        // Verificar conflictos con citas existentes
        const hasAppointmentConflict = appointments?.some(appointment => {
          const appointmentStart = parseISO(appointment.start_time);
          const appointmentEnd = parseISO(appointment.end_time);
          
          // Conflicto si hay superposición de cualquier tipo
          const hasOverlap = (
            // El nuevo slot empieza durante una cita existente
            (currentSlot >= appointmentStart && currentSlot < appointmentEnd) ||
            // El nuevo slot termina durante una cita existente
            (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
            // El nuevo slot engloba completamente una cita existente
            (currentSlot <= appointmentStart && slotEnd >= appointmentEnd) ||
            // Coincidencia exacta de tiempos
            isSameMinute(currentSlot, appointmentStart) ||
            isSameMinute(slotEnd, appointmentEnd)
          );

          if (hasOverlap) {
            console.log('❌ Conflict with appointment:', format(appointmentStart, 'HH:mm'), '-', format(appointmentEnd, 'HH:mm'));
          }

          return hasOverlap;
        });

        // Verificar conflictos con bloqueos de tiempo
        const hasTimeBlockConflict = timeBlocks?.some(block => {
          const blockStart = parseISO(block.start_time);
          const blockEnd = parseISO(block.end_time);
          
          const hasOverlap = (
            (currentSlot >= blockStart && currentSlot < blockEnd) ||
            (slotEnd > blockStart && slotEnd <= blockEnd) ||
            (currentSlot <= blockStart && slotEnd >= blockEnd) ||
            isSameMinute(currentSlot, blockStart) ||
            isSameMinute(slotEnd, blockEnd)
          );

          if (hasOverlap) {
            console.log('❌ Conflict with time block:', format(blockStart, 'HH:mm'), '-', format(blockEnd, 'HH:mm'));
          }

          return hasOverlap;
        });

        // Si no hay conflictos, agregar el slot
        if (!hasAppointmentConflict && !hasTimeBlockConflict) {
          const slotTime = format(currentSlot, 'HH:mm');
          availableSlots.push(slotTime);
          console.log('✅ Available slot:', slotTime, '(duration:', serviceDuration, 'min)');
        }

        // Avanzar al siguiente intervalo
        currentSlot = addMinutes(currentSlot, slotInterval);
      }

      console.log('=== FINAL RESULT ===');
      console.log('Total available slots:', availableSlots.length);
      console.log('Slots:', availableSlots);
      
      return availableSlots;
    },
    enabled: !!(staffId && date && serviceDuration),
    staleTime: 30000, // Cache por 30 segundos para evitar consultas excesivas
  });

  return {
    availableSlots: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
