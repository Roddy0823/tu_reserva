
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const appointmentSchema = z.object({
  client_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  client_email: z.string().email('Email inválido'),
  client_phone: z.string().optional(),
  service_id: z.string().min(1, 'Selecciona un servicio'),
  staff_id: z.string().min(1, 'Selecciona un miembro del personal'),
  start_time: z.string(),
  end_time: z.string(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  selectedSlot: { start: Date; end: Date; staffId?: string } | null;
  onCancel: () => void;
}

const AppointmentForm = ({ selectedSlot, onCancel }: AppointmentFormProps) => {
  const { staffMembers } = useStaff();
  const { services } = useServices();
  const { createAppointment, isCreating } = useCreateAppointment();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      staff_id: selectedSlot?.staffId || '',
      start_time: selectedSlot?.start.toISOString() || '',
      end_time: selectedSlot?.end.toISOString() || '',
    }
  });

  const selectedServiceId = watch('service_id');
  const selectedService = services.find(s => s.id === selectedServiceId);

  // Actualizar hora de fin cuando se selecciona un servicio
  React.useEffect(() => {
    if (selectedService && selectedSlot) {
      const newEndTime = new Date(selectedSlot.start.getTime() + selectedService.duration_minutes * 60000);
      setValue('end_time', newEndTime.toISOString());
    }
  }, [selectedService, selectedSlot, setValue]);

  const onSubmit = (data: AppointmentFormData) => {
    createAppointment({
      client_name: data.client_name,
      client_email: data.client_email,
      client_phone: data.client_phone || null,
      service_id: data.service_id,
      staff_id: data.staff_id,
      start_time: data.start_time,
      end_time: data.end_time,
      status: 'confirmado',
      business_id: '', // Se manejará automáticamente
    }, {
      onSuccess: () => {
        onCancel();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Calendario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Nueva Cita Manual
          </CardTitle>
          {selectedSlot && (
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(selectedSlot.start, "dd 'de' MMMM 'de' yyyy", { locale: es })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {format(selectedSlot.start, 'HH:mm')} - {format(selectedSlot.end, 'HH:mm')}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Cliente
                </h3>
                
                <div>
                  <Label htmlFor="client_name">Nombre completo *</Label>
                  <Input
                    id="client_name"
                    {...register('client_name')}
                    placeholder="Ej: Juan Pérez"
                  />
                  {errors.client_name && (
                    <p className="text-sm text-red-600 mt-1">{errors.client_name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="client_email">Email *</Label>
                  <Input
                    id="client_email"
                    type="email"
                    {...register('client_email')}
                    placeholder="juan@ejemplo.com"
                  />
                  {errors.client_email && (
                    <p className="text-sm text-red-600 mt-1">{errors.client_email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="client_phone">Teléfono</Label>
                  <Input
                    id="client_phone"
                    {...register('client_phone')}
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Detalles de la Cita</h3>

                <div>
                  <Label htmlFor="service_id">Servicio *</Label>
                  <Select onValueChange={(value) => setValue('service_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.duration_minutes}min - ${service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service_id && (
                    <p className="text-sm text-red-600 mt-1">{errors.service_id.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="staff_id">Personal *</Label>
                  <Select 
                    onValueChange={(value) => setValue('staff_id', value)}
                    defaultValue={selectedSlot?.staffId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona personal" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.staff_id && (
                    <p className="text-sm text-red-600 mt-1">{errors.staff_id.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">Hora inicio</Label>
                    <Input
                      id="start_time"
                      type="datetime-local"
                      {...register('start_time')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_time">Hora fin</Label>
                    <Input
                      id="end_time"
                      type="datetime-local"
                      {...register('end_time')}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? 'Creando...' : 'Crear Cita'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentForm;
