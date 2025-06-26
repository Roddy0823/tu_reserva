
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Building, AlertCircle } from 'lucide-react';
import BusinessSetup from '@/components/BusinessSetup';
import PendingPaymentsList from '@/components/PendingPaymentsList';

const Transfers = () => {
  const { user } = useAuth();
  const { business, isLoading } = useBusiness();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return <BusinessSetup />;
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transferencias y Pagos</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tus datos bancarios y valida comprobantes de pago
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Datos Bancarios
            </CardTitle>
            <CardDescription>
              Información bancaria para recibir pagos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Configuración Pendiente</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configura tus datos bancarios en la sección de Ajustes para recibir pagos de tus clientes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <PendingPaymentsList />
      </div>
    </div>
  );
};

export default Transfers;
