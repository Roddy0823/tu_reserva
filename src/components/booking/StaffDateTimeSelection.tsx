
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Service, StaffMember } from '@/types/database';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
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

  const { availableSlots, isLoading } = useAvailableTimeSlots(
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Selecciona Fecha y Hora</CardTitle>
            <p className="text-gray-600">
              {service.name} con {staffMember.full_name}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Selecciona una fecha
          </h3>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              className="rounded-md border"
              locale={es}
            />
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horarios disponibles para {formatDateHeader(selectedDate)}
            </h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay horarios disponibles para esta fecha.</p>
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona otra fecha o intenta más tarde.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeSelect(time)}
                    className="text-sm"
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
          <div className="pt-4 border-t">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Resumen:</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Servicio:</strong> {service.name}</p>
                <p><strong>Personal:</strong> {staffMember.full_name}</p>
                <p><strong>Fecha:</strong> {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                <p><strong>Hora:</strong> {selectedTime}</p>
                <p><strong>Duración:</strong> {service.duration_minutes} minutos</p>
              </div>
            </div>
            
            <Button onClick={handleContinue} className="w-full">
              Continuar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffDateTimeSelection;
