
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Package, TrendingUp, Users, Settings, Clock, CheckCircle } from "lucide-react";
import { useBusiness } from "@/hooks/useBusiness";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Link } from "react-router-dom";
import RecentActivity from "./RecentActivity";
import PendingPaymentsList from "./PendingPaymentsList";
import SubscriptionLimitBanner from "./SubscriptionLimitBanner";
import BookingUrlCard from "./BookingUrlCard";

const Dashboard = () => {
  const { business } = useBusiness();
  const { stats, recentActivity, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            ¡Hola {business?.name}!
          </h2>
          <p className="text-muted-foreground">
            Este es un resumen general de tu negocio.
          </p>
        </div>
        <Link to="/settings">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
        </Link>
      </div>

      {/* Booking URL Card - Quick Access */}
      {business?.booking_url_slug && (
        <div className="mb-6">
          <BookingUrlCard businessSlug={business.booking_url_slug} />
        </div>
      )}

      {/* Subscription Limit Banner */}
      <SubscriptionLimitBanner />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/services">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gestión de Servicios</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_services || 0}</div>
              <p className="text-xs text-muted-foreground">
                servicios registrados
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/staff">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gestión de Personal</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_staff || 0}</div>
              <p className="text-xs text-muted-foreground">
                miembros del equipo
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/availability">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gestión de Disponibilidad</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Horarios</div>
              <p className="text-xs text-muted-foreground">
                bloquear disponibilidad
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/appointments/today">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas de Hoy</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.today_appointments || 0}</div>
              <p className="text-xs text-muted-foreground">
                citas agendadas para hoy
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Completadas Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.todayCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">
              servicios realizados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos de Hoy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.todayRevenue || 0}</div>
            <p className="text-xs text-muted-foreground">
              ingresos generados hoy
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 mt-8">
        <PendingPaymentsList />
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Aquí podrás ver la actividad reciente de tu negocio.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <RecentActivity activities={recentActivity} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
