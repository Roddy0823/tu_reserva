
import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { TimeBlock, Appointment } from '@/types/database';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: 'appointment' | 'time_block';
  status?: string;
  clientName?: string;
  staffName: string;
  reason?: string;
}

interface CalendarViewProps {
  timeBlocks: (TimeBlock & { staff_members: { full_name: string } })[];
  appointments?: (Appointment & { staff_members: { full_name: string }, services: { name: string } })[];
  onCreateTimeBlock: () => void;
  onEditTimeBlock?: (timeBlock: TimeBlock & { staff_members: { full_name: string } }) => void;
  onEditAppointment?: (appointment: Appointment & { staff_members: { full_name: string }, services: { name: string } }) => void;
}

const CalendarView = ({ 
  timeBlocks, 
  appointments = [], 
  onCreateTimeBlock, 
  onEditTimeBlock,
  onEditAppointment 
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];

    // Agregar bloqueos de tiempo
    timeBlocks.forEach(block => {
      events.push({
        id: `block-${block.id}`,
        title: block.reason || 'Tiempo bloqueado',
        startDate: new Date(block.start_time),
        endDate: new Date(block.end_time),
        type: 'time_block',
        staffName: block.staff_members.full_name,
        reason: block.reason
      });
    });

    // Agregar citas
    appointments.forEach(appointment => {
      events.push({
        id: `appointment-${appointment.id}`,
        title: appointment.services.name,
        startDate: new Date(appointment.start_time),
        endDate: new Date(appointment.end_time),
        type: 'appointment',
        status: appointment.status,
        clientName: appointment.client_name,
        staffName: appointment.staff_members.full_name
      });
    });

    return events;
  }, [timeBlocks, appointments]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return calendarEvents.filter(event => 
      isSameDay(event.startDate, day) || 
      (event.startDate <= day && event.endDate >= day)
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'time_block' && onEditTimeBlock) {
      const timeBlock = timeBlocks.find(tb => `block-${tb.id}` === event.id);
      if (timeBlock) {
        onEditTimeBlock(timeBlock);
      }
    } else if (event.type === 'appointment' && onEditAppointment) {
      const appointment = appointments.find(app => `appointment-${app.id}` === event.id);
      if (appointment) {
        onEditAppointment(appointment);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del calendario */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoy
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={onCreateTimeBlock} className="gap-2">
          <Plus className="h-4 w-4" />
          Bloquear Horario
        </Button>
      </div>

      {/* Calendario */}
      <Card>
        <CardContent className="p-0">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 border-b">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div key={day} className="p-3 text-center font-medium text-gray-700 border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Días del calendario */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                    !isCurrentMonth ? 'bg-gray-50' : ''
                  } ${isToday ? 'bg-blue-50' : ''}`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    !isCurrentMonth ? 'text-gray-400' : isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                          event.type === 'appointment'
                            ? event.status === 'confirmado'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'cancelado'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="truncate">
                          {format(event.startDate, 'HH:mm')} - {event.staffName}
                          {event.clientName && ` • ${event.clientName}`}
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 p-1">
                        +{dayEvents.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leyenda */}
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-100 rounded"></div>
          <span>Citas confirmadas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-100 rounded"></div>
          <span>Citas pendientes</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-100 rounded"></div>
          <span>Citas canceladas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <span>Tiempo bloqueado</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
