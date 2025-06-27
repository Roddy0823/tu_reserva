
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
    const tempUrl = URL.createObjectURL(file);
    setPhotoUrl(tempUrl);
  };

  const handlePhotoRemove = async () => {
    if (photoUrl && photoUrl.startsWith('http') && staffMember?.photo_url) {
      await deleteImage(photoUrl, 'staff');
    }
    setPhotoUrl(null);
    setPhotoFile(null);
  };

  const handleSubmit = async (data: StaffFormData) => {
    let finalPhotoUrl = photoUrl;

    if (photoFile) {
      const uploadedUrl = await uploadImage(photoFile, 'staff');
      if (uploadedUrl) {
        finalPhotoUrl = uploadedUrl;
        if (staffMember?.photo_url) {
          await deleteImage(staffMember.photo_url, 'staff');
        }
      }
    }

    const submitData = {
      ...data,
      email: data.email || undefined,
      photo_url: finalPhotoUrl || undefined,
    };

    await onSubmit(submitData);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Apple-style Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              {staffMember ? 'Editar Miembro del Personal' : 'Nuevo Miembro del Personal'}
            </h1>
            <p className="text-gray-500 mt-1 text-lg">
              {staffMember ? 'Actualiza la información del miembro del equipo' : 'Agrega un nuevo miembro a tu equipo'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            onClick={onCancel} 
            className="h-10 w-10 p-0 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Clean Card */}
        <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-12">
                {/* Photo Section */}
                <div className="pb-8 border-b border-gray-100">
                  <StaffPhotoSection
                    photoUrl={photoUrl}
                    fullName={form.watch('full_name')}
                    onPhotoSelect={handlePhotoSelect}
                    onPhotoRemove={handlePhotoRemove}
                  />
                </div>

                {/* Basic Info Section */}
                <div className="pb-8 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
                  <StaffBasicInfo control={form.control} />
                </div>

                {/* Work Schedule Section */}
                <div className="pb-8 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Horario de Trabajo</h2>
                  <StaffWorkSchedule control={form.control} />
                </div>

                {/* Services Section */}
                <div className="pb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Servicios</h2>
                  <StaffServicesSelection
                    services={services}
                    selectedServices={selectedServices}
                    onServiceToggle={handleServiceToggle}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-100">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={onCancel} 
                    className="px-8 h-11 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading || isUpdatingServices || isUploading}
                    className="px-8 h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm font-medium"
                  >
                    {isLoading || isUpdatingServices || isUploading 
                      ? 'Guardando...' 
                      : staffMember ? 'Actualizar Miembro' : 'Agregar Miembro'
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffForm;
