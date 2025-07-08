import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Package, TrendingUp, Settings, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useBusiness } from "@/hooks/useBusiness";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRealtimeSubscriptions } from "@/hooks/useRealtimeSubscriptions";
import { Link } from "react-router-dom";
import RecentActivity from "./RecentActivity";
import PendingPaymentsList from "./PendingPaymentsList";
import SubscriptionLimitBanner from "./SubscriptionLimitBanner";
import BookingUrlCard from "./BookingUrlCard";
import BusinessSetup from "./BusinessSetup";

const Dashboard = () => {
  const { business, isLoading: businessLoading } = useBusiness();
  const { stats, recentActivity, isLoading: statsLoading } = useDashboardStats();
  
  // Habilitar suscripciones en tiempo real
  useRealtimeSubscriptions();

  // Si está cargando la información del negocio, mostrar spinner
  if (businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando información del negocio...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header responsivo */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-primary to-primary-hover rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-primary-foreground shadow-lg sm:shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
                      ¡Bienvenido a {business?.name}!
                    </h1>
                    <p className="text-primary-foreground/80 text-sm sm:text-base lg:text-lg">
                      Resumen completo de tu negocio
                    </p>
                  </div>
                </div>
              </div>
              <Link to="/settings" className="flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white w-full sm:w-auto"
                >
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Configuración</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Booking URL Card - Quick Access */}
        {business?.booking_url_slug && (
          <div className="mb-8">
            <BookingUrlCard businessSlug={business.booking_url_slug} />
          </div>
        )}

        {/* Subscription Limit Banner */}
        <SubscriptionLimitBanner />

        {/* Cards principales responsivas */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-6 sm:mb-8">
          <Link to="/services" className="block">
            <Card className="group card-interactive hover-glow bg-gradient-to-br from-card to-primary-subtle border-0 shadow-lg hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-6">
                <div className="space-y-1 min-w-0 flex-1">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    Servicios y Personal
                  </CardTitle>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    {stats?.total_services || 0}
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground">servicios registrados</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/availability" className="block">
            <Card className="group card-interactive hover-glow bg-gradient-to-br from-card to-accent-subtle border-0 shadow-lg hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-6">
                <div className="space-y-1 min-w-0 flex-1">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    Disponibilidad
                  </CardTitle>
                  <div className="text-xl sm:text-2xl font-bold text-accent-foreground">
                    Horarios
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors flex-shrink-0">
                  <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground">gestionar horarios</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Cards de rendimiento del día */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
          <Link to="/appointments/today" className="block">
            <Card className="group card-interactive hover-glow bg-gradient-to-br from-card to-secondary-subtle border-0 shadow-lg hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-6">
                <div className="space-y-1 min-w-0 flex-1">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Citas de Hoy
                  </CardTitle>
                  <div className="text-2xl sm:text-3xl font-bold text-secondary-foreground">
                    {stats?.today_appointments || 0}
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors flex-shrink-0">
                  <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground">programadas hoy</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary-foreground transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-gradient-to-br from-card to-green-50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-6">
              <div className="space-y-1 min-w-0 flex-1">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Completadas
                </CardTitle>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {stats?.todayCompleted || 0}
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground">servicios realizados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-emerald-50 border-0 shadow-lg sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 sm:p-6">
              <div className="space-y-1 min-w-0 flex-1">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Ingresos de Hoy
                </CardTitle>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
                  ${stats?.todayRevenue || 0}
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground">ingresos generados hoy</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Sección inferior responsiva */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
          <div className="space-y-6 order-2 lg:order-1">
            <PendingPaymentsList />
          </div>
          
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg order-1 lg:order-2">
            <CardHeader className="bg-gradient-subtle rounded-t-lg p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
                Actividad Reciente
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Últimas actualizaciones de tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <RecentActivity activities={recentActivity} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
