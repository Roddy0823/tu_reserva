
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClientDetailsProps {
  business: any;
  bookingData: any;
  updateBookingData: (data: any) => void;
}

const ClientDetails = ({ business, bookingData, updateBookingData }: ClientDetailsProps) => {
  const handleInputChange = (field: string, value: string) => {
    updateBookingData({ [field]: value });
  };

  if (!bookingData.time) {
    return <div className="text-center py-4">Primero selecciona un horario.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 space-y-2">
        <div>
          <p className="text-sm text-gray-600">Resumen de tu reserva:</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Servicio:</span>
            <Badge variant="outline">{bookingData.service.name}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Profesional:</span>
            <Badge variant="outline">{bookingData.staff.full_name}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Fecha:</span>
            <Badge variant="outline">
              {format(bookingData.date, 'EEEE, d MMMM yyyy', { locale: es })}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Horario:</span>
            <Badge variant="outline">{bookingData.time}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Precio:</span>
            <Badge variant="secondary">${bookingData.service.price}</Badge>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">Ingresa tus datos personales:</p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="clientName">Nombre completo *</Label>
          <Input
            id="clientName"
            type="text"
            value={bookingData.clientName || ''}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            placeholder="Ingresa tu nombre completo"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="clientEmail">Email *</Label>
          <Input
            id="clientEmail"
            type="email"
            value={bookingData.clientEmail || ''}
            onChange={(e) => handleInputChange('clientEmail', e.target.value)}
            placeholder="tu@email.com"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="clientPhone">Teléfono</Label>
          <Input
            id="clientPhone"
            type="tel"
            value={bookingData.clientPhone || ''}
            onChange={(e) => handleInputChange('clientPhone', e.target.value)}
            placeholder="Tu número de teléfono"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
