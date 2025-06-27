
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
    { key: 'monday', label: 'Lunes', workKey: 'works_monday', startKey: 'monday_start_time', endKey: 'monday_end_time' },
    { key: 'tuesday', label: 'Martes', workKey: 'works_tuesday', startKey: 'tuesday_start_time', endKey: 'tuesday_end_time' },
    { key: 'wednesday', label: 'Miércoles', workKey: 'works_wednesday', startKey: 'wednesday_start_time', endKey: 'wednesday_end_time' },
    { key: 'thursday', label: 'Jueves', workKey: 'works_thursday', startKey: 'thursday_start_time', endKey: 'thursday_end_time' },
    { key: 'friday', label: 'Viernes', workKey: 'works_friday', startKey: 'friday_start_time', endKey: 'friday_end_time' },
    { key: 'saturday', label: 'Sábado', workKey: 'works_saturday', startKey: 'saturday_start_time', endKey: 'saturday_end_time' },
    { key: 'sunday', label: 'Domingo', workKey: 'works_sunday', startKey: 'sunday_start_time', endKey: 'sunday_end_time' },
  ];

  return (
    <div className="space-y-6">
      {/* Sección de horarios generales (mantenida para compatibilidad) */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Horario Base de Trabajo</h3>
            <p className="text-sm text-gray-600">Horario general que se aplicará por defecto a todos los días</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <FormField
            control={control}
            name="work_start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-blue-900">Hora de Inicio General</FormLabel>
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
                <FormLabel className="text-base font-semibold text-blue-900">Hora de Fin General</FormLabel>
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

      {/* Sección de días de trabajo con horarios específicos */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Horarios Específicos por Día</h3>
            <p className="text-sm text-gray-600">Configura horarios específicos para cada día de la semana</p>
          </div>
        </div>
        
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="space-y-6">
            {weekDays.map((day) => (
              <div key={day.key} className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <FormField
                    control={control}
                    name={day.workKey}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-base font-semibold text-gray-900">
                          {day.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={day.startKey}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Hora de Inicio</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            className="h-10 text-sm border-gray-200 focus:border-green-400"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={day.endKey}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Hora de Fin</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            className="h-10 text-sm border-gray-200 focus:border-green-400"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffWorkSchedule;
