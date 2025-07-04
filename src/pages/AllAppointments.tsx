import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useAppointmentsByStatus } from '@/hooks/useAppointmentsByStatus';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { AppointmentStatus } from '@/types/database';
import BusinessSetup from '@/components/BusinessSetup';
import AppointmentsList from '@/components/AppointmentsList';
import AppointmentForm from '@/components/AppointmentForm';
import AppointmentStatusFilter from '@/components/AppointmentStatusFilter';

const AllAppointments = () => {
  const { user } = useAuth();
  const { business, isLoading: businessLoading } = useBusiness();
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const { 
    appointments, 
    stats, 
    isLoading, 
    refetch 
  } = useAppointmentsByStatus(selectedStatus === 'all' ? undefined : selectedStatus);

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

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAppointment(null);
    refetch();
  };

  if (showForm) {
    return (
      <div className="container py-6">
        <AppointmentForm
          editingAppointment={editingAppointment}
          onClose={handleCloseForm}
        />
      </div>
    );
  }

  const getPageTitle = () => {
    const statusTitles = {
      'all': 'Todas las Citas',
      'pendiente': 'Citas Pendientes',
      'confirmado': 'Citas Confirmadas',
      'completado': 'Citas Completadas',
      'cancelado': 'Citas Canceladas'
    };
    return statusTitles[selectedStatus] || 'Gestión de Citas';
  };

  const getPageDescription = () => {
    const descriptions = {
      'all': 'Gestiona todas las citas de tu negocio',
      'pendiente': 'Citas que requieren confirmación o aprobación de pago',
      'confirmado': 'Citas confirmadas y listas para el servicio',
      'completado': 'Historial de servicios completados',
      'cancelado': 'Citas que fueron canceladas'
    };
    return descriptions[selectedStatus] || '';
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600 mt-1">
            {getPageDescription()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {appointments.length} cita{appointments.length !== 1 ? 's' : ''} encontrada{appointments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      {/* Status Filter */}
      <AppointmentStatusFilter
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        stats={stats}
      />

      {/* Alerts for pending actions */}
      {stats.pendingPaymentApprovals > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <p className="text-amber-800 font-medium">
              Tienes {stats.pendingPaymentApprovals} comprobante{stats.pendingPaymentApprovals !== 1 ? 's' : ''} de pago esperando aprobación
            </p>
          </div>
          <p className="text-amber-700 text-sm mt-1">
            Revisa la sección de pagos pendientes para aprobar o rechazar los comprobantes.
          </p>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {getPageTitle()} ({appointments.length})
          </h2>
        </div>
        
        <AppointmentsList
          appointments={appointments}
          onEdit={handleEditAppointment}
          onRefresh={refetch}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AllAppointments;