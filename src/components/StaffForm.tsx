
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { StaffMember, Service } from '@/types/database';
import { X } from 'lucide-react';
import { useStaffServices } from '@/hooks/useStaffServices';

const staffSchema = z.object({
  full_name: z.string().min(1, 'El nombre completo es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  is_active: z.boolean(),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffFormProps {
  staffMember?: StaffMember;
  services: Service[];
  onSubmit: (data: StaffFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const StaffForm = ({ staffMember, services, onSubmit, onCancel, isLoading }: StaffFormProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { getStaffServices, updateStaffServices, isUpdatingServices } = useStaffServices();

  // Obtener servicios del miembro del personal si está editando
  const { data: staffServices } = staffMember ? getStaffServices(staffMember.id) : { data: [] };

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      full_name: staffMember?.full_name || '',
      email: staffMember?.email || '',
      is_active: staffMember?.is_active ?? true,
    },
  });

  // Establecer servicios seleccionados cuando se cargan
  useState(() => {
    if (staffServices && staffServices.length > 0) {
      setSelectedServices(staffServices.map((service: any) => service.id));
    }
  }, [staffServices]);

  const handleSubmit = async (data: StaffFormData) => {
    // Primero crear/actualizar el miembro del personal
    await onSubmit({
      ...data,
      email: data.email || null,
    });

    // Si está editando y hay servicios seleccionados, actualizar las asociaciones
    if (staffMember && selectedServices.length >= 0) {
      updateStaffServices({
        staffId: staffMember.id,
        serviceIds: selectedServices,
      });
    }
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{staffMember ? 'Editar Miembro del Personal' : 'Nuevo Miembro del Personal'}</CardTitle>
            <CardDescription>
              {staffMember ? 'Modifica los datos del miembro del personal' : 'Agrega un nuevo miembro a tu equipo'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="juan@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Estado Activo</FormLabel>
                    <FormDescription>
                      Los miembros activos pueden recibir citas
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {services.length > 0 && (
              <div className="space-y-3">
                <FormLabel className="text-base">Servicios que puede realizar</FormLabel>
                <div className="grid grid-cols-1 gap-3">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => 
                          handleServiceToggle(service.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={service.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {service.name} - {service.duration_minutes} min - ${service.price}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || isUpdatingServices}>
                {isLoading || isUpdatingServices ? 'Guardando...' : staffMember ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StaffForm;
