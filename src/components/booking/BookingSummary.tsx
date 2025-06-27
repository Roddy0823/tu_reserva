
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookingData } from '../BookingFlow';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Clock, User, DollarSign, MapPin, CreditCard, Banknote, ArrowLeft, CheckCircle, Phone, Mail } from 'lucide-react';
import { useBusiness } from '@/hooks/useBusiness';
import PaymentProofUpload from '../PaymentProofUpload';

interface BookingSummaryProps {
  bookingData: BookingData;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
  createdAppointment?: any;
}

const BookingSummary = ({ bookingData, onConfirm, onBack, isLoading, createdAppointment }: BookingSummaryProps) => {
  const { business } = useBusiness();
  const { service, staffMember, date, time, clientName, clientEmail, clientPhone } = bookingData;
  const [showPaymentUpload, setShowPaymentUpload] = useState(false);

  if (!service || !staffMember || !date || !time) {
    return null;
  }

  // Si ya se creó la cita, mostrar confirmación final
  if (createdAppointment) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="text-center pb-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              ¡Reserva Confirmada!
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Tu cita ha sido registrada exitosamente
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Información del Negocio */}
              {business && (
                <div className="text-center bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{business.name}</h3>
                  {business.description && (
                    <p className="text-slate-600 mb-4">{business.description}</p>
                  )}
                  <div className="flex justify-center space-x-6 text-sm text-slate-600">
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
              )}

              {/* Detalles de la Cita */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-slate-500" />
                  Detalles de tu Cita
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Servicio:</span>
                      <span className="font-medium text-slate-900">{service.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Profesional:</span>
                      <span className="font-medium text-slate-900">{staffMember.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Fecha:</span>
                      <span className="font-medium text-slate-900">
                        {format(date, 'EEEE, d MMMM yyyy', { locale: es })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Hora:</span>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                        <Clock className="h-3 w-3 mr-1" />
                        {time}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Duración:</span>
                      <span className="font-medium text-slate-900">{service.duration_minutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Precio:</span>
                      <Badge variant="secondary" className="bg-slate-900 text-white">
                        <DollarSign className="h-3 w-3 mr-1" />
                        ${service.price?.toLocaleString()} COP
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-slate-500" />
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Nombre:</span>
                      <span className="font-medium text-slate-900">{clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Email:</span>
                      <span className="font-medium text-slate-900">{clientEmail}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Teléfono:</span>
                      <span className="font-medium text-slate-900">{clientPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Estado:</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pendiente
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Métodos de Pago */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-slate-500" />
                  Opciones de Pago
                </h3>
                <div className="space-y-3">
                  {service.accepts_cash && (
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200">
                      <Banknote className="h-4 w-4 text-slate-600" />
                      <span className="text-slate-800">Pagar en efectivo el día de la cita</span>
                    </div>
                  )}
                  {service.accepts_transfer && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200">
                        <CreditCard className="h-4 w-4 text-slate-600" />
                        <span className="text-slate-800">Transferencia bancaria</span>
                      </div>
                      {!showPaymentUpload && (
                        <Button 
                          onClick={() => setShowPaymentUpload(true)}
                          variant="outline"
                          className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          Subir Comprobante de Transferencia
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Información Bancaria */}
              {service.accepts_transfer && business?.bank_account_details && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">
                    Información Bancaria
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-sm text-slate-700 whitespace-pre-line font-mono">
                      {business.bank_account_details}
                    </div>
                  </div>
                </div>
              )}

              {/* Componente de subida de comprobante */}
              {showPaymentUpload && service.accepts_transfer && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <PaymentProofUpload
                    appointmentId={createdAppointment.id}
                    bankAccountDetails={business?.bank_account_details}
                    serviceName={service.name}
                    servicePrice={service.price || 0}
                  />
                </div>
              )}

              {/* Mensaje de Confirmación del Servicio */}
              {service.confirmation_message && (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">
                    Mensaje del Negocio
                  </h4>
                  <p className="text-slate-700">{service.confirmation_message}</p>
                </div>
              )}

              {/* Información Importante */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Información Importante
                </h3>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li>• Recibirás un email de confirmación en breve</li>
                  <li>• Por favor, llega 5 minutos antes de tu cita</li>
                  <li>• Si necesitas cancelar o reprogramar, contacta al negocio con anticipación</li>
                  {business?.address && (
                    <li className="flex items-start">
                      <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0 text-slate-500" />
                      <span>Dirección: {business.address}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Botón de Finalizar */}
              <div className="text-center pt-4">
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Finalizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determinar métodos de pago aceptados
  const paymentMethods = [];
  if (service.accepts_cash) {
    paymentMethods.push({ type: 'cash', label: 'Efectivo', icon: Banknote });
  }
  if (service.accepts_transfer) {
    paymentMethods.push({ type: 'transfer', label: 'Transferencia', icon: CreditCard });
  }

  const showBankInfo = service.accepts_transfer && business?.bank_account_details;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="text-center py-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Confirmar Reserva
          </CardTitle>
          <CardDescription className="text-slate-600 text-base mt-2">
            Revisa los detalles de tu cita antes de confirmar
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Resumen Principal */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-slate-600 mb-4">con {staffMember.full_name}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-700">
                      <CalendarDays className="h-4 w-4 text-slate-500" />
                      <span>{format(date, 'EEEE, d MMMM yyyy', { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span>{time} • {service.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <User className="h-4 w-4 text-slate-500" />
                      <span>{clientName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">
                    ${service.price?.toLocaleString()}
                  </div>
                  <div className="text-slate-500 text-sm">COP</div>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-900 uppercase tracking-wider">
                Información de Contacto
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Email:</span>
                  <span className="text-slate-900">{clientEmail}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Teléfono:</span>
                  <span className="text-slate-900">{clientPhone}</span>
                </div>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-900 uppercase tracking-wider">
                Métodos de Pago Aceptados
              </h4>
              <div className="flex gap-3">
                {paymentMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-3 flex-1">
                      <IconComponent className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-700">{method.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Información Bancaria - Solo si acepta transferencias */}
            {showBankInfo && (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="text-sm font-medium text-slate-900 mb-3 uppercase tracking-wider">
                  Información Bancaria
                </h4>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="text-sm text-slate-700 whitespace-pre-line font-mono">
                    {business.bank_account_details}
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-3">
                  Podrás subir el comprobante de pago después de confirmar la reserva.
                </p>
              </div>
            )}

            {/* Mensaje de Confirmación del Servicio */}
            {service.confirmation_message && (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="text-sm font-medium text-slate-900 mb-2 uppercase tracking-wider">
                  Mensaje del Negocio
                </h4>
                <p className="text-slate-700 text-sm">{service.confirmation_message}</p>
              </div>
            )}

            <Separator className="bg-slate-200" />

            {/* Botones de Acción */}
            <div className="flex justify-between gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="px-8 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <Button 
                onClick={onConfirm}
                disabled={isLoading}
                className="px-8 bg-slate-900 hover:bg-slate-800 text-white"
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
