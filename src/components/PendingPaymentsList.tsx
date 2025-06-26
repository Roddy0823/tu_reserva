
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Eye } from "lucide-react";
import { usePendingPayments } from "@/hooks/usePendingPayments";
import { usePaymentValidation } from "@/hooks/usePaymentValidation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import PaymentProofModal from "./PaymentProofModal";

const PendingPaymentsList = () => {
  const { pendingPayments, isLoading } = usePendingPayments();
  const { validatePayment, isValidating } = usePaymentValidation();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comprobantes Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleApprove = (appointmentId: string) => {
    validatePayment({ appointmentId, action: 'aprobado' });
  };

  const handleReject = (appointmentId: string) => {
    validatePayment({ appointmentId, action: 'rechazado' });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Comprobantes Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingPayments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay comprobantes pendientes de revisión
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Personal</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.client_name}</div>
                        <div className="text-sm text-gray-500">{payment.client_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{payment.services?.name}</TableCell>
                    <TableCell>{payment.staff_members?.full_name}</TableCell>
                    <TableCell>
                      {format(new Date(payment.start_time), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </TableCell>
                    <TableCell>${payment.services?.price}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Pendiente</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(payment.id)}
                          disabled={isValidating}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(payment.id)}
                          disabled={isValidating}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedPayment && (
        <PaymentProofModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onApprove={() => {
            handleApprove(selectedPayment.id);
            setSelectedPayment(null);
          }}
          onReject={() => {
            handleReject(selectedPayment.id);
            setSelectedPayment(null);
          }}
        />
      )}
    </>
  );
};

export default PendingPaymentsList;
