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
  monday_start_time: z.string().optional(),
  monday_end_time: z.string().optional(),
  tuesday_start_time: z.string().optional(),
  tuesday_end_time: z.string().optional(),
  wednesday_start_time: z.string().optional(),
  wednesday_end_time: z.string().optional(),
  thursday_start_time: z.string().optional(),
  thursday_end_time: z.string().optional(),
  friday_start_time: z.string().optional(),
  friday_end_time: z.string().optional(),
  saturday_start_time: z.string().optional(),
  saturday_end_time: z.string().optional(),
  sunday_start_time: z.string().optional(),
  sunday_end_time: z.string().optional(),
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
      monday_start_time: staffMember?.monday_start_time || '08:00',
      monday_end_time: staffMember?.monday_end_time || '18:00',
      tuesday_start_time: staffMember?.tuesday_start_time || '08:00',
      tuesday_end_time: staffMember?.tuesday_end_time || '18:00',
      wednesday_start_time: staffMember?.wednesday_start_time || '08:00',
      wednesday_end_time: staffMember?.wednesday_end_time || '18:00',
      thursday_start_time: staffMember?.thursday_start_time || '08:00',
      thursday_end_time: staffMember?.thursday_end_time || '18:00',
      friday_start_time: staffMember?.friday_start_time || '08:00',
      friday_end_time: staffMember?.friday_end_time || '18:00',
      saturday_start_time: staffMember?.saturday_start_time || '08:00',
      saturday_end_time: staffMember?.saturday_end_time || '18:00',
      sunday_start_time: staffMember?.sunday_start_time || '08:00',
      sunday_end_time: staffMember?.sunday_end_time || '18:00',
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
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <Card className="w-full shadow-xl border-0 bg-gradient-to-br from-card to-card-subtle">
        <CardHeader className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground rounded-t-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl sm:text-2xl font-bold">
                {staffMember ? 'Editar Personal' : 'Nuevo Personal'}
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 text-sm sm:text-base">
                {staffMember ? 'Modifica los datos del miembro del personal' : 'Agrega un nuevo miembro a tu equipo'}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel} 
              className="text-primary-foreground hover:bg-white/20 self-start sm:self-center"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 sm:space-y-8">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
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

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4 pt-6 border-t border-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  className="w-full sm:w-auto px-6 sm:px-8"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || isUpdatingServices || isUploading}
                  className="w-full sm:w-auto px-6 sm:px-8 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary"
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
    </div>
  );
};

export default StaffForm;
