
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';
import { CheckCircle, Clock } from 'lucide-react';

interface BookingSummaryProps {
  business: any;
  bookingData: any;
  updateBookingData: (data: any) => void;
}

const BookingSummary = ({ business, bookingData, updateBookingData }: BookingSummaryProps) => {
  const { createAppointment, isCreating } = useCreateAppointment();

  const handleConfirmBooking = async () => {
    if (!bookingData.service || !bookingData.staff || !bookingData.date || !bookingData.time) {
      return;
    }

    // Crear el objeto Date para la cita
    const [hours, minutes] = bookingData.time.split(':').map(Number);
    const startTime = new Date(bookingData.date);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = addMinutes(startTime, bookingData.service.duration_minutes);

    const appointmentData = {
      business_id: business.id,
      service_id: bookingData.service.id,
      staff_id: bookingData.staff.id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      client_name: bookingData.clientName,
      client_email: bookingData.clientEmail,
      client_phone: bookingData.clientPhone || null,
      status: 'pendiente' as const,
    };

    createAppointment(appointmentData, {
      onSuccess: (appointment) => {
        updateBookingData({ appointment });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Confirma tu reserva</h3>
        <p className="text-gray-600 mb-4">
          Por favor, revisa los detalles de tu cita antes de confirmar:
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Cita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Servicio:</span>
            <Badge variant="outline">{bookingData.service.name}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Profesional:</span>
            <Badge variant="outline">{bookingData.staff.full_name}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Fecha:</span>
            <Badge variant="outline">
              {format(bookingData.date, 'EEEE, d MMMM yyyy', { locale: es })}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Horario:</span>
            <Badge variant="outline">{bookingData.time}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Duración:</span>
            <Badge variant="outline">{bookingData.service.duration_minutes} minutos</Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Precio:</span>
            <Badge variant="secondary">${bookingData.service.price}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Nombre:</span>
            <span>{bookingData.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{bookingData.clientEmail}</span>
          </div>
          {bookingData.clientPhone && (
            <div className="flex justify-between">
              <span className="font-medium">Teléfono:</span>
              <span>{bookingData.clientPhone}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Tu cita quedará en estado <strong>pendiente</strong> hasta que el negocio confirme tu reserva. 
          Recibirás una notificación por email cuando sea confirmada.
        </AlertDescription>
      </Alert>

      <Button
        onClick={handleConfirmBooking}
        disabled={isCreating}
        className="w-full"
        size="lg"
      >
        {isCreating ? 'Confirmando...' : 'Confirmar Reserva'}
      </Button>
    </div>
  );
};

export default BookingSummary;
