import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import AppointmentCard from './AppointmentCard';
import { Appointment } from '@/types/database';

interface AppointmentsListProps {
  appointments: (Appointment & { 
    staff_members: { full_name: string }, 
    services: { name: string, duration_minutes: number, price: number } 
  })[];
  onEdit?: (appointment: any) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const AppointmentsList = ({ appointments, onEdit, onRefresh, isLoading }: AppointmentsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');

  // Habilitar suscripciones en tiempo real
  useRealtimeSubscriptions();

  // Get unique staff members for filter - with safety check
  const staffMembers = Array.from(
    new Set(appointments
      .filter(apt => apt.staff_members?.full_name)
      .map(apt => apt.staff_members.full_name)
    )
  );

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.services?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesStaff = staffFilter === 'all' || appointment.staff_members?.full_name === staffFilter;

    return matchesSearch && matchesStatus && matchesStaff;
  });

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Filtros responsivos */}
      <div className="bg-card p-4 sm:p-6 rounded-lg border shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por cliente, email o servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 sm:h-11"
            />
          </div>
          
          {/* Filtros en grid responsivo */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 sm:h-11 text-sm">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmado">Confirmada</SelectItem>
                <SelectItem value="completado">Completada</SelectItem>
                <SelectItem value="cancelado">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={staffFilter} onValueChange={setStaffFilter}>
              <SelectTrigger className="h-10 sm:h-11 text-sm">
                <SelectValue placeholder="Personal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el personal</SelectItem>
                {staffMembers.map(staff => (
                  <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="h-10 sm:h-11 col-span-2 sm:col-span-1"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''} sm:mr-2`} />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
            )}
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Mostrando {filteredAppointments.length} de {appointments.length} citas
            </span>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="text-gray-400 mb-2">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {appointments.length === 0 ? 'No hay citas programadas' : 'No se encontraron citas'}
            </h3>
            <p className="text-gray-500">
              {appointments.length === 0 
                ? 'Las citas aparecerán aquí cuando los clientes hagan reservas' 
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;
