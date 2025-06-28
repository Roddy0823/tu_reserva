
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import BookingFlow from '@/components/BookingFlow';

const BookingPublic = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  // Optimización para móviles - prevenir zoom en inputs
  useEffect(() => {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    } else {
      const newViewport = document.createElement('meta');
      newViewport.name = 'viewport';
      newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(newViewport);
    }

    // Limpiar al desmontar
    return () => {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);
  
  if (!businessSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">URL no válida</h1>
          <p className="text-gray-600 text-lg">La URL de reserva no es válida o ha expirado.</p>
          <p className="text-gray-500 text-sm mt-2">Contacta con el negocio para obtener un enlace actualizado.</p>
        </div>
      </div>
    );
  }

  return <BookingFlow businessSlug={businessSlug} />;
};

export default BookingPublic;
