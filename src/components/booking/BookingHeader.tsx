
import { Business } from '@/types/database';
import { Building2, Calendar } from 'lucide-react';

interface BookingHeaderProps {
  business: Business;
}

const BookingHeader = ({ business }: BookingHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Reservar Cita
        </h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 inline-block">
          <p className="text-lg font-semibold text-blue-900">
            {business.name}
          </p>
        </div>
        
        <p className="text-gray-600 mt-4 text-sm">
          Completa el proceso de reserva en 5 sencillos pasos
        </p>
      </div>
    </div>
  );
};

export default BookingHeader;
