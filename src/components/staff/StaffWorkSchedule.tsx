
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Calendar } from 'lucide-react';
import { Control } from 'react-hook-form';

interface StaffWorkScheduleProps {
  control: Control<any>;
}

const StaffWorkSchedule = ({ control }: StaffWorkScheduleProps) => {
  const weekDays = [
    { key: 'works_monday', label: 'Lunes' },
    { key: 'works_tuesday', label: 'Martes' },
    { key: 'works_wednesday', label: 'Miércoles' },
    { key: 'works_thursday', label: 'Jueves' },
    { key: 'works_friday', label: 'Viernes' },
    { key: 'works_saturday', label: 'Sábado' },
    { key: 'works_sunday', label: 'Domingo' },
  ];

  return (
    <div className="space-y-6">
      {/* Sección de horarios de trabajo */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Horario de Trabajo</h3>
            <p className="text-sm text-gray-600">Define el horario laboral disponible para reservas</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <FormField
            control={control}
            name="work_start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-blue-900">Hora de Inicio</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    className="h-12 text-base border-blue-200 focus:border-blue-400"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="work_end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-blue-900">Hora de Fin</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    className="h-12 text-base border-blue-200 focus:border-blue-400"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Sección de días de trabajo */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Días de Trabajo</h3>
            <p className="text-sm text-gray-600">Selecciona los días que trabaja este miembro del personal</p>
          </div>
        </div>
        
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weekDays.map((day) => (
              <FormField
                key={day.key}
                control={control}
                name={day.key}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value as boolean}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium text-green-900">
                      {day.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage className="mt-2" />
        </div>
      </div>
    </div>
  );
};

export default StaffWorkSchedule;
