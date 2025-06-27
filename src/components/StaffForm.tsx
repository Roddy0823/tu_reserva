
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { StaffMember, Service } from '@/types/database';
import { X } from 'lucide-react';
import { useStaffServices } from '@/hooks/useStaffServices';
import { useImageUpload } from '@/hooks/useImageUpload';
import StaffPhotoSection from '@/components/staff/StaffPhotoSection';
import StaffBasicInfo from '@/components/staff/StaffBasicInfo';
import StaffWorkSchedule from '@/components/staff/StaffWorkSchedule';
import StaffServicesSelection from '@/components/staff/StaffServicesSelection';

const staffSchema = z.object({
  full_name: z.string().min(1, 'El nombre completo es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  is_active: z.boolean(),
  work_start_time: z.string().min(1, 'La hora de inicio es requerida'),
  work_end_time: z.string().min(1, 'La hora de fin es requerida'),
  works_monday: z.boolean(),
  works_tuesday: z.boolean(),
  works_wednesday: z.boolean(),
  works_thursday: z.boolean(),
  works_friday: z.boolean(),
  works_saturday: z.boolean(),
  works_sunday: z.boolean(),
}).refine((data) => {
  return data.work_end_time > data.work_start_time;
}, {
  message: "La hora de fin debe ser posterior a la hora de inicio",
  path: ["work_end_time"],
}).refine((data) => {
  return data.works_monday || data.works_tuesday || data.works_wednesday || 
         data.works_thursday || data.works_friday || data.works_saturday || data.works_sunday;
}, {
  message: "Debe seleccionar al menos un día de trabajo",
  path: ["works_monday"],
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
      work_start_time: staffMember?.work_start_time || '08:00',
      work_end_time: staffMember?.work_end_time || '18:00',
      works_monday: staffMember?.works_monday ?? true,
      works_tuesday: staffMember?.works_tuesday ?? true,
      works_wednesday: staffMember?.works_wednesday ?? true,
      works_thursday: staffMember?.works_thursday ?? true,
      works_friday: staffMember?.works_friday ?? true,
      works_saturday: staffMember?.works_saturday ?? false,
      works_sunday: staffMember?.works_sunday ?? false,
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

    // Crear el objeto de datos a enviar
    const submitData = {
      ...data,
      email: data.email || undefined,
      photo_url: finalPhotoUrl || undefined,
    };

    // Enviar los datos
    await onSubmit(submitData);

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
    <Card className="w-full max-w-5xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
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
              <StaffPhotoSection
                photoUrl={photoUrl}
                fullName={form.watch('full_name')}
                onPhotoSelect={handlePhotoSelect}
                onPhotoRemove={handlePhotoRemove}
              />

              {/* Sección de datos básicos */}
              <StaffBasicInfo control={form.control} />
            </div>

            {/* Sección de horarios y días de trabajo */}
            <StaffWorkSchedule control={form.control} />

            {/* Sección de servicios */}
            <StaffServicesSelection
              services={services}
              selectedServices={selectedServices}
              onServiceToggle={handleServiceToggle}
            />

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
