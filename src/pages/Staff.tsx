
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';

const Staff = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { business, isLoading } = useBusiness();

  useEffect(() => {
    // Redirigir a la página de servicios que ahora incluye la gestión de personal
    navigate('/services?tab=staff');
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Staff;
