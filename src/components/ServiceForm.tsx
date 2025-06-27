
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/types/database';
import { X, Clock, DollarSign, Calendar, Users, Camera, MessageSquare, CreditCard } from 'lucide-react';
import FileUpload from '@/components/ui/file-upload';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useStaffServices } from '@/hooks/useStaffServices';

const serviceSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  confirmation_message: z.string().optional(),
  duration_minutes: z.number().min(1, 'La duración debe ser mayor a 0'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  accepts_cash: z.boolean(),
  accepts_transfer: z.boolean(),
  min_advance_days: z.number().min(0, 'Los días de anticipación deben ser 0 o más'),
  is_monday_active: z.boolean(),
  is_tuesday_active: z.boolean(),
  is_wednesday_active: z.boolean(),
  is_thursday_active: z.boolean(),
  is_friday_active: z.boolean(),
  is_saturday_active: z.boolean(),
  is_sunday_active: z.boolean(),
  monday_start: z.string().optional(),
  monday_end: z.string().optional(),
  tuesday_start: z.string().optional(),
  tuesday_end: z.string().optional(),
  wednesday_start: z.string().optional(),
  wednesday_end: z.string().optional(),
  thursday_start: z.string().optional(),
  thursday_end: z.string().optional(),
  friday_start: z.string().optional(),
  friday_end: z.string().optional(),
  saturday_start: z.string().optional(),
  saturday_end: z.string().optional(),
  sunday_start: z.string().optional(),
  sunday_end: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: Service;
  onSubmit: (data: ServiceFormData & { image_url?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ServiceForm = ({ service, onSubmit, onCancel, isLoading }: ServiceFormProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(service?.image_url || undefined);
  const { uploadImage, deleteImage, isUploading } = useImageUpload();
  
  // Obtener personal asignado a este servicio específico
  const { getStaffServices } = useStaffServices();
  const staffServicesQuery = service ? getStaffServices(service.id) : null;
  const assignedStaff = staffServicesQuery?.data || [];

  const days = [
    { key: 'monday', label: 'Lunes', active: 'is_monday_active', start: 'monday_start', end: 'monday_end' },
    { key: 'tuesday', label: 'Martes', active: 'is_tuesday_active', start: 'tuesday_start', end: 'tuesday_end' },
    { key: 'wednesday', label: 'Miércoles', active: 'is_wednesday_active', start: 'wednesday_start', end: 'wednesday_end' },
    { key: 'thursday', label: 'Jueves', active: 'is_thursday_active', start: 'thursday_start', end: 'thursday_end' },
    { key: 'friday', label: 'Viernes', active: 'is_friday_active', start: 'friday_start', end: 'friday_end' },
    { key: 'saturday', label: 'Sábado', active: 'is_saturday_active', start: 'saturday_start', end: 'saturday_end' },
    { key: 'sunday', label: 'Domingo', active: 'is_sunday_active', start: 'sunday_start', end: 'sunday_end' },
  ];

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      confirmation_message: service?.confirmation_message || '',
      duration_minutes: service?.duration_minutes || 60,
      price: service?.price || 0,
      accepts_cash: service?.accepts_cash ?? true,
      accepts_transfer: service?.accepts_transfer ?? false,
      min_advance_days: service?.min_advance_days || 1,
      is_monday_active: service?.is_monday_active || false,
      is_tuesday_active: service?.is_tuesday_active || false,
      is_wednesday_active: service?.is_wednesday_active || false,
      is_thursday_active: service?.is_thursday_active || false,
      is_friday_active: service?.is_friday_active || false,
      is_saturday_active: service?.is_saturday_active || false,
      is_sunday_active: service?.is_sunday_active || false,
      monday_start: service?.monday_start || '08:00',
      monday_end: service?.monday_end || '20:00',
      tuesday_start: service?.tuesday_start || '08:00',
      tuesday_end: service?.tuesday_end || '20:00',
      wednesday_start: service?.wednesday_start || '08:00',
      wednesday_end: service?.wednesday_end || '20:00',
      thursday_start: service?.thursday_start || '08:00',
      thursday_end: service?.thursday_end || '20:00',
      friday_start: service?.friday_start || '08:00',
      friday_end: service?.friday_end || '20:00',
      saturday_start: service?.saturday_start || '08:00',
      saturday_end: service?.saturday_end || '20:00',
      sunday_start: service?.sunday_start || '08:00',
      sunday_end: service?.sunday_end || '20:00',
    },
  });

  const handleImageSelect = async (file: File) => {
    const url = await uploadImage(file);
    if (url) {
      setImageUrl(url);
    }
  };

  const handleImageRemove = async () => {
    if (imageUrl) {
      const success = await deleteImage(imageUrl);
      if (success) {
        setImageUrl(undefined);
      }
    }
  };

  const handleSubmit = (data: ServiceFormData) => {
    // Create a clean copy of the data with proper typing
    const cleanedData: Partial<ServiceFormData> = { ...data };
    
    // For each day, if not active, clear the time fields
    days.forEach(day => {
      const isActiveKey = day.active as keyof ServiceFormData;
      const startKey = day.start as keyof ServiceFormData;
      const endKey = day.end as keyof ServiceFormData;
      
      if (!cleanedData[isActiveKey]) {
        // Set to undefined instead of null for inactive days
        delete cleanedData[startKey];
        delete cleanedData[endKey];
      } else {
        // If active but empty, use default values
        if (!cleanedData[startKey]) {
          (cleanedData as any)[startKey] = '08:00';
        }
        if (!cleanedData[endKey]) {
          (cleanedData as any)[endKey] = '20:00';
        }
      }
    });
    
    onSubmit({ ...(cleanedData as ServiceFormData), image_url: imageUrl });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">
                {service ? 'Editar Servicio' : 'Nuevo Servicio'}
              </CardTitle>
              <CardDescription className="text-blue-100 mt-2">
                {service ? 'Modifica los datos del servicio' : 'Crea un nuevo servicio para tu negocio'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-white hover:bg-blue-800">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              
              {/* Información Básica */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                      Información Básica
                    </h3>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Nombre del Servicio</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Corte de cabello" {...field} className="h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Descripción</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe el servicio en detalle..."
                                rows={3}
                                {...field}
                                className="resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmation_message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Mensaje de Confirmación</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Mensaje personalizado que verá el cliente al reservar..."
                                rows={2}
                                {...field}
                                className="resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-blue-600" />
                      Imagen del Servicio
                    </h3>
                    <FileUpload
                      onFileSelect={handleImageSelect}
                      onFileRemove={handleImageRemove}
                      currentImage={imageUrl}
                    />
                  </div>
                </div>
              </div>

              {/* Precio y Duración */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Precio y Duración
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Precio (COP)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Duración (minutos)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="60"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Métodos de Pago Aceptados */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                  Métodos de Pago Aceptados
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accepts_cash"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 border border-gray-200 rounded-lg p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base font-medium">
                            Efectivo/Presencial
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            El cliente paga en efectivo al momento del servicio
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accepts_transfer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 border border-gray-200 rounded-lg p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base font-medium">
                            Transferencia Bancaria
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            El cliente debe transferir antes del servicio
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Configuración de Reservas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Configuración de Reservas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="min_advance_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Días mínimos de anticipación</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Horarios de Disponibilidad */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Horarios de Disponibilidad
                </h3>
                
                <div className="space-y-4">
                  {days.map((day) => (
                    <div key={day.key} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <FormField
                          control={form.control}
                          name={day.active as keyof ServiceFormData}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value as boolean}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-base font-medium">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        {form.watch(day.active as keyof ServiceFormData) && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Activo
                          </Badge>
                        )}
                      </div>
                      
                      {form.watch(day.active as keyof ServiceFormData) && (
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={day.start as keyof ServiceFormData}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Hora de inicio</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="time" 
                                    {...field}
                                    value={field.value as string || '08:00'}
                                    className="h-10"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={day.end as keyof ServiceFormData}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Hora de fin</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="time" 
                                    {...field}
                                    value={field.value as string || '20:00'}
                                    className="h-10"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Asignado - Solo mostrar si hay personal asignado */}
              {service && assignedStaff.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-indigo-600" />
                    Personal Asignado a este Servicio
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 mb-2">Personal que puede realizar este servicio:</p>
                    <div className="flex flex-wrap gap-2">
                      {assignedStaff.map((serviceStaff) => (
                        <Badge key={serviceStaff.id} variant="secondary" className="bg-blue-100 text-blue-800">
                          {serviceStaff.name}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      Para cambiar el personal asignado, ve a la gestión de personal
                    </p>
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={onCancel} className="px-6">
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || isUploading}
                  className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {isLoading || isUploading ? 'Guardando...' : service ? 'Actualizar Servicio' : 'Crear Servicio'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceForm;
