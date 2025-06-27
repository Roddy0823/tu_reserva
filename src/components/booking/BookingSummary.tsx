
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookingData } from '../BookingFlow';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Clock, User, DollarSign, MapPin, CreditCard, Banknote, ArrowLeft, CheckCircle } from 'lucide-react';
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

  // Si ya se creó la cita y acepta transferencias, mostrar opción de subir comprobante
  if (createdAppointment && service.accepts_transfer) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="text-center py-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              ¡Reserva Confirmada!
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Tu cita ha sido creada exitosamente
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Información de la Cita */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Detalles de tu Cita
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Servicio:</span>
                    <span className="text-slate-900 font-medium">{service.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Profesional:</span>
                    <span className="text-slate-900 font-medium">{staffMember.full_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Fecha:</span>
                    <span className="text-slate-900 font-medium">
                      {format(date, 'EEEE, d MMMM yyyy', { locale: es })} a las {time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Precio:</span>
                    <Badge variant="secondary" className="bg-slate-900 text-white px-3 py-1">
                      ${service.price?.toLocaleString()} COP
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Opciones de Pago */}
              {service.accepts_transfer && (
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">
                    Completa tu Reserva
                  </h3>
                  <p className="text-amber-800 mb-4">
                    Para confirmar tu cita, puedes:
                  </p>
                  <div className="space-y-3">
                    {service.accepts_cash && (
                      <div className="flex items-center space-x-3">
                        <Banknote className="h-4 w-4 text-amber-700" />
                        <span className="text-amber-800">Pagar en efectivo el día de la cita</span>
                      </div>
                    )}
                    {service.accepts_transfer && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-4 w-4 text-amber-700" />
                          <span className="text-amber-800">Realizar transferencia bancaria</span>
                        </div>
                        <Button 
                          onClick={() => setShowPaymentUpload(true)}
                          variant="outline"
                          className="w-full mt-2 border-amber-300 text-amber-800 hover:bg-amber-100"
                          disabled={showPaymentUpload}
                        >
                          Subir Comprobante de Transferencia
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Componente de subida de comprobante */}
              {showPaymentUpload && service.accepts_transfer && (
                <PaymentProofUpload
                  appointmentId={createdAppointment.id}
                  bankAccountDetails={business?.bank_account_details}
                  serviceName={service.name}
                  servicePrice={service.price || 0}
                />
              )}
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
