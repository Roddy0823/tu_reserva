
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock, User, Phone, Mail, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { StaffMember, Service } from '@/types/database';

interface AppointmentFormProps {
  selectedDate?: Date;
  selectedTime?: string;
  staffMembers: StaffMember[];
  services: Service[];
  onSubmit: (appointmentData: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AppointmentForm = ({
  selectedDate,
  selectedTime,
  staffMembers,
  services,
  onSubmit,
  onCancel,
  isLoading = false
}: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    staff_id: '',
    service_id: '',
    start_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    start_time: selectedTime || '',
    notes: '',
    status: 'confirmado' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear fecha y hora de inicio
    const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
    
    // Encontrar la duración del servicio
    const selectedService = services.find(s => s.id === formData.service_id);
    const duration = selectedService?.duration_minutes || 60;
    
    // Calcular fecha y hora de fin
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + duration);

    const appointmentData = {
      client_name: formData.client_name,
      client_email: formData.client_email,
      client_phone: formData.client_phone,
      staff_id: formData.staff_id,
      service_id: formData.service_id,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      status: formData.status,
      payment_status: 'pendiente' as const
    };

    onSubmit(appointmentData);
  };

  const selectedService = services.find(s => s.id === formData.service_id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Nueva Cita Manual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Información del Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_name">Nombre completo *</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="Nombre del cliente"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client_phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="client_phone"
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      placeholder="+57 300 123 4567"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="client_email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    placeholder="cliente@ejemplo.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Detalles del Servicio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Detalles del Servicio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service_id">Servicio *</Label>
                  <Select value={formData.service_id} onValueChange={(value) => setFormData({ ...formData, service_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.price.toLocaleString()} ({service.duration_minutes} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="staff_id">Profesional *</Label>
                  <Select value={formData.staff_id} onValueChange={(value) => setFormData({ ...formData, staff_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar profesional" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Fecha y Hora */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Fecha y Hora
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Fecha *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="start_time">Hora *</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              {selectedService && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Duración:</strong> {selectedService.duration_minutes} minutos
                    {formData.start_date && formData.start_time && (
                      <>
                        <br />
                        <strong>Hora de finalización:</strong> {format(
                          new Date(new Date(`${formData.start_date}T${formData.start_time}`).getTime() + selectedService.duration_minutes * 60000),
                          'HH:mm'
                        )}
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Notas */}
            <div>
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas sobre la cita..."
                rows={3}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creando...' : 'Crear Cita'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentForm;
