
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAvailableTimeSlots } from '@/hooks/useAvailableTimeSlots';

interface TimeSelectionProps {
  business: any;
  bookingData: any;
  updateBookingData: (data: any) => void;
}

const TimeSelection = ({ business, bookingData, updateBookingData }: TimeSelectionProps) => {
  const { availableSlots, isLoading } = useAvailableTimeSlots(
    bookingData.staff?.id,
    bookingData.date,
    bookingData.service?.duration_minutes
  );

  const handleTimeSelect = (time: string) => {
    updateBookingData({ time });
  };

  if (!bookingData.date) {
    return <div className="text-center py-4">Primero selecciona una fecha.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 space-y-2">
        <div>
          <p className="text-sm text-gray-600">Servicio seleccionado:</p>
          <Badge variant="outline" className="mt-1">{bookingData.service.name}</Badge>
        </div>
        <div>
          <p className="text-sm text-gray-600">Profesional seleccionado:</p>
          <Badge variant="outline" className="mt-1">{bookingData.staff.full_name}</Badge>
        </div>
        <div>
          <p className="text-sm text-gray-600">Fecha seleccionada:</p>
          <Badge variant="outline" className="mt-1">
            {format(bookingData.date, 'EEEE, d MMMM yyyy', { locale: es })}
          </Badge>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">Selecciona un horario disponible:</p>
      
      {isLoading ? (
        <div className="text-center py-4">Cargando horarios disponibles...</div>
      ) : availableSlots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No hay horarios disponibles para esta fecha.</p>
          <p className="text-sm text-gray-500 mt-2">Por favor, selecciona otra fecha.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {availableSlots.map((slot) => (
            <Button
              key={slot}
              variant={bookingData.time === slot ? "default" : "outline"}
              onClick={() => handleTimeSelect(slot)}
              className="h-12"
            >
              {slot}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSelection;
