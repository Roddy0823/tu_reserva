
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service } from '@/types/database';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';

interface ServiceSelectionProps {
  services: Service[];
  isLoading: boolean;
  onServiceSelect: (service: Service) => void;
}

const ServiceSelection = ({ services, isLoading, onServiceSelect }: ServiceSelectionProps) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando servicios disponibles...</p>
        </CardContent>
      </Card>
    );
  }

  if (services.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay servicios disponibles</h3>
          <p className="text-gray-600">Este negocio no tiene servicios configurados actualmente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl">Selecciona un Servicio</CardTitle>
        <p className="text-gray-600 text-lg">Elige el servicio que deseas reservar</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="group border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer hover:shadow-md"
              onClick={() => onServiceSelect(service)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-900 mb-2">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-gray-600 leading-relaxed mb-4">{service.description}</p>
                  )}
                </div>
                <div className="ml-4 text-right">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    ${service.price?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">COP</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{service.duration_minutes} minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-medium">${service.price?.toLocaleString()} COP</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 font-medium">
                  <span>Seleccionar</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Los precios mostrados incluyen todos los impuestos
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceSelection;
