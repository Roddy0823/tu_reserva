
import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, isToday, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { TimeBlock, Appointment, StaffMember, Service } from '@/types/database';

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
  price?: number;
}

interface CalendarViewProps {
  timeBlocks: (TimeBlock & { staff_members: { full_name: string } })[];
  appointments?: (Appointment & { staff_members: { full_name: string }, services: { name: string } })[];
  staffMembers: StaffMember[];
  services: Service[];
  onCreateTimeBlock: () => void;
  onEditTimeBlock?: (timeBlock: TimeBlock & { staff_members: { full_name: string } }) => void;
  onEditAppointment?: (appointment: Appointment & { staff_members: { full_name: string }, services: { name: string } }) => void;
}

const CalendarView = ({ 
  timeBlocks, 
  appointments = [], 
  staffMembers,
  services,
  onCreateTimeBlock, 
  onEditTimeBlock,
  onEditAppointment 
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
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
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCreateTimeBlock} className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Bloquear Horario
          </Button>
        </div>
      </div>

      {/* Calendario */}
      <Card>
        <CardContent className="p-0">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 border-b bg-gray-50">
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
              const isDayToday = isToday(day);
              const isPastDay = day < new Date() && !isDayToday;
              const isWeekend = getDay(day) === 0 || getDay(day) === 6;

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[120px] p-2 border-r border-b last:border-r-0 cursor-pointer transition-colors hover:bg-gray-50 ${
                    !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                  } ${isDayToday ? 'bg-blue-50 border-blue-200' : ''} ${
                    isPastDay ? 'opacity-60' : ''
                  } ${isWeekend && isCurrentMonth ? 'bg-gray-25' : ''}`}
                >
                  <div className={`text-sm font-medium mb-2 flex items-center justify-between ${
                    !isCurrentMonth ? 'text-gray-400' : isDayToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    <span>{format(day, 'd')}</span>
                    {isDayToday && (
                      <Badge variant="secondary" className="text-xs">Hoy</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                        className={`text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                          event.type === 'appointment'
                            ? event.status === 'confirmado'
                              ? 'bg-green-100 text-green-800 border-l-2 border-green-400'
                              : event.status === 'cancelado'
                              ? 'bg-red-100 text-red-800 border-l-2 border-red-400'
                              : 'bg-yellow-100 text-yellow-800 border-l-2 border-yellow-400'
                            : 'bg-gray-100 text-gray-800 border-l-2 border-gray-400'
                        }`}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="truncate flex items-center justify-between">
                          <span>{format(event.startDate, 'HH:mm')}</span>
                          <span className="text-xs opacity-75">{event.staffName}</span>
                        </div>
                        {event.clientName && (
                          <div className="truncate opacity-75">• {event.clientName}</div>
                        )}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 p-1 text-center bg-gray-50 rounded">
                        +{dayEvents.length - 3} más
                      </div>
                    )}
                    {dayEvents.length === 0 && isCurrentMonth && !isPastDay && (
                      <div className="text-xs text-gray-400 p-1 text-center opacity-0 hover:opacity-100 transition-opacity">
                        Disponible
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmado').length}
            </div>
            <div className="text-sm text-gray-600">Citas confirmadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pendiente').length}
            </div>
            <div className="text-sm text-gray-600">Citas pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {appointments.filter(a => a.status === 'cancelado').length}
            </div>
            <div className="text-sm text-gray-600">Citas canceladas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {timeBlocks.length}
            </div>
            <div className="text-sm text-gray-600">Horarios bloqueados</div>
          </CardContent>
        </Card>
      </div>

      {/* Leyenda mejorada */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Leyenda</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border-l-2 border-green-400 rounded"></div>
              <span>Citas confirmadas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border-l-2 border-yellow-400 rounded"></div>
              <span>Citas pendientes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border-l-2 border-red-400 rounded"></div>
              <span>Citas canceladas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border-l-2 border-gray-400 rounded"></div>
              <span>Tiempo bloqueado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
