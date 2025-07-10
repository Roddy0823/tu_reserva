import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Users } from "lucide-react";
import { useState } from "react";

interface ChartData {
  name: string;
  ingresos: number;
  citas: number;
  clientes: number;
}

interface TrendChartsProps {
  data: ChartData[];
  period: '7d' | '30d' | '90d' | '1y';
  onPeriodChange: (period: '7d' | '30d' | '90d' | '1y') => void;
}

const TrendCharts = ({ data, period, onPeriodChange }: TrendChartsProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'ingresos' | 'citas' | 'clientes'>('ingresos');

  const getMetricConfig = (metric: string) => {
    switch (metric) {
      case 'ingresos':
        return {
          color: '#10b981',
          icon: DollarSign,
          label: 'Ingresos',
          formatter: (value: number) => `$${value.toLocaleString()}`
        };
      case 'citas':
        return {
          color: '#3b82f6',
          icon: Calendar,
          label: 'Citas',
          formatter: (value: number) => value.toString()
        };
      case 'clientes':
        return {
          color: '#8b5cf6',
          icon: Users,
          label: 'Clientes',
          formatter: (value: number) => value.toString()
        };
      default:
        return {
          color: '#6b7280',
          icon: TrendingUp,
          label: 'Métrica',
          formatter: (value: number) => value.toString()
        };
    }
  };

  const config = getMetricConfig(selectedMetric);
  const IconComponent = config.icon;

  const getPeriodLabel = (p: string) => {
    switch (p) {
      case '7d': return 'Últimos 7 días';
      case '30d': return 'Últimos 30 días';
      case '90d': return 'Últimos 3 meses';
      case '1y': return 'Último año';
      default: return 'Período';
    }
  };

  // Calcular tendencia
  const currentValue = data[data.length - 1]?.[selectedMetric] || 0;
  const previousValue = data[data.length - 2]?.[selectedMetric] || 0;
  const change = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Gráfico de Tendencia Principal */}
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-primary" />
                Tendencia de {config.label}
              </CardTitle>
              <CardDescription>
                {getPeriodLabel(period)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingresos">Ingresos</SelectItem>
                  <SelectItem value="citas">Citas</SelectItem>
                  <SelectItem value="clientes">Clientes</SelectItem>
                </SelectContent>
              </Select>
              <Select value={period} onValueChange={onPeriodChange}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 días</SelectItem>
                  <SelectItem value="30d">30 días</SelectItem>
                  <SelectItem value="90d">3 meses</SelectItem>
                  <SelectItem value="1y">1 año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold">{config.formatter(currentValue)}</span>
            <Badge variant={change >= 0 ? "default" : "destructive"} className="text-xs">
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={config.formatter}
              />
              <Tooltip 
                formatter={(value: number) => [config.formatter(value), config.label]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={config.color}
                fill={config.color}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparación de Métricas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Comparación General
          </CardTitle>
          <CardDescription>
            Todas las métricas en {getPeriodLabel(period)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="citas" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendCharts;