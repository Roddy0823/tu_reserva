
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import ServicesAndStaffManagement from '@/components/ServicesAndStaffManagement';
import BusinessSetup from '@/components/BusinessSetup';

const Services = () => {
  const { user } = useAuth();
  const { business, isLoading } = useBusiness();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return <BusinessSetup />;
  }

  return <ServicesAndStaffManagement />;
};

export default Services;
