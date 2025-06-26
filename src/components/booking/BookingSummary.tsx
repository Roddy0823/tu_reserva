
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingData } from '@/components/BookingFlow';
import { ArrowLeft, Calendar, Clock, User, Mail, Phone, MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BookingSummaryProps {
  bookingData: BookingData;
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const BookingSummary = ({ bookingData, onConfirm, onBack, isLoading }: BookingSummaryProps) => {
  const { service, staffMember, date, time, clientName, clientEmail, clientPhone } = bookingData;

  if (!service || !staffMember || !date || !time) {
    return null;
  }

  const appointmentDateTime = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  appointmentDateTime.setHours(hours, minutes);

  const endTime = new Date(appointmentDateTime);
  endTime.setMinutes(endTime.getMinutes() + service.duration_minutes);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Confirma tu Reserva</CardTitle>
            <p className="text-gray-600">Revisa todos los detalles antes de confirmar</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Details */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Detalles del Servicio
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-800">Servicio:</span>
              <span className="font-medium text-blue-900">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Duración:</span>
              <span className="font-medium text-blue-900">{service.duration_minutes} minutos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">Precio:</span>
              <span className="font-medium text-blue-900">${service.price?.toLocaleString()} COP</span>
            </div>
            {service.description && (
              <div className="pt-2 border-t border-blue-200">
                <span className="text-blue-800">Descripción:</span>
                <p className="text-blue-900 mt-1">{service.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Fecha y Hora
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-800">Personal:</span>
              <span className="font-medium text-green-900">{staffMember.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-800">Fecha:</span>
              <span className="font-medium text-green-900">
                {format(appointmentDateTime, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-800">Hora de inicio:</span>
              <span className="font-medium text-green-900">{time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-800">Hora de finalización:</span>
              <span className="font-medium text-green-900">
                {format(endTime, 'HH:mm')}
              </span>
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Tus Datos
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-gray-600" />
              <span className="text-gray-600">Nombre:</span>
              <span className="font-medium text-gray-900">{clientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-gray-600" />
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{clientEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-gray-600" />
              <span className="text-gray-600">Teléfono:</span>
              <span className="font-medium text-gray-900">{clientPhone}</span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-yellow-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total a pagar:
            </span>
            <span className="text-2xl font-bold text-yellow-900">
              ${service.price?.toLocaleString()} COP
            </span>
          </div>
          <p className="text-sm text-yellow-800 mt-2">
            El pago se realizará por adelantado para confirmar tu cita
          </p>
        </div>

        {/* Important Information */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-2">Información Importante:</h4>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Tu cita quedará en estado "pendiente" hasta confirmar el pago</li>
            <li>• Recibirás un correo con los datos bancarios para realizar el pago</li>
            <li>• Podrás subir el comprobante de pago inmediatamente después de confirmar</li>
            <li>• Una vez validado el pago, tu cita será confirmada automáticamente</li>
          </ul>
        </div>

        {/* Confirm Button */}
        <Button 
          onClick={onConfirm} 
          disabled={isLoading}
          className="w-full text-lg py-3"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Confirmando reserva...
            </>
          ) : (
            'Confirmar Reserva'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
