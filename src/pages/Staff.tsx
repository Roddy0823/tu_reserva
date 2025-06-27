
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import StaffManagement from '@/components/StaffManagement';
import BusinessSetup from '@/components/BusinessSetup';

const Staff = () => {
  const { user } = useAuth();
  const { business, isLoading } = useBusiness();

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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <StaffManagement />
      </div>
    </div>
  );
};

export default Staff;
