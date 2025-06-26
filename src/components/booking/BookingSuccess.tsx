
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Upload, CreditCard, Calendar, Clock, User, MapPin } from 'lucide-react';
import { Business, Service, StaffMember, Appointment } from '@/types/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { usePaymentProofUpload } from '@/hooks/usePaymentProofUpload';
import { useToast } from '@/hooks/use-toast';

interface BookingSuccessProps {
  business: Business;
  appointment: Appointment;
  service: Service;
  staffMember: StaffMember;
}

const BookingSuccess = ({ business, appointment, service, staffMember }: BookingSuccessProps) => {
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const { uploadPaymentProof, isUploading } = usePaymentProofUpload();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const handleUploadProof = async () => {
    if (!paymentProof) return;

    uploadPaymentProof(
      { appointmentId: appointment.id, file: paymentProof },
      {
        onSuccess: () => {
          toast({
            title: "Comprobante subido",
            description: "Tu comprobante de pago ha sido enviado correctamente. Te confirmaremos tu cita pronto.",
          });
          setPaymentProof(null);
        }
      }
    );
  };

  const appointmentDate = new Date(appointment.start_time);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="text-center border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            ¡Reserva Exitosa!
          </h2>
          <p className="text-green-700">
            Tu cita ha sido agendada con estado <strong>pendiente</strong>
          </p>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resumen de tu Cita
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Servicio</p>
                <p className="text-gray-600">{service.name}</p>
                <p className="text-sm text-gray-500">{service.duration_minutes} min</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Personal</p>
                <p className="text-gray-600">{staffMember.full_name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Fecha</p>
                <p className="text-gray-600">
                  {format(appointmentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Hora</p>
                <p className="text-gray-600">
                  {format(appointmentDate, "HH:mm")}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total a pagar:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${service.price?.toLocaleString()} COP
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <CreditCard className="h-5 w-5" />
            Instrucciones de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700">
            Para confirmar tu cita, por favor realiza el pago por adelantado a la siguiente cuenta:
          </p>
          
          {business.bank_account_details ? (
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium mb-2">Datos Bancarios:</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {business.bank_account_details}
              </pre>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-gray-600">
                Los datos bancarios serán enviados por correo electrónico.
              </p>
            </div>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              <strong>Importante:</strong> Tu cita quedará confirmada una vez que subas el comprobante de pago 
              y sea validado por nuestro equipo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Proof Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Comprobante de Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Sube tu comprobante de pago aquí o hazlo más tarde a través del correo de confirmación.
          </p>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="payment-proof">Comprobante de Pago</Label>
              <Input
                id="payment-proof"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-1"
              />
            </div>
            
            {paymentProof && (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm text-gray-700">
                  {paymentProof.name}
                </span>
                <Button
                  onClick={handleUploadProof}
                  disabled={isUploading}
                  size="sm"
                >
                  {isUploading ? 'Subiendo...' : 'Subir'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">¿Tienes preguntas sobre tu reserva?</p>
            <p className="text-sm">
              Recibirás un correo de confirmación con todos los detalles y nuestros datos de contacto.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSuccess;
