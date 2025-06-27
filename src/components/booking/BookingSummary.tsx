
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookingData } from '../BookingFlow';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Clock, User, DollarSign, MapPin, CreditCard, Banknote } from 'lucide-react';
import { useBusiness } from '@/hooks/useBusiness';

interface BookingSummaryProps {
  bookingData: BookingData;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const BookingSummary = ({ bookingData, onConfirm, onBack, isLoading }: BookingSummaryProps) => {
  const { business } = useBusiness();
  const { service, staffMember, date, time, clientName, clientEmail, clientPhone } = bookingData;

  if (!service || !staffMember || !date || !time) {
    return null;
  }

  // Determinar métodos de pago aceptados
  const paymentMethods = [];
  if (service.accepts_cash) {
    paymentMethods.push({ type: 'cash', label: 'Efectivo/Presencial', icon: Banknote });
  }
  if (service.accepts_transfer) {
    paymentMethods.push({ type: 'transfer', label: 'Transferencia Bancaria', icon: CreditCard });
  }

  const showBankInfo = service.accepts_transfer && business?.bank_account_details;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">
            Confirmar Reserva
          </CardTitle>
          <CardDescription className="text-green-100 text-center">
            Revisa los detalles de tu cita antes de confirmar
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Información del Servicio */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Detalles del Servicio
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">Servicio:</span>
                  <span className="text-blue-900 font-semibold">{service.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">Profesional:</span>
                  <span className="text-blue-900">{staffMember.full_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">Duración:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.duration_minutes} min
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">Precio:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ${service.price?.toLocaleString()} COP
                  </Badge>
                </div>
              </div>
            </div>

            {/* Información de Fecha y Hora */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                Fecha y Hora
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-800 font-medium">Fecha:</span>
                  <span className="text-purple-900 font-semibold">
                    {format(date, 'EEEE, d MMMM yyyy', { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-800 font-medium">Hora:</span>
                  <span className="text-purple-900 font-semibold">{time}</span>
                </div>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información de Contacto
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Nombre:</span>
                  <span className="text-gray-900">{clientName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Email:</span>
                  <span className="text-gray-900">{clientEmail}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Teléfono:</span>
                  <span className="text-gray-900">{clientPhone}</span>
                </div>
              </div>
            </div>

            {/* Métodos de Pago Aceptados */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Métodos de Pago Aceptados
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <IconComponent className="h-4 w-4 text-yellow-700" />
                      <span className="text-yellow-800 font-medium">{method.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Información Bancaria - Solo si acepta transferencias */}
            {showBankInfo && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Información para Transferencia Bancaria
                </h3>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-800 mb-2 font-medium">
                    Datos bancarios para realizar el pago:
                  </p>
                  <div className="text-sm text-red-900 whitespace-pre-line font-mono">
                    {business.bank_account_details}
                  </div>
                </div>
                <p className="text-xs text-red-700 mt-3">
                  * Si seleccionaste transferencia bancaria, deberás realizar el pago y subir el comprobante después de confirmar la reserva.
                </p>
              </div>
            )}

            {/* Mensaje de Confirmación del Servicio */}
            {service.confirmation_message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  Mensaje del Negocio
                </h3>
                <p className="text-green-800">{service.confirmation_message}</p>
              </div>
            )}

            <Separator />

            {/* Botones de Acción */}
            <div className="flex justify-between space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="px-8"
              >
                Volver
              </Button>
              <Button 
                onClick={onConfirm}
                disabled={isLoading}
                className="px-8 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {isLoading ? 'Confirmando...' : 'Confirmar Reserva'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSummary;
