
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, CreditCard, ArrowLeft, Upload, Info } from 'lucide-react';
import PaymentProofUpload from "../PaymentProofUpload";
import { Service } from '@/types/database';

interface PaymentStepProps {
  appointment: any;
  service: Service;
  businessBankDetails?: string;
  onComplete: () => void;
  onBack: () => void;
}

const PaymentStep = ({ appointment, service, businessBankDetails, onComplete, onBack }: PaymentStepProps) => {
  const [showUpload, setShowUpload] = useState(false);
  const [paymentProofUploaded, setPaymentProofUploaded] = useState(false);

  const handleUploadSuccess = () => {
    setPaymentProofUploaded(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Completa tu Reserva</h2>
        <p className="text-slate-600">Tu cita está casi lista. Solo falta el pago para confirmarla.</p>
      </div>

      {/* Appointment Summary */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="text-lg text-slate-800 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            Resumen de tu Cita
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Servicio</p>
              <p className="font-semibold text-slate-900">{service.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Precio</p>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                ${service.price?.toLocaleString()} COP
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-slate-500">Estado actual</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Clock className="h-3 w-3 mr-1" />
              Pendiente de Pago
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">¿Cómo completar tu reserva?</h4>
              <p className="text-sm text-blue-800">
                Puedes pagar en efectivo el día de la cita o realizar una transferencia bancaria ahora 
                y subir el comprobante para confirmar tu reserva inmediatamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {service.accepts_cash && (
          <Card className="border-slate-200 hover:border-slate-300 transition-colors cursor-pointer" onClick={onComplete}>
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Pagar en Efectivo</h3>
              <p className="text-sm text-slate-600">Completa el pago el día de tu cita</p>
              <Button variant="outline" className="w-full">
                Continuar con Efectivo
              </Button>
            </CardContent>
          </Card>
        )}

        {service.accepts_transfer && (
          <Card className="border-blue-200 hover:border-blue-300 transition-colors">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Transferencia Bancaria</h3>
              <p className="text-sm text-slate-600">Realiza el pago y sube tu comprobante</p>
              <Button 
                onClick={() => setShowUpload(true)}
                disabled={showUpload || paymentProofUploaded}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {paymentProofUploaded ? 'Comprobante Enviado' : 'Subir Comprobante'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Component */}
      {showUpload && service.accepts_transfer && (
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Subir Comprobante de Pago</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <PaymentProofUpload
              appointmentId={appointment.id}
              bankAccountDetails={businessBankDetails}
              serviceName={service.name}
              servicePrice={service.price || 0}
              onSuccess={handleUploadSuccess}
            />
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {paymentProofUploaded && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6 text-center space-y-3">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className="font-semibold text-green-900">¡Comprobante Enviado!</h3>
            <p className="text-sm text-green-800">
              Tu comprobante está siendo revisado. Te redirigiremos en un momento...
            </p>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="px-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        {!showUpload && !paymentProofUploaded && (
          <Button 
            onClick={onComplete}
            variant="outline"
            className="px-6"
          >
            Completar Más Tarde
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
