
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PaymentProofModalProps {
  payment: any;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const PaymentProofModal = ({ payment, onClose, onApprove, onReject }: PaymentProofModalProps) => {
  return (
    <Dialog open={!!payment} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Comprobante de Pago</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Cliente</h4>
              <p>{payment.client_name}</p>
              <p className="text-sm text-gray-500">{payment.client_email}</p>
              {payment.client_phone && (
                <p className="text-sm text-gray-500">{payment.client_phone}</p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium">Cita</h4>
              <p>{payment.services?.name}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(payment.start_time), 'dd/MM/yyyy HH:mm', { locale: es })}
              </p>
              <p className="text-sm text-gray-500">Personal: {payment.staff_members?.full_name}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium">Monto</h4>
            <p className="text-lg font-bold">${payment.services?.price}</p>
          </div>
          
          <div>
            <h4 className="font-medium">Estado del Pago</h4>
            <Badge variant="secondary">Pendiente de Revisión</Badge>
          </div>
          
          {payment.payment_proof_url && (
            <div>
              <h4 className="font-medium mb-2">Comprobante</h4>
              <img 
                src={payment.payment_proof_url} 
                alt="Comprobante de pago"
                className="max-w-full h-auto border rounded-lg"
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="destructive" onClick={onReject}>
            <X className="h-4 w-4 mr-2" />
            Rechazar
          </Button>
          <Button onClick={onApprove}>
            <Check className="h-4 w-4 mr-2" />
            Aprobar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentProofModal;
