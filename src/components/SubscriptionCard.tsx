
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface SubscriptionCardProps {
  plan: {
    id: string;
    name: string;
    description: string | null;
    price_cop: number;
    max_bookings_per_month: number | null;
  };
  isCurrentPlan?: boolean;
}

const SubscriptionCard = ({ plan, isCurrentPlan }: SubscriptionCardProps) => {
  const { createCheckout, isCreatingCheckout } = useSubscription();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const features = plan.name === 'Pro' ? [
    'Reservas ilimitadas',
    'Gestión completa de personal',
    'Notificaciones avanzadas',
    'Soporte prioritario',
    'Reportes detallados'
  ] : [
    `Hasta ${plan.max_bookings_per_month || 10} reservas por mes`,
    'Gestión básica de servicios',
    'Notificaciones por email',
    'Soporte estándar'
  ];

  return (
    <Card className={`relative ${isCurrentPlan ? 'ring-2 ring-blue-500 bg-blue-50' : ''} ${plan.name === 'Pro' ? 'border-purple-200' : ''}`}>
      {isCurrentPlan && (
        <Badge className="absolute -top-2 left-4 bg-blue-500">
          Plan Actual
        </Badge>
      )}
      {plan.name === 'Pro' && (
        <div className="absolute -top-2 right-4">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {plan.name === 'Pro' ? (
            <Crown className="h-5 w-5 text-purple-600" />
          ) : (
            <Zap className="h-5 w-5 text-blue-600" />
          )}
          {plan.name}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">
            {plan.price_cop === 0 ? 'Gratis' : formatPrice(plan.price_cop)}
          </span>
          {plan.price_cop > 0 && (
            <span className="text-gray-600 ml-2">/mes</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              {feature}
            </li>
          ))}
        </ul>
        
        {!isCurrentPlan && plan.name === 'Pro' && (
          <Button 
            onClick={() => createCheckout(plan.id)}
            disabled={isCreatingCheckout}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Crown className="h-4 w-4 mr-2" />
            Suscribirse
          </Button>
        )}
        
        {isCurrentPlan && (
          <Button variant="outline" className="w-full" disabled>
            Plan Activo
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
