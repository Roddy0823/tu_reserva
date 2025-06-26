
import { useState, useEffect } from 'react';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingRulesSettingsProps {
  business: any;
}

const BookingRulesSettings = ({ business }: BookingRulesSettingsProps) => {
  const { settings, updateSettings, isLoading, isUpdating } = useBusinessSettings(business.id);
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    min_advance_hours: 2,
    max_advance_days: 30,
    allow_same_day_booking: true,
    cancellation_policy: 'flexible',
    cancellation_hours: 24,
    require_confirmation: true,
    auto_confirm_bookings: false,
    cancellation_policy_text: '',
  });

  // Sincronizar datos de configuración con el estado del formulario
  useEffect(() => {
    if (settings) {
      const newFormData = {
        min_advance_hours: settings.min_advance_hours || 2,
        max_advance_days: settings.max_advance_days || 30,
        allow_same_day_booking: settings.allow_same_day_booking ?? true,
        cancellation_policy: settings.cancellation_policy || 'flexible',
        cancellation_hours: settings.cancellation_hours || 24,
        require_confirmation: settings.require_confirmation ?? true,
        auto_confirm_bookings: settings.auto_confirm_bookings ?? false,
        cancellation_policy_text: settings.cancellation_policy_text || '',
      };
      setFormData(newFormData);
      setHasChanges(false);
    }
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Verificar si hay cambios comparando con los datos originales
      const hasAnyChanges = Object.keys(newData).some(key => {
        const currentValue = newData[key as keyof typeof newData];
        const originalValue = settings?.[key as keyof typeof settings];
        return currentValue !== originalValue;
      });
      setHasChanges(hasAnyChanges);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      toast({
        title: "Sin cambios",
        description: "No hay cambios para guardar",
      });
      return;
    }

    try {
      await updateSettings(formData);
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Reglas de Reserva
        </CardTitle>
        <CardDescription>
          Define las reglas y políticas para las reservas de tu negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="min-advance" className="text-sm font-medium">
                Tiempo Mínimo de Antelación (horas)
              </Label>
              <Input
                id="min-advance"
                type="number"
                min="0"
                value={formData.min_advance_hours}
                onChange={(e) => handleInputChange('min_advance_hours', parseInt(e.target.value) || 0)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                Horas mínimas que deben pasar antes de una cita
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-advance" className="text-sm font-medium">
                Máximo de Días por Adelantado
              </Label>
              <Input
                id="max-advance"
                type="number"
                min="1"
                value={formData.max_advance_days}
                onChange={(e) => handleInputChange('max_advance_days', parseInt(e.target.value) || 30)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                Días máximos que se pueden reservar por adelantado
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Permitir Reservas el Mismo Día</Label>
                <p className="text-sm text-gray-500">
                  Los clientes pueden reservar citas para el mismo día
                </p>
              </div>
              <Switch
                checked={formData.allow_same_day_booking}
                onCheckedChange={(checked) => handleInputChange('allow_same_day_booking', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Requerir Confirmación Manual</Label>
                <p className="text-sm text-gray-500">
                  Las reservas necesitarán tu confirmación antes de ser definitivas
                </p>
              </div>
              <Switch
                checked={formData.require_confirmation}
                onCheckedChange={(checked) => handleInputChange('require_confirmation', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Auto-confirmar Reservas</Label>
                <p className="text-sm text-gray-500">
                  Las reservas se confirman automáticamente sin intervención manual
                </p>
              </div>
              <Switch
                checked={formData.auto_confirm_bookings}
                onCheckedChange={(checked) => handleInputChange('auto_confirm_bookings', checked)}
              />
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900">Política de Cancelación</h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de Política</Label>
                <Select
                  value={formData.cancellation_policy}
                  onValueChange={(value) => handleInputChange('cancellation_policy', value)}
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Selecciona una política" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible - Sin penalización</SelectItem>
                    <SelectItem value="moderate">Moderada - 24h de antelación</SelectItem>
                    <SelectItem value="strict">Estricta - 48h de antelación</SelectItem>
                    <SelectItem value="custom">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancel-hours" className="text-sm font-medium">
                  Horas Mínimas para Cancelar sin Penalización
                </Label>
                <Input
                  id="cancel-hours"
                  type="number"
                  min="0"
                  value={formData.cancellation_hours}
                  onChange={(e) => handleInputChange('cancellation_hours', parseInt(e.target.value) || 0)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="policy-text" className="text-sm font-medium">
                  Texto de Política de Cancelación
                </Label>
                <Textarea
                  id="policy-text"
                  value={formData.cancellation_policy_text}
                  onChange={(e) => handleInputChange('cancellation_policy_text', e.target.value)}
                  placeholder="Describe tu política de cancelación en detalle..."
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {hasChanges && (
                <div className="flex items-center gap-2 text-amber-600">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Cambios sin guardar</span>
                </div>
              )}
              {!hasChanges && !isUpdating && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Todo guardado</span>
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={isUpdating || !hasChanges}
              className="min-w-[120px] transition-all duration-200"
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </div>
              ) : (
                "Guardar Configuración"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingRulesSettings;
