
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Completa tu Reserva</h2>
        <p className="text-gray-600">Tu cita está casi lista. Solo falta el pago para confirmarla.</p>
      </div>

      {/* Appointment Summary */}
      <div className="border border-gray-200 rounded-lg">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 text-gray-600 mr-2" />
            Resumen de tu Cita
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Servicio</p>
              <p className="font-medium text-gray-900">{service.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Precio</p>
              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                ${service.price?.toLocaleString()} COP
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-500">Estado actual</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Clock className="h-3 w-3 mr-1" />
              Pendiente de Pago
            </Badge>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="border border-gray-200 bg-gray-50 rounded-lg">
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">¿Cómo completar tu reserva?</h4>
              <p className="text-sm text-gray-700">
                Puedes pagar en efectivo el día de la cita o realizar una transferencia bancaria ahora 
                y subir el comprobante para confirmar tu reserva inmediatamente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {service.accepts_cash && (
          <div className="border border-gray-200 hover:border-gray-900 transition-colors cursor-pointer rounded-lg" onClick={onComplete}>
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900">Pagar en Efectivo</h3>
              <p className="text-sm text-gray-600">Completa el pago el día de tu cita</p>
              <Button variant="outline" className="w-full border-gray-200 hover:border-gray-900">
                Continuar con Efectivo
              </Button>
            </div>
          </div>
        )}

        {service.accepts_transfer && (
          <div className="border border-gray-200 hover:border-gray-900 transition-colors rounded-lg">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900">Transferencia Bancaria</h3>
              <p className="text-sm text-gray-600">Realiza el pago y sube tu comprobante</p>
              <Button 
                onClick={() => setShowUpload(true)}
                disabled={showUpload || paymentProofUploaded}
                className="w-full bg-gray-900 hover:bg-gray-800"
              >
                {paymentProofUploaded ? 'Comprobante Enviado' : 'Subir Comprobante'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Component */}
      {showUpload && service.accepts_transfer && (
        <div className="border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Subir Comprobante de Pago</h3>
          </div>
          <div className="p-6">
            <PaymentProofUpload
              appointmentId={appointment.id}
              bankAccountDetails={businessBankDetails}
              serviceName={service.name}
              servicePrice={service.price || 0}
              onSuccess={handleUploadSuccess}
            />
          </div>
        </div>
      )}

      {/* Success Message */}
      {paymentProofUploaded && (
        <div className="border border-gray-200 bg-gray-50 rounded-lg">
          <div className="p-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-gray-600 mx-auto" />
            <h3 className="font-medium text-gray-900">¡Comprobante Enviado!</h3>
            <p className="text-sm text-gray-700">
              Tu comprobante está siendo revisado. Te redirigiremos en un momento...
            </p>
          </div>
        </div>
      )}

      <Separator className="bg-gray-200" />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="px-6 border-gray-200 hover:border-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        {!showUpload && !paymentProofUploaded && (
          <Button 
            onClick={onComplete}
            variant="outline"
            className="px-6 border-gray-200 hover:border-gray-900"
          >
            Completar Más Tarde
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
