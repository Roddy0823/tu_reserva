import { useState, useEffect } from "react";
import { useBusiness } from "@/hooks/useBusiness";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRealtimeSubscriptions } from "@/hooks/useRealtimeSubscriptions";
import BusinessSetup from "@/components/BusinessSetup";
import DashboardKPIs from "./DashboardKPIs";
import BusinessHealthWidget from "./BusinessHealthWidget";
import TrendCharts from "./TrendCharts";
import TopRankings from "./TopRankings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Settings, Calendar, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const EnhancedDashboard = () => {
  const { business, isLoading: businessLoading } = useBusiness();
  const { stats, recentActivity, isLoading: statsLoading } = useDashboardStats();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Habilitar suscripciones en tiempo real
  useRealtimeSubscriptions();

  // Mock data para charts y rankings - en producción vendría de hooks
  const [chartData] = useState([
    { name: 'Lun', ingresos: 1200, citas: 8, clientes: 6 },
    { name: 'Mar', ingresos: 1900, citas: 12, clientes: 9 },
    { name: 'Mié', ingresos: 3000, citas: 18, clientes: 15 },
    { name: 'Jue', ingresos: 2800, citas: 16, clientes: 12 },
    { name: 'Vie', ingresos: 3900, citas: 22, clientes: 18 },
    { name: 'Sáb', ingresos: 4200, citas: 25, clientes: 20 },
    { name: 'Dom', ingresos: 2100, citas: 14, clientes: 11 },
  ]);

  const mockKPIs = {
    revenue: {
      value: 45000,
      change: 12.5,
      trend: 'up' as const,
      label: 'Ingresos del Mes',
      description: 'Basado en citas completadas'
    },
    appointments: {
      value: 186,
      change: 8.2,
      trend: 'up' as const,
      label: 'Citas del Mes',
      description: 'Incluye confirmadas y completadas'
    },
    clients: {
      value: 89,
      change: -2.1,
      trend: 'down' as const,
      label: 'Clientes Activos',
      description: 'Clientes con citas en los últimos 30 días'
    },
    rating: {
      value: 4.7,
      change: 0.3,
      trend: 'up' as const,
      label: 'Rating Promedio',
      description: 'Basado en 45 reseñas'
    }
  };

  const mockHealthAlerts = [
    {
      id: '1',
      type: 'warning' as const,
      title: 'Servicios sin categoría',
      description: '3 servicios no tienen categoría asignada',
      action: { label: 'Organizar', href: '/catalog?tab=categories' }
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'Horarios de atención',
      description: 'Considera extender horarios los fines de semana',
      action: { label: 'Configurar', href: '/settings?tab=schedule' }
    }
  ];

  const mockRecommendations = [
    'Crear promociones para los martes y miércoles',
    'Agregar más slots los viernes y sábados',
    'Implementar recordatorios automáticos por WhatsApp'
  ];

  const mockRankings = {
    services: [
      { id: '1', name: 'Corte de Cabello Clásico', value: 45, change: 12, category: 'Peluquería' },
      { id: '2', name: 'Manicure Completa', value: 38, change: 8, category: 'Belleza' },
      { id: '3', name: 'Pedicure Spa', value: 32, change: -2, category: 'Belleza' },
      { id: '4', name: 'Corte + Barba', value: 28, change: 15, category: 'Peluquería' },
      { id: '5', name: 'Tratamiento Capilar', value: 22, change: 5, category: 'Tratamientos' }
    ],
    staff: [
      { id: '1', name: 'María González', value: 4.9, change: 2, avatar: '', category: 'Estilista Senior' },
      { id: '2', name: 'Carlos Ruiz', value: 4.8, change: 1, avatar: '', category: 'Barbero' },
      { id: '3', name: 'Ana Martínez', value: 4.7, change: 0, avatar: '', category: 'Manicurista' },
      { id: '4', name: 'Luis Torres', value: 4.6, change: -1, avatar: '', category: 'Estilista' },
      { id: '5', name: 'Sofia Herrera', value: 4.5, change: 3, avatar: '', category: 'Terapeuta' }
    ],
    clients: [
      { id: '1', name: 'Jennifer López', value: 12, change: 0, category: 'Cliente VIP' },
      { id: '2', name: 'Roberto Silva', value: 8, change: 2, category: 'Cliente Regular' },
      { id: '3', name: 'Carmen Delgado', value: 7, change: 1, category: 'Cliente Regular' },
      { id: '4', name: 'Miguel Ángel', value: 6, change: -1, category: 'Cliente Nuevo' },
      { id: '5', name: 'Lucía Morales', value: 5, change: 2, category: 'Cliente Regular' }
    ]
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Si está cargando la información del negocio, mostrar spinner
  if (businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Cargando información del negocio...</p>
        </div>
      </div>
    );
  }

  // Si no hay negocio, mostrar el formulario de configuración
  if (!business) {
    return <BusinessSetup />;
  }

  // Si hay negocio pero las estadísticas están cargando
  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Panel de Control
            </h1>
            <p className="text-muted-foreground">
              Bienvenido a {business?.name} - Vista general de tu negocio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Link to="/appointments">
              <Button size="sm" className="h-9">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Citas
              </Button>
            </Link>
          </div>
        </div>

        {/* KPIs principales */}
        <div className="mb-8">
          <DashboardKPIs kpis={mockKPIs} />
        </div>

        <Separator className="my-8" />

        {/* Gráficos y Widget de Salud */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <TrendCharts 
              data={chartData}
              period={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          </div>
          <div>
            <BusinessHealthWidget
              healthScore={78}
              alerts={mockHealthAlerts}
              recommendations={mockRecommendations}
            />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Rankings */}
        <div className="mb-8">
          <TopRankings
            services={mockRankings.services}
            staff={mockRankings.staff}
            clients={mockRankings.clients}
          />
        </div>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Accesos directos a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/appointments">
                <Button variant="outline" className="w-full h-16 flex-col gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Centro de Citas</span>
                </Button>
              </Link>
              <Link to="/catalog">
                <Button variant="outline" className="w-full h-16 flex-col gap-2">
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">Catálogo</span>
                </Button>
              </Link>
              <Link to="/clients">
                <Button variant="outline" className="w-full h-16 flex-col gap-2">
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">Clientes</span>
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="outline" className="w-full h-16 flex-col gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Reportes</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedDashboard;