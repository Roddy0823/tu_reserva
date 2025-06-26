
import { useState } from 'react';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface BookingRulesSettingsProps {
  business: any;
}

const BookingRulesSettings = ({ business }: BookingRulesSettingsProps) => {
  const { settings, updateSettings, isLoading, isUpdating } = useBusinessSettings(business.id);
  const [formData, setFormData] = useState({
    min_advance_hours: settings?.min_advance_hours || 2,
    max_advance_days: settings?.max_advance_days || 30,
    allow_same_day_booking: settings?.allow_same_day_booking ?? true,
    cancellation_policy: settings?.cancellation_policy || 'flexible',
    cancellation_hours: settings?.cancellation_hours || 24,
    require_confirmation: settings?.require_confirmation ?? true,
    auto_confirm_bookings: settings?.auto_confirm_bookings ?? false,
    cancellation_policy_text: settings?.cancellation_policy_text || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
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
        <CardTitle>Reglas de Reserva</CardTitle>
        <CardDescription>
          Define las reglas y políticas para las reservas de tu negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-advance">Tiempo Mínimo de Antelación (horas)</Label>
              <Input
                id="min-advance"
                type="number"
                min="0"
                value={formData.min_advance_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, min_advance_hours: parseInt(e.target.value) || 0 }))}
              />
              <p className="text-xs text-gray-500">
                Horas mínimas que deben pasar antes de una cita
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-advance">Máximo de Días por Adelantado</Label>
              <Input
                id="max-advance"
                type="number"
                min="1"
                value={formData.max_advance_days}
                onChange={(e) => setFormData(prev => ({ ...prev, max_advance_days: parseInt(e.target.value) || 30 }))}
              />
              <p className="text-xs text-gray-500">
                Días máximos que se pueden reservar por adelantado
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Permitir Reservas el Mismo Día</Label>
              <p className="text-sm text-gray-500">
                Los clientes pueden reservar citas para el mismo día
              </p>
            </div>
            <Switch
              checked={formData.allow_same_day_booking}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allow_same_day_booking: checked }))}
            />
          </div>

          <div className="space-y-4">
            <Label>Política de Cancelación</Label>
            <Select
              value={formData.cancellation_policy}
              onValueChange={(value) => setFormData(prev => ({ ...prev, cancellation_policy: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una política" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Flexible - Sin penalización</SelectItem>
                <SelectItem value="moderate">Moderada - 24h de antelación</SelectItem>
                <SelectItem value="strict">Estricta - 48h de antelación</SelectItem>
                <SelectItem value="custom">Personalizada</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Label htmlFor="cancel-hours">Horas Mínimas para Cancelar sin Penalización</Label>
              <Input
                id="cancel-hours"
                type="number"
                min="0"
                value={formData.cancellation_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, cancellation_hours: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-text">Texto de Política de Cancelación</Label>
              <Textarea
                id="policy-text"
                value={formData.cancellation_policy_text}
                onChange={(e) => setFormData(prev => ({ ...prev, cancellation_policy_text: e.target.value }))}
                placeholder="Describe tu política de cancelación en detalle..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Requerir Confirmación Manual</Label>
                <p className="text-sm text-gray-500">
                  Las reservas necesitarán tu confirmación antes de ser definitivas
                </p>
              </div>
              <Switch
                checked={formData.require_confirmation}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, require_confirmation: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-confirmar Reservas</Label>
                <p className="text-sm text-gray-500">
                  Las reservas se confirman automáticamente sin intervención manual
                </p>
              </div>
              <Switch
                checked={formData.auto_confirm_bookings}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_confirm_bookings: checked }))}
              />
            </div>
          </div>

          <Button type="submit" disabled={isUpdating} className="w-full">
            {isUpdating ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingRulesSettings;
