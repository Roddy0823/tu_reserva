
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, CreditCard } from 'lucide-react';
import BusinessSetup from '@/components/BusinessSetup';
import SubscriptionCard from '@/components/SubscriptionCard';
import { useSubscription } from '@/hooks/useSubscription';

const Subscription = () => {
  const { user } = useAuth();
  const { business, isLoading } = useBusiness();
  const { subscription, usage, isLoading: subscriptionLoading } = useSubscription();

  if (isLoading || subscriptionLoading) {
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
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Crown className="h-8 w-8 text-yellow-500" />
          Mi Suscripción
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tu plan de membresía y facturación
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Plan Actual
            </CardTitle>
            <CardDescription>
              Detalles de tu suscripción activa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Plan {subscription?.plan_type === 'free' ? 'Gratuito' : 'Pro'}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {subscription?.plan_type === 'free' 
                      ? 'Funcionalidades básicas incluidas'
                      : 'Acceso completo a todas las funcionalidades'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-900">
                    ${subscription?.plan_type === 'free' ? '0' : '29'}
                  </div>
                  <div className="text-sm text-blue-700">por mes</div>
                </div>
              </div>

              {usage && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Uso del Mes Actual</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Citas creadas:</span>
                      <span>{usage.appointments_this_month} / {subscription?.plan_type === 'free' ? '10' : '∞'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Servicios activos:</span>
                      <span>{usage.active_services} / {subscription?.plan_type === 'free' ? '3' : '∞'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Personal activo:</span>
                      <span>{usage.active_staff} / {subscription?.plan_type === 'free' ? '2' : '∞'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <SubscriptionCard />
      </div>
    </div>
  );
};

export default Subscription;
