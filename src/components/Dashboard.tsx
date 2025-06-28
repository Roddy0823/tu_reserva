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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container py-8 max-w-7xl">
        {/* Header with Welcome Message */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">
                      ¡Bienvenido a {business?.name}!
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Aquí tienes un resumen completo de tu negocio
                    </p>
                  </div>
                </div>
              </div>
              <Link to="/settings">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
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

        {/* Main Stats Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
          <Link to="/services">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-gray-600">Gestión de Servicios y Personal</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">{stats?.total_services || 0}</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">servicios registrados</p>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/availability">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-orange-50 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-gray-600">Disponibilidad</CardTitle>
                  <div className="text-2xl font-bold text-orange-600">Horarios</div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <CalendarDays className="h-6 w-6 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">gestionar disponibilidad</p>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Today's Performance Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Link to="/appointments/today">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-indigo-50 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-gray-600">Citas de Hoy</CardTitle>
                  <div className="text-3xl font-bold text-indigo-600">{stats?.today_appointments || 0}</div>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <CalendarDays className="h-6 w-6 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">citas programadas para hoy</p>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-600">Completadas Hoy</CardTitle>
                <div className="text-3xl font-bold text-green-600">{stats?.todayCompleted || 0}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">servicios realizados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-emerald-50 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-600">Ingresos de Hoy</CardTitle>
                <div className="text-3xl font-bold text-emerald-600">${stats?.todayRevenue || 0}</div>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">ingresos generados hoy</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Bottom Section with Activity and Payments */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <PendingPaymentsList />
          </div>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="text-xl font-semibold text-gray-800">Actividad Reciente</CardTitle>
              <CardDescription className="text-gray-600">
                Últimas actualizaciones de tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <RecentActivity activities={recentActivity} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
