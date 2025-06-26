
import { useState, useEffect } from 'react';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Check, Mail, Smartphone, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  business: any;
}

const NotificationSettings = ({ business }: NotificationSettingsProps) => {
  const { settings, updateSettings, isLoading, isUpdating } = useBusinessSettings(business.id);
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    // Email notifications
    email_new_booking: true,
    email_booking_cancelled: true,
    email_booking_confirmed: true,
    email_payment_received: true,
    email_daily_summary: false,
    email_weekly_report: false,
    
    // SMS notifications (future feature)
    sms_new_booking: false,
    sms_booking_reminder: false,
    
    // System notifications
    browser_notifications: true,
    sound_notifications: true,
  });

  // Sincronizar datos de configuración con el estado del formulario
  useEffect(() => {
    if (settings) {
      const newFormData = {
        email_new_booking: settings.email_new_booking ?? true,
        email_booking_cancelled: settings.email_booking_cancelled ?? true,
        email_booking_confirmed: settings.email_booking_confirmed ?? true,
        email_payment_received: settings.email_payment_received ?? true,
        email_daily_summary: settings.email_daily_summary ?? false,
        email_weekly_report: settings.email_weekly_report ?? false,
        sms_new_booking: settings.sms_new_booking ?? false,
        sms_booking_reminder: settings.sms_booking_reminder ?? false,
        browser_notifications: settings.browser_notifications ?? true,
        sound_notifications: settings.sound_notifications ?? true,
      };
      setFormData(newFormData);
      setHasChanges(false);
    }
  }, [settings]);

  const handleSwitchChange = (field: string, value: boolean) => {
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
      console.error('Error updating notification settings:', error);
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

  const NotificationOption = ({ 
    icon: Icon, 
    title, 
    description, 
    field, 
    disabled = false 
  }: { 
    icon: any, 
    title: string, 
    description: string, 
    field: string, 
    disabled?: boolean 
  }) => (
    <div className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${
      disabled ? 'bg-gray-50 opacity-60' : 'bg-white hover:bg-gray-50'
    }`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 ${disabled ? 'text-gray-400' : 'text-blue-600'}`} />
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">{title}</Label>
          <p className="text-sm text-gray-500">{description}</p>
          {disabled && (
            <p className="text-xs text-amber-600 font-medium">Próximamente</p>
          )}
        </div>
      </div>
      <Switch
        checked={formData[field as keyof typeof formData] as boolean}
        onCheckedChange={(checked) => handleSwitchChange(field, checked)}
        disabled={disabled}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Configuración de Notificaciones
        </CardTitle>
        <CardDescription>
          Gestiona cómo y cuándo quieres recibir notificaciones sobre tu negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Notificaciones por Email</h3>
            </div>
            
            <div className="space-y-3">
              <NotificationOption
                icon={Bell}
                title="Nueva Reserva"
                description="Recibe un email cuando se haga una nueva reserva"
                field="email_new_booking"
              />

              <NotificationOption
                icon={Bell}
                title="Reserva Cancelada"
                description="Recibe un email cuando se cancele una reserva"
                field="email_booking_cancelled"
              />

              <NotificationOption
                icon={Bell}
                title="Reserva Confirmada"
                description="Recibe un email cuando confirmes una reserva"
                field="email_booking_confirmed"
              />

              <NotificationOption
                icon={Bell}
                title="Pago Recibido"
                description="Recibe un email cuando se valide un pago"
                field="email_payment_received"
              />
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Reportes y Resúmenes</h4>
              
              <NotificationOption
                icon={Mail}
                title="Resumen Diario"
                description="Recibe un resumen diario de tus citas al final del día"
                field="email_daily_summary"
              />

              <NotificationOption
                icon={Mail}
                title="Reporte Semanal"
                description="Recibe un reporte semanal con estadísticas de tu negocio"
                field="email_weekly_report"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Notificaciones SMS</h3>
            </div>
            
            <div className="space-y-3">
              <NotificationOption
                icon={Smartphone}
                title="Nueva Reserva por SMS"
                description="Recibe SMS cuando se haga una nueva reserva"
                field="sms_new_booking"
                disabled={true}
              />

              <NotificationOption
                icon={Smartphone}
                title="Recordatorios por SMS"
                description="Envía recordatorios automáticos a tus clientes"
                field="sms_booking_reminder"
                disabled={true}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Notificaciones del Sistema</h3>
            </div>
            
            <div className="space-y-3">
              <NotificationOption
                icon={Monitor}
                title="Notificaciones del Navegador"
                description="Mostrar notificaciones emergentes en tu navegador"
                field="browser_notifications"
              />

              <NotificationOption
                icon={Bell}
                title="Sonidos de Notificación"
                description="Reproducir sonidos cuando lleguen notificaciones"
                field="sound_notifications"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t">
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

export default NotificationSettings;
