import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Calendar,
  Settings,
  ArrowRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'critical';
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

interface BusinessHealthWidgetProps {
  healthScore: number;
  alerts: HealthAlert[];
  recommendations: string[];
}

const BusinessHealthWidget = ({ healthScore, alerts, recommendations }: BusinessHealthWidgetProps) => {
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: 'Excelente', color: 'bg-green-500', textColor: 'text-green-700' };
    if (score >= 60) return { status: 'Bueno', color: 'bg-blue-500', textColor: 'text-blue-700' };
    if (score >= 40) return { status: 'Regular', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { status: 'Necesita Atención', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const health = getHealthStatus(healthScore);

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Salud del Negocio
            </CardTitle>
            <CardDescription>
              Resumen del estado general y recomendaciones
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{healthScore}%</div>
            <Badge variant="outline" className={cn("text-xs", health.textColor)}>
              {health.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de Progreso de Salud */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Puntuación General</span>
            <span className="font-medium">{healthScore}/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-300", health.color)}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>

        {/* Alertas */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas ({alerts.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {alerts.map((alert) => (
                <Alert key={alert.id} className="py-2">
                  <div className="flex items-start gap-2">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <AlertTitle className="text-sm">{alert.title}</AlertTitle>
                      <AlertDescription className="text-xs text-muted-foreground">
                        {alert.description}
                      </AlertDescription>
                      {alert.action && (
                        <Button variant="ghost" size="sm" className="h-6 p-1 mt-1">
                          {alert.action.label}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Recomendaciones
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Acciones Rápidas */}
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Settings className="h-3 w-3 mr-1" />
              Configurar
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Users className="h-3 w-3 mr-1" />
              Gestionar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHealthWidget;