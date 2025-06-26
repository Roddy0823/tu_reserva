
import { useState } from 'react';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface NotificationSettingsProps {
  business: any;
}

const NotificationSettings = ({ business }: NotificationSettingsProps) => {
  const { settings, updateSettings, isLoading, isUpdating } = useBusinessSettings(business.id);
  const [formData, setFormData] = useState({
    // Email notifications
    email_new_booking: settings?.email_new_booking ?? true,
    email_booking_cancelled: settings?.email_booking_cancelled ?? true,
    email_booking_confirmed: settings?.email_booking_confirmed ?? true,
    email_payment_received: settings?.email_payment_received ?? true,
    email_daily_summary: settings?.email_daily_summary ?? false,
    email_weekly_report: settings?.email_weekly_report ?? false,
    
    // SMS notifications (future feature)
    sms_new_booking: settings?.sms_new_booking ?? false,
    sms_booking_reminder: settings?.sms_booking_reminder ?? false,
    
    // System notifications
    browser_notifications: settings?.browser_notifications ?? true,
    sound_notifications: settings?.sound_notifications ?? true,
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
        <CardTitle>Configuración de Notificaciones</CardTitle>
        <CardDescription>
          Gestiona cómo y cuándo quieres recibir notificaciones sobre tu negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notificaciones por Email</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Nueva Reserva</Label>
                <p className="text-sm text-gray-500">
                  Recibe un email cuando se haga una nueva reserva
                </p>
              </div>
              <Switch
                checked={formData.email_new_booking}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, email_new_booking: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reserva Cancelada</Label>
                <p className="text-sm text-gray-500">
                  Recibe un email cuando se cancele una reserva
                </p>
              </div>
              <Switch
                checked={formData.email_booking_cancelled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, email_booking_cancelled: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reserva Confirmada</Label>
                <p className="text-sm text-gray-500">
                  Recibe un email cuando confirmes una reserva
                </p>
              </div>
              <Switch
                checked={formData.email_booking_confirmed}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, email_booking_confirmed: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pago Recibido</Label>
                <p className="text-sm text-gray-500">
                  Recibe un email cuando se valide un pago
                </p>
              </div>
              <Switch
                checked={formData.email_payment_received}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, email_payment_received: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resumen Diario</Label>
                <p className="text-sm text-gray-500">
                  Recibe un resumen diario de tus citas al final del día
                </p>
              </div>
              <Switch
                checked={formData.email_daily_summary}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, email_daily_summary: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reporte Semanal</Label>
                <p className="text-sm text-gray-500">
                  Recibe un reporte semanal con estadísticas de tu negocio
                </p>
              </div>
              <Switch
                checked={formData.email_weekly_report}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, email_weekly_report: checked }))}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notificaciones del Sistema</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones del Navegador</Label>
                <p className="text-sm text-gray-500">
                  Mostrar notificaciones emergentes en tu navegador
                </p>
              </div>
              <Switch
                checked={formData.browser_notifications}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, browser_notifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sonidos de Notificación</Label>
                <p className="text-sm text-gray-500">
                  Reproducir sonidos cuando lleguen notificaciones
                </p>
              </div>
              <Switch
                checked={formData.sound_notifications}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sound_notifications: checked }))}
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

export default NotificationSettings;
