
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import ServicesAndStaffManagement from '@/components/ServicesAndStaffManagement';
import BusinessSetup from '@/components/BusinessSetup';

const Services = () => {
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

  return <ServicesAndStaffManagement />;
};

export default Services;
