
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
        <StaffManagement />
      </div>
    </div>
  );
};

export default Staff;
