import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useServices } from '@/hooks/useServices';
import { useStaff } from '@/hooks/useStaff';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';
import { useAvailableTimeSlots } from '@/hooks/useAvailableTimeSlots';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/types/database';

const appointmentSchema = z.object({
  client_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  client_email: z.string().email('Email inválido'),
  client_phone: z.string().optional(),
  service_id: z.string().min(1, 'Selecciona un servicio'),
  staff_id: z.string().min(1, 'Selecciona un miembro del personal'),
  date: z.date(),
  time: z.string().min(1, 'Selecciona una hora'),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  editingAppointment?: Appointment | null;
  onClose: () => void;
  defaultDate?: Date;
}

const AppointmentForm = ({ editingAppointment, onClose, defaultDate }: AppointmentFormProps) => {
  const { toast } = useToast();
  const { services } = useServices();
  const { staffMembers } = useStaff();
  const { createAppointment, isCreating } = useCreateAppointment();
  
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate || new Date());
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

  const selectedService = services.find(s => s.id === selectedServiceId);

  const { availableSlots } = useAvailableTimeSlots(
    selectedStaffId,
    selectedDate,
    selectedService?.duration_minutes
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: selectedDate,
    }
  });

  // Load editing appointment data
  useEffect(() => {
    if (editingAppointment) {
      const startTime = new Date(editingAppointment.start_time);
      const timeString = format(startTime, 'HH:mm');
      
      reset({
        client_name: editingAppointment.client_name,
        client_email: editingAppointment.client_email,
        client_phone: editingAppointment.client_phone || '',
        service_id: editingAppointment.service_id,
        staff_id: editingAppointment.staff_id,
        date: startTime,
        time: timeString,
      });
      
      setSelectedDate(startTime);
      setSelectedServiceId(editingAppointment.service_id);
      setSelectedStaffId(editingAppointment.staff_id);
    }
  }, [editingAppointment, reset]);

  const onSubmit = async (data: AppointmentFormData) => {
    if (!selectedService) {
      toast({
        title: "Error",
        description: "Por favor selecciona un servicio",
        variant: "destructive",
      });
      return;
    }

    try {
      const [hours, minutes] = data.time.split(':').map(Number);
      const startTime = new Date(data.date);
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + selectedService.duration_minutes);

      const appointmentData = {
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone || null,
        service_id: data.service_id,
        staff_id: data.staff_id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'pendiente' as const,
      };

      await createAppointment(appointmentData);
      
      toast({
        title: editingAppointment ? "Cita actualizada" : "Cita creada",
        description: editingAppointment ? "La cita se ha actualizado correctamente" : "La cita se ha creado correctamente",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">
          {editingAppointment ? 'Editar Cita' : 'Nueva Cita'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Cita</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Nombre del Cliente *</Label>
                <Input
                  id="client_name"
                  {...register('client_name')}
                  placeholder="Nombre completo"
                />
                {errors.client_name && (
                  <p className="text-sm text-red-600">{errors.client_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_email">Email *</Label>
                <Input
                  id="client_email"
                  type="email"
                  {...register('client_email')}
                  placeholder="email@ejemplo.com"
                />
                {errors.client_email && (
                  <p className="text-sm text-red-600">{errors.client_email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_phone">Teléfono</Label>
              <Input
                id="client_phone"
                {...register('client_phone')}
                placeholder="Número de teléfono (opcional)"
              />
            </div>

            {/* Service Selection */}
            <div className="space-y-2">
              <Label>Servicio *</Label>
              <Select
                value={selectedServiceId}
                onValueChange={(value) => {
                  setSelectedServiceId(value);
                  setValue('service_id', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price} ({service.duration_minutes} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.service_id && (
                <p className="text-sm text-red-600">{errors.service_id.message}</p>
              )}
            </div>

            {/* Staff Selection */}
            <div className="space-y-2">
              <Label>Personal *</Label>
              <Select
                value={selectedStaffId}
                onValueChange={(value) => {
                  setSelectedStaffId(value);
                  setValue('staff_id', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un miembro del personal" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.staff_id && (
                <p className="text-sm text-red-600">{errors.staff_id.message}</p>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Fecha *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setValue('date', date);
                      }
                    }}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            {/* Time Selection */}
            {selectedServiceId && selectedStaffId && (
              <div className="space-y-2">
                <Label>Hora *</Label>
                <Select
                  value={watch('time')}
                  onValueChange={(value) => setValue('time', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && (
                  <p className="text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            )}

            {/* Summary */}
            {selectedService && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Resumen de la Cita</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Servicio:</strong> {selectedService.name}</p>
                  <p><strong>Duración:</strong> {selectedService.duration_minutes} minutos</p>
                  <p><strong>Precio:</strong> ${selectedService.price}</p>
                  {selectedDate && watch('time') && (
                    <p><strong>Fecha y Hora:</strong> {format(selectedDate, "PPP", { locale: es })} a las {watch('time')}</p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1"
              >
                {isCreating ? 'Guardando...' : editingAppointment ? 'Actualizar Cita' : 'Crear Cita'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentForm;
