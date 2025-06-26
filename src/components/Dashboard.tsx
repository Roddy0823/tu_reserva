
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Building2, Settings, FileText, Clock, LogOut, AlertCircle, CreditCard, CheckCircle } from 'lucide-react';
import BusinessSetup from './BusinessSetup';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { business, isLoading } = useBusiness();
  const { stats, recentActivity, isLoading: statsLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si el usuario no tiene negocio registrado, mostrar formulario de configuración
  if (!business) {
    return <BusinessSetup />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
            <p className="text-gray-600">Bienvenido, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span>Turnos Hoy</span>
              </CardDescription>
              <CardTitle className="text-2xl">
                {statsLoading ? '...' : stats.todayAppointments}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>Cancelaciones Hoy</span>
              </CardDescription>
              <CardTitle className="text-2xl">
                {statsLoading ? '...' : stats.todayCancellations}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Turnos Pendientes</span>
              </CardDescription>
              <CardTitle className="text-2xl">
                {statsLoading ? '...' : stats.pendingAppointments}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Pagos Pendientes</span>
              </CardDescription>
              <CardTitle className="text-2xl">
                {statsLoading ? '...' : stats.pendingPayments}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Actions Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-8 w-8 text-orange-600" />
                    <CardTitle>Reservas</CardTitle>
                  </div>
                  <CardDescription>
                    Visualiza y gestiona todas las citas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Ver Calendario
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-8 w-8 text-green-600" />
                    <CardTitle>Servicios</CardTitle>
                  </div>
                  <CardDescription>
                    Crea y gestiona los servicios que ofreces
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Gestionar Servicios
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-purple-600" />
                    <CardTitle>Personal</CardTitle>
                  </div>
                  <CardDescription>
                    Administra tu equipo y sus especialidades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Gestionar Personal
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <CardTitle>Mi Negocio</CardTitle>
                  </div>
                  <CardDescription>
                    Configura datos bancarios y URL personalizada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Configurar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity activities={recentActivity} />
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">URL de tu página de reservas:</h3>
          <code className="text-sm bg-white px-3 py-1 rounded border">
            {window.location.origin}/reservas/{business.booking_url_slug}
          </code>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
