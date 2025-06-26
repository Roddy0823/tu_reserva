
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Package, TrendingUp, Users } from "lucide-react";
import { useBusiness } from "@/hooks/useBusiness";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Link } from "react-router-dom";
import RecentActivity from "./RecentActivity";

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
      </div>
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

        <Card>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.monthly_revenue || 0}</div>
            <p className="text-xs text-muted-foreground">
              ingresos generados este mes
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 mt-8">
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
