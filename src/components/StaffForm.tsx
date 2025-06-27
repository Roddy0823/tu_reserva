
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StaffMember, Service } from '@/types/database';
import { X, Upload, Camera, User } from 'lucide-react';
import { useStaffServices } from '@/hooks/useStaffServices';
import { useImageUpload } from '@/hooks/useImageUpload';
import FileUpload from '@/components/ui/file-upload';

const staffSchema = z.object({
  full_name: z.string().min(1, 'El nombre completo es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  is_active: z.boolean(),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffFormProps {
  staffMember?: StaffMember;
  services: Service[];
  onSubmit: (data: StaffFormData & { photo_url?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const StaffForm = ({ staffMember, services, onSubmit, onCancel, isLoading }: StaffFormProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(staffMember?.photo_url || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const { getStaffServices, updateStaffServices, isUpdatingServices } = useStaffServices();
  const { uploadImage, deleteImage, isUploading } = useImageUpload();

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
  useEffect(() => {
    if (staffServices && staffServices.length > 0) {
      setSelectedServices(staffServices.map((service: any) => service.id));
    }
  }, [staffServices]);

  const handlePhotoSelect = (file: File) => {
    setPhotoFile(file);
    // Crear URL temporal para preview
    const tempUrl = URL.createObjectURL(file);
    setPhotoUrl(tempUrl);
  };

  const handlePhotoRemove = async () => {
    if (photoUrl && photoUrl.startsWith('http') && staffMember?.photo_url) {
      // Si es una URL real (no temporal), eliminar del storage
      await deleteImage(photoUrl, 'staff');
    }
    setPhotoUrl(null);
    setPhotoFile(null);
  };

  const handleSubmit = async (data: StaffFormData) => {
    let finalPhotoUrl = photoUrl;

    // Si hay un archivo nuevo, subirlo
    if (photoFile) {
      const uploadedUrl = await uploadImage(photoFile, 'staff');
      if (uploadedUrl) {
        finalPhotoUrl = uploadedUrl;
        // Si había una foto anterior, eliminarla
        if (staffMember?.photo_url) {
          await deleteImage(staffMember.photo_url, 'staff');
        }
      }
    }

    // Primero crear/actualizar el miembro del personal
    await onSubmit({
      ...data,
      email: data.email || null,
      photo_url: finalPhotoUrl || null,
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

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">
              {staffMember ? 'Editar Miembro del Personal' : 'Nuevo Miembro del Personal'}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {staffMember ? 'Modifica los datos del miembro del personal' : 'Agrega un nuevo miembro a tu equipo'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sección de foto */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Foto de Perfil</h3>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32 border-4 border-gray-200 shadow-lg">
                      <AvatarImage 
                        src={photoUrl || undefined} 
                        alt="Foto de perfil"
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-semibold">
                        {form.watch('full_name') ? getInitials(form.watch('full_name')) : <User className="h-12 w-12" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <FileUpload
                      onFileSelect={handlePhotoSelect}
                      onFileRemove={handlePhotoRemove}
                      currentImage={photoUrl || undefined}
                      accept="image/*"
                      maxSize={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Sección de datos */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Nombre Completo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Juan Pérez" 
                          className="h-12 text-base"
                          {...field} 
                        />
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
                      <FormLabel className="text-base font-semibold">Email (Opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="juan@ejemplo.com"
                          className="h-12 text-base"
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">Estado Activo</FormLabel>
                        <FormDescription className="text-gray-600">
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
              </div>
            </div>

            {services.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Servicios que puede realizar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={(checked) => 
                          handleServiceToggle(service.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={service.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                      >
                        <div className="font-semibold">{service.name}</div>
                        <div className="text-xs text-gray-500">{service.duration_minutes} min - ${service.price}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onCancel} className="px-8">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || isUpdatingServices || isUploading}
                className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {isLoading || isUpdatingServices || isUploading 
                  ? 'Guardando...' 
                  : staffMember ? 'Actualizar' : 'Agregar'
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StaffForm;
