
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service } from '@/types/database';
import { Clock, ArrowRight } from 'lucide-react';

interface ServiceSelectionProps {
  services: Service[];
  isLoading: boolean;
  onServiceSelect: (service: Service) => void;
}

const ServiceSelection = ({ services, isLoading, onServiceSelect }: ServiceSelectionProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando servicios disponibles...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay servicios disponibles</h3>
        <p className="text-gray-600">Este negocio no tiene servicios configurados actualmente.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Selecciona un Servicio</h2>
        <p className="text-gray-600">Elige el servicio que deseas reservar</p>
      </div>
      
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="group border border-gray-200 rounded-lg p-6 hover:border-gray-900 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => onServiceSelect(service)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-900 mb-2">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="text-gray-600 leading-relaxed mb-3">{service.description}</p>
                )}
              </div>
              <div className="ml-6 text-right">
                <div className="text-xl font-semibold text-gray-900 mb-1">
                  ${service.price?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">COP</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{service.duration_minutes} minutos</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-900 group-hover:text-gray-900 font-medium">
                <span>Seleccionar</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
