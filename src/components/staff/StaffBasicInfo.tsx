
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Control } from 'react-hook-form';

interface StaffBasicInfoProps {
  control: Control<any>;
}

const StaffBasicInfo = ({ control }: StaffBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
  );
};

export default StaffBasicInfo;
