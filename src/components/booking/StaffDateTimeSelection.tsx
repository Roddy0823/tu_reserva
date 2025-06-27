
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Service, StaffMember } from '@/types/database';
import { ArrowLeft, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { useAvailableTimeSlots } from '@/hooks/useAvailableTimeSlots';
import { format, isToday, isTomorrow, addDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface StaffDateTimeSelectionProps {
  service: Service;
  staffMember: StaffMember;
  onDateTimeSelect: (date: Date, time: string) => void;
  onBack: () => void;
}

const StaffDateTimeSelection = ({ service, staffMember, onDateTimeSelect, onBack }: StaffDateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const { availableSlots, isLoading, error } = useAvailableTimeSlots(
    staffMember.id,
    selectedDate,
    service.duration_minutes
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time selection when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onDateTimeSelect(selectedDate, selectedTime);
    }
  };

  const formatDateHeader = (date: Date) => {
    if (isToday(date)) {
      return 'Hoy';
    }
    if (isTomorrow(date)) {
      return 'Mañana';
    }
    return format(date, "EEEE, dd 'de' MMMM", { locale: es });
  };

  // Disable past dates and dates too far in the future
  const disabledDays = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 30); // Allow booking up to 30 days in advance
    return date < today || date > maxDate;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <CardTitle className="text-xl text-slate-900">Selecciona Fecha y Hora</CardTitle>
            <p className="text-slate-600">
              {service.name} con {staffMember.full_name}
            </p>
          </div>
        </div>
        
        {/* Service summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-4">
          <div className="flex items-center gap-2 text-slate-800">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{service.name}</span>
            <span className="text-slate-600">• {service.duration_minutes} min</span>
            <span className="text-slate-600">• ${service.price?.toLocaleString()} COP</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-900">
            <CalendarIcon className="h-4 w-4" />
            Selecciona una fecha
          </h3>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              className="rounded-md border border-slate-200"
              locale={es}
            />
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-900">
              <Clock className="h-4 w-4" />
              Horarios disponibles para {formatDateHeader(selectedDate)}
            </h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-red-800 text-sm">
                    Error al cargar horarios disponibles. Inténtalo de nuevo.
                  </p>
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-4 border-slate-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-slate-600">Verificando disponibilidad...</span>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-amber-800 font-medium mb-1">No hay horarios disponibles</p>
                  <p className="text-amber-700 text-sm">
                    Esta fecha no tiene espacios libres. Esto puede deberse a:
                  </p>
                  <ul className="text-amber-700 text-sm text-left mt-2 space-y-1">
                    <li>• Citas ya programadas</li>
                    <li>• Bloqueos de horario del personal</li>
                    <li>• Horarios fuera del rango laboral</li>
                  </ul>
                  <p className="text-amber-600 text-sm mt-3 font-medium">
                    Selecciona otra fecha para ver más opciones.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeSelect(time)}
                    className="text-sm h-10"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Summary and Continue */}
        {selectedDate && selectedTime && (
          <div className="pt-4 border-t border-slate-200">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-900 mb-2">Resumen de tu cita:</h4>
              <div className="space-y-1 text-sm text-green-800">
                <p><strong>Servicio:</strong> {service.name}</p>
                <p><strong>Personal:</strong> {staffMember.full_name}</p>
                <p><strong>Fecha:</strong> {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                <p><strong>Hora:</strong> {selectedTime}</p>
                <p><strong>Duración:</strong> {service.duration_minutes} minutos</p>
                <p><strong>Precio:</strong> ${service.price?.toLocaleString()} COP</p>
              </div>
            </div>
            
            <Button onClick={handleContinue} className="w-full bg-slate-900 hover:bg-slate-800">
              Continuar con mis datos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffDateTimeSelection;
