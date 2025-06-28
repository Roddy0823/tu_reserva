import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useCompletedAppointments } from '@/hooks/useCompletedAppointments';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Filter, DollarSign, User, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import BusinessSetup from '@/components/BusinessSetup';

const CompletedAppointments = () => {
  const { user } = useAuth();
  const { business, isLoading: businessLoading } = useBusiness();
  const { appointments, stats, isLoading } = useCompletedAppointments();
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');

  // Habilitar suscripciones en tiempo real
  useRealtimeSubscriptions();

  if (businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return <BusinessSetup />;
  }

  // Get unique staff members for filter
  const staffMembers = Array.from(
    new Set(appointments.map(apt => apt.staff_members.full_name))
  );

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.services.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const appointmentDate = new Date(appointment.start_time);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let matchesTime = true;
    switch (timeFilter) {
      case 'today':
        matchesTime = appointmentDate >= startOfToday;
        break;
      case 'week':
        matchesTime = appointmentDate >= startOfWeek;
        break;
      case 'month':
        matchesTime = appointmentDate >= startOfMonth;
        break;
    }

    const matchesStaff = staffFilter === 'all' || appointment.staff_members.full_name === staffFilter;

    return matchesSearch && matchesTime && matchesStaff;
  });

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando citas completadas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Citas Completadas</h1>
        </div>
        <p className="text-gray-600">
          Historial completo de servicios realizados
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.thisMonthRevenue.toLocaleString()} en ingresos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Cita</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.total > 0 ? Math.round(stats.totalRevenue / stats.total).toLocaleString() : '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente, email o servicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo el tiempo</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                </SelectContent>
              </Select>

              <Select value={staffFilter} onValueChange={setStaffFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Personal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo el personal</SelectItem>
                  {staffMembers.map(staff => (
                    <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>
              Mostrando {filteredAppointments.length} de {appointments.length} citas completadas
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <CheckCircle className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {appointments.length === 0 ? 'No hay citas completadas' : 'No se encontraron citas'}
              </h3>
              <p className="text-gray-500">
                {appointments.length === 0 
                  ? 'Las citas completadas aparecerán aquí cuando marques servicios como completados' 
                  : 'Intenta ajustar los filtros de búsqueda'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{appointment.client_name}</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Completada
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.services.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        ${appointment.services.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.services.duration_minutes} min
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{appointment.staff_members.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>
                        {format(new Date(appointment.start_time), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{appointment.client_email}</span>
                    </div>
                  </div>

                  {appointment.client_phone && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Teléfono:</strong> {appointment.client_phone}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedAppointments;
