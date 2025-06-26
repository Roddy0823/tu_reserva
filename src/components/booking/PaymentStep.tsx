
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaymentProofUpload from "../PaymentProofUpload";

interface PaymentStepProps {
  appointment: any;
  businessBankDetails?: string;
  onComplete: () => void;
}

const PaymentStep = ({ appointment, businessBankDetails, onComplete }: PaymentStepProps) => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estado de tu Reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Estado actual:</span>
            <Badge variant="secondary">Pendiente de Pago</Badge>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">¡Tu reserva está casi lista!</</h4>
            <p className="text-sm text-yellow-700">
              Para confirmar tu cita, necesitas realizar el pago y subir el comprobante.
              Una vez que el administrador apruebe tu pago, tu cita será confirmada automáticamente.
            </p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => setShowUpload(true)}
              className="w-full"
              disabled={showUpload}
            >
              Subir Comprobante de Pago
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onComplete}
              className="w-full"
            >
              Subir Comprobante Más Tarde
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {showUpload && (
        <PaymentProofUpload
          appointmentId={appointment.id}
          bankAccountDetails={businessBankDetails}
          serviceName={appointment.services?.name || ''}
          servicePrice={appointment.services?.price || 0}
        />
      )}
    </div>
  );
};

export default PaymentStep;
