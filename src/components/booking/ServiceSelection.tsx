
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Service, Business } from '@/types/database';

interface ServiceSelectionProps {
  business: Business;
  bookingData: any;
  updateBookingData: (data: any) => void;
}

const ServiceSelection = ({ business, bookingData, updateBookingData }: ServiceSelectionProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', business.id)
          .order('name');

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [business.id]);

  const handleServiceSelect = (service: Service) => {
    updateBookingData({ service, staff: undefined, date: undefined, time: undefined });
  };

  if (loading) {
    return <div className="text-center py-4">Cargando servicios...</div>;
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hay servicios disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Selecciona el servicio que deseas reservar:</p>
      
      <div className="grid gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              bookingData.service?.id === service.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
            onClick={() => handleServiceSelect(service)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <Badge variant="secondary">${service.price}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {service.description && (
                <CardDescription className="mb-2">{service.description}</CardDescription>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <span>Duración: {service.duration_minutes} minutos</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
