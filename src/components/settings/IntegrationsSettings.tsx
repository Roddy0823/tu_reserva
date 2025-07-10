import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Link, 
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import GoogleCalendarSettings from './GoogleCalendarSettings';

const IntegrationsSettings = () => {
  const integrations = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sincroniza tus citas con Google Calendar automáticamente',
      icon: Calendar,
      status: 'connected', // connected, disconnected, error
      lastSync: '2024-01-15 10:30',
      component: GoogleCalendarSettings
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Envía confirmaciones y recordatorios por WhatsApp',
      icon: MessageSquare,
      status: 'disconnected',
      available: false,
      comingSoon: true
    },
    {
      id: 'email',
      name: 'Email Marketing',
      description: 'Integración con servicios de email marketing',
      icon: Mail,
      status: 'disconnected',
      available: false,
      comingSoon: true
    },
    {
      id: 'sms',
      name: 'SMS Notifications',
      description: 'Envía notificaciones por SMS a tus clientes',
      icon: Smartphone,
      status: 'disconnected',
      available: false,
      comingSoon: true
    }
  ];

  const getStatusBadge = (status: string, comingSoon?: boolean) => {
    if (comingSoon) {
      return <Badge variant="outline">Próximamente</Badge>;
    }
    
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Conectado</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Desconectado</Badge>;
    }
  };

  const getStatusIcon = (status: string, comingSoon?: boolean) => {
    if (comingSoon) {
      return <Settings className="h-4 w-4 text-muted-foreground" />;
    }
    
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integraciones Disponibles</h3>
        <p className="text-sm text-muted-foreground">
          Conecta tu negocio con servicios externos para automatizar procesos
        </p>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <integration.icon className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusIcon(integration.status, integration.comingSoon)}
                  {getStatusBadge(integration.status, integration.comingSoon)}
                </div>
              </div>
            </CardHeader>
            
            {integration.id === 'google-calendar' && (
              <CardContent>
                <Separator className="mb-4" />
                <GoogleCalendarSettings />
              </CardContent>
            )}
            
            {integration.comingSoon && (
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Esta integración estará disponible próximamente</p>
                  <p className="text-xs">Te notificaremos cuando esté lista</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            ¿Necesitas otra integración?
          </CardTitle>
          <CardDescription>
            Si necesitas integrar tu negocio con algún servicio específico, contáctanos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Solicitar Nueva Integración</p>
              <p className="text-sm text-muted-foreground">
                Cuéntanos qué servicio te gustaría integrar y lo evaluaremos
              </p>
            </div>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Contactar Soporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsSettings;