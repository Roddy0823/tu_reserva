
import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStaff } from '@/hooks/useStaff';
import { useAppointments } from '@/hooks/useAppointments';
import { useTimeBlocks } from '@/hooks/useTimeBlocks';
import { CalendarDays, Clock, User, Plus, Filter, Eye } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import TimeBlockQuickForm from './TimeBlockQuickForm';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    type: 'appointment' | 'timeblock';
    status?: string;
    data: any;
  };
}

const AvailabilityCalendar = () => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showTimeBlockForm, setShowTimeBlockForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date; staffId?: string } | null>(null);

  const { staffMembers } = useStaff();
  const { getAllAppointments } = useAppointments();
  const { getAllTimeBlocks } = useTimeBlocks();
  
  const { data: appointments = [] } = getAllAppointments();
  const { data: timeBlocks = [] } = getAllTimeBlocks();

  // Filtrar por personal seleccionado
  const filteredAppointments = useMemo(() => {
    if (selectedStaff === 'all') return appointments;
    return appointments.filter(app => app.staff_id === selectedStaff);
  }, [appointments, selectedStaff]);

  const filteredTimeBlocks = useMemo(() => {
    if (selectedStaff === 'all') return timeBlocks;
    return timeBlocks.filter(block => block.staff_id === selectedStaff);
  }, [timeBlocks, selectedStaff]);

  // Convertir datos a eventos del calendario
  const events: CalendarEvent[] = useMemo(() => {
    const appointmentEvents: CalendarEvent[] = filteredAppointments.map(appointment => ({
      id: `appointment-${appointment.id}`,
      title: `${appointment.client_name} - ${appointment.services?.name || 'Servicio'}`,
      start: new Date(appointment.start_time),
      end: new Date(appointment.end_time),
      resource: {
        type: 'appointment',
        status: appointment.status,
        data: appointment
      }
    }));

    const timeBlockEvents: CalendarEvent[] = filteredTimeBlocks.map(block => ({
      id: `timeblock-${block.id}`,
      title: `🚫 ${block.reason || 'Horario bloqueado'}`,
      start: new Date(block.start_time),
      end: new Date(block.end_time),
      resource: {
        type: 'timeblock',
        data: block
      }
    }));

    return [...appointmentEvents, ...timeBlockEvents];
  }, [filteredAppointments, filteredTimeBlocks]);

  // Manejar selección de slot vacío
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const staffId = selectedStaff !== 'all' ? selectedStaff : undefined;
    setSelectedSlot({ start, end, staffId });
    setShowAppointmentForm(true);
  };

  // Manejar clic en evento existente
  const handleSelectEvent = (event: CalendarEvent) => {
    if (event.resource.type === 'appointment') {
      console.log('Editar cita:', event.resource.data);
    } else if (event.resource.type === 'timeblock') {
      console.log('Editar bloqueo:', event.resource.data);
    }
  };

  // Personalizar estilos de eventos con colores más profesionales
  const eventStyleGetter = (event: CalendarEvent) => {
    if (event.resource.type === 'appointment') {
      const status = event.resource.status;
      let backgroundColor = '#3b82f6';
      let borderColor = '#2563eb';
      
      switch (status) {
        case 'pendiente':
          backgroundColor = '#f59e0b';
          borderColor = '#d97706';
          break;
        case 'confirmado':
          backgroundColor = '#10b981';
          borderColor = '#059669';
          break;
        case 'cancelado':
          backgroundColor = '#ef4444';
          borderColor = '#dc2626';
          break;
        default:
          backgroundColor = '#6366f1';
          borderColor = '#4f46e5';
      }

      return {
        style: {
          backgroundColor,
          borderLeft: `4px solid ${borderColor}`,
          borderRadius: '6px',
          opacity: 0.9,
          color: 'white',
          border: 'none',
          display: 'block',
          fontSize: '12px',
          fontWeight: '500',
          padding: '4px 8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
        }
      };
    } else {
      return {
        style: {
          backgroundColor: '#64748b',
          borderLeft: '4px solid #475569',
          borderRadius: '6px',
          opacity: 0.8,
          color: 'white',
          border: 'none',
          display: 'block',
          fontSize: '11px',
          fontWeight: '500',
          padding: '4px 8px',
          fontStyle: 'italic',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
        }
      };
    }
  };

  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
  };

  if (showAppointmentForm) {
    return (
      <AppointmentForm
        selectedSlot={selectedSlot}
        onCancel={() => {
          setShowAppointmentForm(false);
          setSelectedSlot(null);
        }}
      />
    );
  }

  if (showTimeBlockForm) {
    return (
      <TimeBlockQuickForm
        selectedSlot={selectedSlot}
        onCancel={() => {
          setShowTimeBlockForm(false);
          setSelectedSlot(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              Calendario de Disponibilidad
            </h2>
            <p className="text-gray-600 mt-2">Gestiona las citas y disponibilidad de tu equipo de trabajo</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="w-48 bg-white">
                  <SelectValue placeholder="Filtrar por personal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Todo el personal
                    </div>
                  </SelectItem>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {staff.full_name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={() => {
                setSelectedSlot({ start: new Date(), end: new Date(Date.now() + 60 * 60 * 1000) });
                setShowTimeBlockForm(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
              size="sm"
            >
              <Clock className="h-4 w-4 mr-2" />
              Bloquear Horario
            </Button>
          </div>
        </div>
      </div>

      {/* Leyenda mejorada */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700 mr-2">Estados:</span>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                Pendiente
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                Confirmado
              </Badge>
              <Badge className="bg-red-100 text-red-800 border border-red-200 shadow-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Cancelado
              </Badge>
              <Badge className="bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
                <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                Bloqueado
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendario principal mejorado */}
      <Card className="shadow-lg border-gray-200">
        <CardContent className="p-6">
          <div className="calendar-container" style={{ height: '700px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              eventPropGetter={eventStyleGetter}
              messages={messages}
              step={30}
              timeslots={2}
              min={new Date(2024, 0, 1, 7, 0)}
              max={new Date(2024, 0, 1, 22, 0)}
              formats={{
                timeGutterFormat: 'HH:mm',
                eventTimeRangeFormat: ({ start, end }) => 
                  `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
              }}
              dayPropGetter={(date) => ({
                style: {
                  backgroundColor: moment(date).isSame(moment(), 'day') ? '#fef3c7' : undefined,
                }
              })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityCalendar;
