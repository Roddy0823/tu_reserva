
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useStaff } from '@/hooks/useStaff';
import { useTimeBlocks } from '@/hooks/useTimeBlocks';
import { ArrowLeft, Clock } from 'lucide-react';

const timeBlockSchema = z.object({
  staff_id: z.string().min(1, 'Selecciona un miembro del personal'),
  start_time: z.string(),
  end_time: z.string(),
  reason: z.string().optional(),
});

type TimeBlockFormData = z.infer<typeof timeBlockSchema>;

interface TimeBlockQuickFormProps {
  selectedSlot: { start: Date; end: Date; staffId?: string } | null;
  onCancel: () => void;
}

const TimeBlockQuickForm = ({ selectedSlot, onCancel }: TimeBlockQuickFormProps) => {
  const { staffMembers } = useStaff();
  const { createTimeBlock, isCreating } = useTimeBlocks();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<TimeBlockFormData>({
    resolver: zodResolver(timeBlockSchema),
    defaultValues: {
      staff_id: selectedSlot?.staffId || '',
      start_time: selectedSlot?.start.toISOString().slice(0, 16) || '',
      end_time: selectedSlot?.end.toISOString().slice(0, 16) || '',
    }
  });

  const onSubmit = (data: TimeBlockFormData) => {
    createTimeBlock({
      staff_id: data.staff_id,
      start_time: new Date(data.start_time).toISOString(),
      end_time: new Date(data.end_time).toISOString(),
      reason: data.reason || null,
    }, {
      onSuccess: () => {
        onCancel();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Calendario
        </Button>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Bloquear Horario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="staff_id">Personal *</Label>
              <Select 
                onValueChange={(value) => setValue('staff_id', value)}
                defaultValue={selectedSlot?.staffId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona personal" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.staff_id && (
                <p className="text-sm text-red-600 mt-1">{errors.staff_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_time">Inicio</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  {...register('start_time')}
                />
              </div>
              <div>
                <Label htmlFor="end_time">Fin</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  {...register('end_time')}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Textarea
                id="reason"
                {...register('reason')}
                placeholder="Ej: Reunión, Descanso, Vacaciones..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? 'Bloqueando...' : 'Bloquear Horario'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeBlockQuickForm;
