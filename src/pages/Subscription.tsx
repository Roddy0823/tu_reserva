
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, CreditCard, AlertCircle } from 'lucide-react';
import BusinessSetup from '@/components/BusinessSetup';
import SubscriptionCard from '@/components/SubscriptionCard';
import { useSubscription } from '@/hooks/useSubscription';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Subscription = () => {
  const { user } = useAuth();
  const { business, isLoading: businessLoading } = useBusiness();
  const { 
    subscription, 
    currentUsage, 
    isLoading: subscriptionLoading, 
    plans,
    error
  } = useSubscription();

  console.log('Subscription page state:', { 
    user: !!user, 
    business: !!business, 
    businessLoading, 
    subscriptionLoading,
    plansCount: plans.length,
    error 
  });

  // Show loading state
  if (businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando información del negocio...</p>
        </div>
      </div>
    );
  }

  // Show business setup if no business
  if (!business) {
    return <BusinessSetup />;
  }

  // Show error if there's an error
  if (error) {
    return (
      <div className="container py-6">
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar la información de suscripción: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading for subscription data
  if (subscriptionLoading) {
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
        
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Cargando información de suscripción...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.subscription_plans;
  const isFreePlan = currentPlan?.name === 'Gratuito' || !currentPlan;

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
                    Plan {currentPlan?.name || 'Gratuito'}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {isFreePlan
                      ? 'Funcionalidades básicas incluidas'
                      : 'Acceso completo a todas las funcionalidades'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-900">
                    ${isFreePlan ? '0' : (currentPlan?.price_cop ? (currentPlan.price_cop / 1000).toFixed(0) : '29')}
                  </div>
                  <div className="text-sm text-blue-700">por mes</div>
                </div>
              </div>

              {currentUsage && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Uso del Mes Actual</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Citas completadas:</span>
                      <span>{currentUsage.completed_bookings} / {currentPlan?.max_bookings_per_month || '∞'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <SubscriptionCard 
              key={plan.id} 
              plan={plan} 
              isCurrentPlan={currentPlan?.id === plan.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
