
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateSelectionProps {
  business: any;
  bookingData: any;
  updateBookingData: (data: any) => void;
}

const DateSelection = ({ business, bookingData, updateBookingData }: DateSelectionProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateBookingData({ date, time: undefined });
    }
  };

  if (!bookingData.staff) {
    return <div className="text-center py-4">Primero selecciona un profesional.</div>;
  }

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // Permitir reservas hasta 3 meses adelante

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
      </div>
      
      <p className="text-gray-600 mb-4">Selecciona una fecha disponible:</p>
      
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={bookingData.date}
          onSelect={handleDateSelect}
          disabled={(date) => date < today || date > maxDate}
          initialFocus
          locale={es}
          className="rounded-md border"
        />
      </div>

      {bookingData.date && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Fecha seleccionada:</p>
          <Badge variant="secondary" className="mt-1">
            {format(bookingData.date, 'EEEE, d MMMM yyyy', { locale: es })}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default DateSelection;
