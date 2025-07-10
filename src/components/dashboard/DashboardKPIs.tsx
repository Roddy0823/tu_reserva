import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, Star, AlertTriangle } from "lucide-react";

interface KPIData {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  label: string;
  description: string;
}

interface DashboardKPIsProps {
  kpis: {
    revenue: KPIData;
    appointments: KPIData;
    clients: KPIData;
    rating: KPIData;
  };
}

const DashboardKPIs = ({ kpis }: DashboardKPIsProps) => {
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Ingresos */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.revenue.value)}</div>
          <div className="flex items-center gap-1 text-xs">
            {getTrendIcon(kpis.revenue.trend)}
            <span className={getTrendColor(kpis.revenue.trend)}>
              {kpis.revenue.change > 0 ? '+' : ''}{kpis.revenue.change}%
            </span>
            <span className="text-muted-foreground">vs mes anterior</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{kpis.revenue.description}</p>
        </CardContent>
      </Card>

      {/* Citas */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Citas del Mes</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.appointments.value}</div>
          <div className="flex items-center gap-1 text-xs">
            {getTrendIcon(kpis.appointments.trend)}
            <span className={getTrendColor(kpis.appointments.trend)}>
              {kpis.appointments.change > 0 ? '+' : ''}{kpis.appointments.change}%
            </span>
            <span className="text-muted-foreground">vs mes anterior</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{kpis.appointments.description}</p>
        </CardContent>
      </Card>

      {/* Clientes */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.clients.value}</div>
          <div className="flex items-center gap-1 text-xs">
            {getTrendIcon(kpis.clients.trend)}
            <span className={getTrendColor(kpis.clients.trend)}>
              {kpis.clients.change > 0 ? '+' : ''}{kpis.clients.change}%
            </span>
            <span className="text-muted-foreground">vs mes anterior</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{kpis.clients.description}</p>
        </CardContent>
      </Card>

      {/* Rating Promedio */}
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.rating.value.toFixed(1)}</div>
          <div className="flex items-center gap-1 text-xs">
            {getTrendIcon(kpis.rating.trend)}
            <span className={getTrendColor(kpis.rating.trend)}>
              {kpis.rating.change > 0 ? '+' : ''}{kpis.rating.change.toFixed(1)}
            </span>
            <span className="text-muted-foreground">vs mes anterior</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{kpis.rating.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardKPIs;