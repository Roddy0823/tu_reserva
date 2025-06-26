
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service } from '@/types/database';
import { Clock, DollarSign } from 'lucide-react';

interface ServiceSelectionProps {
  services: Service[];
  isLoading: boolean;
  onServiceSelect: (service: Service) => void;
}

const ServiceSelection = ({ services, isLoading, onServiceSelect }: ServiceSelectionProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay servicios disponibles</h3>
          <p className="text-gray-600">Este negocio no tiene servicios configurados actualmente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecciona un Servicio</CardTitle>
        <p className="text-gray-600">Elige el servicio que deseas reservar</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => onServiceSelect(service)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <span className="text-2xl font-bold text-blue-600">
                  ${service.price?.toLocaleString()} COP
                </span>
              </div>
              
              {service.description && (
                <p className="text-gray-600 mb-3">{service.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration_minutes} minutos</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${service.price?.toLocaleString()} COP</span>
                </div>
              </div>
              
              <Button className="w-full mt-3" onClick={() => onServiceSelect(service)}>
                Seleccionar Servicio
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceSelection;
