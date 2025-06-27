
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import StaffManagement from '@/components/StaffManagement';
import BusinessSetup from '@/components/BusinessSetup';

const Staff = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <StaffManagement />
      </div>
    </div>
  );
};

export default Staff;
