
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeBlock, StaffMember } from '@/types/database';
import { X, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const timeBlockSchema = z.object({
  staff_id: z.string().min(1, 'Selecciona un miembro del personal'),
  date: z.string().min(1, 'La fecha es requerida'),
  start_time: z.string().min(1, 'La hora de inicio es requerida'),
  end_time: z.string().min(1, 'La hora de fin es requerida'),
  reason: z.string().optional(),
}).refine((data) => {
  const startTime = data.start_time;
  const endTime = data.end_time;
  return endTime > startTime;
}, {
  message: "La hora de fin debe ser posterior a la hora de inicio",
  path: ["end_time"],
});

type TimeBlockFormData = z.infer<typeof timeBlockSchema>;

interface TimeBlockFormProps {
  timeBlock?: TimeBlock & { staff_members: { full_name: string } };
  staffMembers: StaffMember[];
  selectedStaffId?: string | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TimeBlockForm = ({ timeBlock, staffMembers, selectedStaffId, onSubmit, onCancel, isLoading }: TimeBlockFormProps) => {
  const form = useForm<TimeBlockFormData>({
    resolver: zodResolver(timeBlockSchema),
    defaultValues: {
      staff_id: timeBlock?.staff_id || selectedStaffId || '',
      date: timeBlock?.start_time ? format(new Date(timeBlock.start_time), "yyyy-MM-dd") : '',
      start_time: timeBlock?.start_time ? format(new Date(timeBlock.start_time), "HH:mm") : '',
      end_time: timeBlock?.end_time ? format(new Date(timeBlock.end_time), "HH:mm") : '',
      reason: timeBlock?.reason || '',
    },
  });

  const handleSubmit = (data: TimeBlockFormData) => {
    // Combinar fecha y horas para crear las fechas completas
    const startDateTime = new Date(`${data.date}T${data.start_time}`);
    const endDateTime = new Date(`${data.date}T${data.end_time}`);

    onSubmit({
      staff_id: data.staff_id,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      reason: data.reason || null,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {timeBlock ? 'Editar Excepción' : 'Nueva Excepción de Disponibilidad'}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {timeBlock ? 'Modifica la excepción de disponibilidad' : 'Crea una excepción de disponibilidad para bloquear un horario específico'}
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="staff_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Miembro del Personal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!selectedStaffId}>
                      <FormControl>
                        <SelectTrigger className="border-gray-200 focus:border-gray-400">
                          <SelectValue placeholder="Selecciona un miembro del personal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staffMembers.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Fecha</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="border-gray-200 focus:border-gray-400"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Hora Desde</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          className="border-gray-200 focus:border-gray-400"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Hora Hasta</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          className="border-gray-200 focus:border-gray-400"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Motivo (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ej: Vacaciones, Cita médica, Capacitación..."
                        className="border-gray-200 focus:border-gray-400 resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isLoading ? 'Guardando...' : timeBlock ? 'Actualizar Excepción' : 'Crear Excepción'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeBlockForm;
