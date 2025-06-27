
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
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Selecciona Fecha y Hora</h2>
          <p className="text-gray-600">
            {service.name} con {staffMember.full_name}
          </p>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Date Selection */}
        <div>
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Selecciona una fecha
          </h3>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              className="rounded-lg border border-gray-200"
              locale={es}
            />
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horarios disponibles para {formatDateHeader(selectedDate)}
            </h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600">No hay horarios disponibles para esta fecha.</p>
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona otra fecha o intenta más tarde.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeSelect(time)}
                    className={selectedTime === time ? "bg-gray-900 hover:bg-gray-800" : "border-gray-200 hover:border-gray-900"}
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
          <div className="pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Resumen:</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-medium">Servicio:</span> {service.name}</p>
                <p><span className="font-medium">Personal:</span> {staffMember.full_name}</p>
                <p><span className="font-medium">Fecha:</span> {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                <p><span className="font-medium">Hora:</span> {selectedTime}</p>
                <p><span className="font-medium">Duración:</span> {service.duration_minutes} minutos</p>
              </div>
            </div>
            
            <Button onClick={handleContinue} className="w-full bg-gray-900 hover:bg-gray-800">
              Continuar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDateTimeSelection;
