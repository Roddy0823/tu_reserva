
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Download, Eye, Calendar, Crown, BarChart } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionCard from '../SubscriptionCard';

interface BillingSettingsProps {
  business: any;
}

const BillingSettings = ({ business }: BillingSettingsProps) => {
  const { 
    subscription, 
    plans, 
    currentUsage, 
    isFreePlan, 
    currentBookings, 
    maxBookings,
    openCustomerPortal,
    isOpeningPortal,
    isLoading 
  } = useSubscription();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const usagePercentage = isFreePlan && maxBookings > 0 
    ? Math.min((currentBookings / maxBookings) * 100, 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isFreePlan ? (
              <>
                <BarChart className="h-5 w-5" />
                Plan Actual
              </>
            ) : (
              <>
                <Crown className="h-5 w-5 text-purple-600" />
                Plan Pro Activo
              </>
            )}
          </CardTitle>
          <CardDescription>
            Información sobre tu membresía y facturación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{subscription?.subscription_plans?.name}</h3>
              <p className="text-sm text-gray-500">
                {subscription?.subscription_plans?.description}
              </p>
            </div>
            <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'}>
              {subscription?.status === 'active' ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Precio</p>
              <p className="font-medium">
                {subscription?.subscription_plans?.price_cop === 0 
                  ? 'Gratis' 
                  : `${formatPrice(subscription?.subscription_plans?.price_cop || 0)}/mes`
                }
              </p>
            </div>
            {!isFreePlan && (
              <div>
                <p className="text-gray-500">Próxima facturación</p>
                <p className="font-medium">
                  {subscription?.current_period_end 
                    ? formatDate(subscription.current_period_end)
                    : 'N/A'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Usage for free plan */}
          {isFreePlan && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reservas este mes</span>
                <span className="font-medium">{currentBookings} / {maxBookings}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              {usagePercentage >= 100 && (
                <p className="text-sm text-red-600 font-medium">
                  ⚠️ Has alcanzado el límite de reservas para este mes
                </p>
              )}
            </div>
          )}

          {!isFreePlan && subscription?.stripe_subscription_id && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => openCustomerPortal()}
              disabled={isOpeningPortal}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Gestionar Suscripción
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Planes Disponibles</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={subscription?.plan_id === plan.id}
            />
          ))}
        </div>
      </div>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Uso</CardTitle>
          <CardDescription>
            Resumen de tu actividad este mes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{currentBookings}</div>
              <div className="text-sm text-gray-600">Reservas Completadas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {isFreePlan ? `${maxBookings - currentBookings}` : '∞'}
              </div>
              <div className="text-sm text-gray-600">Reservas Restantes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSettings;
