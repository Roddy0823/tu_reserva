
import { useParams } from 'react-router-dom';
import BookingFlow from '@/components/BookingFlow';

const BookingPublic = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  if (!businessSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">URL no válida</h1>
          <p className="text-gray-600">La URL de reserva no es válida.</p>
        </div>
      </div>
    );
  }

  return <BookingFlow businessSlug={businessSlug} />;
};

export default BookingPublic;
