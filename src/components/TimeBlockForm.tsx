
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
import { X } from 'lucide-react';
import { format } from 'date-fns';

const timeBlockSchema = z.object({
  staff_id: z.string().min(1, 'Selecciona un miembro del personal'),
  start_time: z.string().min(1, 'La fecha y hora de inicio es requerida'),
  end_time: z.string().min(1, 'La fecha y hora de fin es requerida'),
  reason: z.string().optional(),
}).refine((data) => {
  const startTime = new Date(data.start_time);
  const endTime = new Date(data.end_time);
  return endTime > startTime;
}, {
  message: "La hora de fin debe ser posterior a la hora de inicio",
  path: ["end_time"],
});

type TimeBlockFormData = z.infer<typeof timeBlockSchema>;

interface TimeBlockFormProps {
  timeBlock?: TimeBlock & { staff_members: { full_name: string } };
  staffMembers: StaffMember[];
  onSubmit: (data: TimeBlockFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TimeBlockForm = ({ timeBlock, staffMembers, onSubmit, onCancel, isLoading }: TimeBlockFormProps) => {
  const form = useForm<TimeBlockFormData>({
    resolver: zodResolver(timeBlockSchema),
    defaultValues: {
      staff_id: timeBlock?.staff_id || '',
      start_time: timeBlock?.start_time ? format(new Date(timeBlock.start_time), "yyyy-MM-dd'T'HH:mm") : '',
      end_time: timeBlock?.end_time ? format(new Date(timeBlock.end_time), "yyyy-MM-dd'T'HH:mm") : '',
      reason: timeBlock?.reason || '',
    },
  });

  const handleSubmit = (data: TimeBlockFormData) => {
    onSubmit({
      ...data,
      start_time: new Date(data.start_time).toISOString(),
      end_time: new Date(data.end_time).toISOString(),
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{timeBlock ? 'Editar Bloqueo de Horario' : 'Nuevo Bloqueo de Horario'}</CardTitle>
            <CardDescription>
              {timeBlock ? 'Modifica el bloqueo de horario' : 'Bloquea un rango de fecha y hora para un miembro del personal'}
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
              name="staff_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miembro del Personal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha y Hora de Inicio</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
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
                    <FormLabel>Fecha y Hora de Fin</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
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
                  <FormLabel>Motivo (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ej: Vacaciones, Cita médica, Capacitación..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : timeBlock ? 'Actualizar' : 'Crear Bloqueo'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TimeBlockForm;
