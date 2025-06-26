
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useTodayAppointments } from '@/hooks/useTodayAppointments';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import BusinessSetup from '@/components/BusinessSetup';
import TodayStatsCards from '@/components/TodayStatsCards';
import AppointmentsList from '@/components/AppointmentsList';
import AppointmentForm from '@/components/AppointmentForm';

const TodayAppointments = () => {
  const { user } = useAuth();
  const { business, isLoading: businessLoading } = useBusiness();
  const { appointments, stats, isLoading, refetch } = useTodayAppointments();
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

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

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
          appointment={editingAppointment}
          onClose={handleCloseForm}
          defaultDate={new Date()}
        />
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Citas de Hoy</h1>
            <p className="text-gray-600 mt-1 capitalize">
              {today}
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <TodayStatsCards stats={stats} />

      {/* Appointments List */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Lista de Citas ({appointments.length})
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

export default TodayAppointments;
