
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Business, Appointment, Service, StaffMember } from '@/types/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, CalendarDays, Clock, User, DollarSign, MapPin, Phone, Mail, CreditCard, Banknote } from 'lucide-react';

interface BookingSuccessProps {
  business: Business;
  appointment: Appointment;
  service: Service;
  staffMember: StaffMember;
}

const BookingSuccess = ({ business, appointment, service, staffMember }: BookingSuccessProps) => {
  const appointmentDate = new Date(appointment.start_time);
  const appointmentTime = format(appointmentDate, 'HH:mm');

  // Determinar métodos de pago aceptados
  const paymentMethods = [];
  if (service.accepts_cash) {
    paymentMethods.push({ type: 'cash', label: 'Efectivo/Presencial', icon: Banknote });
  }
  if (service.accepts_transfer) {
    paymentMethods.push({ type: 'transfer', label: 'Transferencia Bancaria', icon: CreditCard });
  }

  const showBankInfo = service.accepts_transfer && business.bank_account_details;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-200" />
          </div>
          <CardTitle className="text-3xl font-bold">
            ¡Reserva Confirmada!
          </CardTitle>
          <CardDescription className="text-green-100 text-lg">
            Tu cita ha sido registrada exitosamente
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Información del Negocio */}
            <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-2">{business.name}</h3>
              {business.description && (
                <p className="text-blue-700 mb-4">{business.description}</p>
              )}
              <div className="flex justify-center space-x-6 text-sm text-blue-600">
                {business.contact_phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {business.contact_phone}
                  </div>
                )}
                {business.contact_email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {business.contact_email}
                  </div>
                )}
              </div>
            </div>

            {/* Detalles de la Cita */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                Detalles de tu Cita
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Servicio:</span>
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profesional:</span>
                    <span className="font-medium text-gray-900">{staffMember.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium text-gray-900">
                      {format(appointmentDate, 'EEEE, d MMMM yyyy', { locale: es })}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hora:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Clock className="h-3 w-3 mr-1" />
                      {appointmentTime}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-medium text-gray-900">{service.duration_minutes} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <DollarSign className="h-3 w-3 mr-1" />
                      ${service.price?.toLocaleString()} COP
                    </Badge>
                  </div>
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
                    Realiza tu pago a la siguiente cuenta:
                  </p>
                  <div className="text-sm text-red-900 whitespace-pre-line font-mono">
                    {business.bank_account_details}
                  </div>
                </div>
                <p className="text-xs text-red-700 mt-3">
                  * Por favor, conserva tu comprobante de pago para presentarlo al momento de tu cita.
                </p>
              </div>
            )}

            {/* Información del Cliente */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información de Contacto
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-700">Nombre:</span>
                  <span className="font-medium text-purple-900">{appointment.client_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Email:</span>
                  <span className="font-medium text-purple-900">{appointment.client_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Teléfono:</span>
                  <span className="font-medium text-purple-900">{appointment.client_phone}</span>
                </div>
              </div>
            </div>

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

            {/* Información Importante */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Información Importante
              </h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Recibirás un email de confirmación en breve</li>
                <li>• Por favor, llega 5 minutos antes de tu cita</li>
                <li>• Si necesitas cancelar o reprogramar, contacta al negocio con anticipación</li>
                {business.address && (
                  <li className="flex items-start">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Dirección: {business.address}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Botón de Finalizar */}
            <div className="text-center pt-4">
              <Button 
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                Finalizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSuccess;
