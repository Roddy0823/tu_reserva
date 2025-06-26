
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

const SubscriptionLimitBanner = () => {
  const { 
    hasReachedLimit, 
    isFreePlan, 
    currentBookings, 
    maxBookings,
    plans,
    createCheckout,
    isCreatingCheckout 
  } = useSubscription();

  if (!isFreePlan || !hasReachedLimit) return null;

  const proPlan = plans.find(plan => plan.name === 'Pro');

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Límite de reservas alcanzado</strong>
          <p className="text-sm text-gray-600 mt-1">
            Has completado {currentBookings} de {maxBookings} reservas permitidas este mes.
            Para continuar recibiendo reservas, actualiza al Plan Pro.
          </p>
        </div>
        {proPlan && (
          <Button 
            onClick={() => createCheckout(proPlan.id)}
            disabled={isCreatingCheckout}
            className="ml-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Crown className="h-4 w-4 mr-2" />
            Actualizar a Pro
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default SubscriptionLimitBanner;
