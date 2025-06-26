
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
import { CalendarDays, Clock, User, Plus } from 'lucide-react';
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
      title: `Bloqueado: ${block.reason || 'Sin motivo'}`,
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
    // Si hay un staff específico seleccionado, usar ese ID
    const staffId = selectedStaff !== 'all' ? selectedStaff : undefined;
    setSelectedSlot({ start, end, staffId });
    setShowAppointmentForm(true);
  };

  // Manejar clic en evento existente
  const handleSelectEvent = (event: CalendarEvent) => {
    if (event.resource.type === 'appointment') {
      // Aquí podrías abrir un modal para editar la cita
      console.log('Editar cita:', event.resource.data);
    } else if (event.resource.type === 'timeblock') {
      // Aquí podrías abrir un modal para editar el bloqueo
      console.log('Editar bloqueo:', event.resource.data);
    }
  };

  // Personalizar estilos de eventos
  const eventStyleGetter = (event: CalendarEvent) => {
    if (event.resource.type === 'appointment') {
      const status = event.resource.status;
      let backgroundColor = '#3174ad';
      
      switch (status) {
        case 'pendiente':
          backgroundColor = '#f59e0b';
          break;
        case 'confirmado':
          backgroundColor = '#10b981';
          break;
        case 'cancelado':
          backgroundColor = '#ef4444';
          break;
        default:
          backgroundColor = '#6b7280';
      }

      return {
        style: {
          backgroundColor,
          borderRadius: '4px',
          opacity: 0.8,
          color: 'white',
          border: '0px',
          display: 'block'
        }
      };
    } else {
      // Time blocks
      return {
        style: {
          backgroundColor: '#64748b',
          borderRadius: '4px',
          opacity: 0.6,
          color: 'white',
          border: '2px dashed #475569',
          display: 'block'
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Calendario de Disponibilidad
            </CardTitle>
            <div className="flex gap-4 items-center">
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por personal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo el personal</SelectItem>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                onClick={() => {
                  setSelectedSlot({ start: new Date(), end: new Date(Date.now() + 60 * 60 * 1000) });
                  setShowTimeBlockForm(true);
                }}
                variant="outline"
                size="sm"
              >
                <Clock className="h-4 w-4 mr-2" />
                Bloquear Horario
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Badge style={{ backgroundColor: '#f59e0b' }}>Pendiente</Badge>
                <Badge style={{ backgroundColor: '#10b981' }}>Confirmado</Badge>
                <Badge style={{ backgroundColor: '#ef4444' }}>Cancelado</Badge>
                <Badge style={{ backgroundColor: '#64748b', opacity: 0.6 }}>Bloqueado</Badge>
              </div>
            </div>
          </div>

          <div style={{ height: '600px' }}>
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
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityCalendar;
