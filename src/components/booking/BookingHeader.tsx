
import { Business } from '@/types/database';

interface BookingHeaderProps {
  business: Business;
}

const BookingHeader = ({ business }: BookingHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reservar Cita
        </h1>
        <p className="text-lg text-gray-600">
          {business.name}
        </p>
      </div>
    </div>
  );
};

export default BookingHeader;
