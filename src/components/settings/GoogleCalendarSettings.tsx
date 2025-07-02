import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GoogleCalendarStatus {
  connected: boolean;
  email?: string;
  lastSync?: string;
}

const GoogleCalendarSettings = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<GoogleCalendarStatus>({ connected: false });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-status');
      
      if (error) {
        console.error('Error checking status:', error);
        setStatus({ connected: false });
      } else {
        setStatus(data || { connected: false });
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus({ connected: false });
    } finally {
      setChecking(false);
    }
  };

  const connectToGoogle = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'connect' }
      });

      if (error) {
        throw error;
      }

      if (data?.authUrl) {
        // Abrir ventana de autenticación
        window.open(data.authUrl, 'google-auth', 'width=500,height=600');
        
        // Escuchar el mensaje de éxito desde la ventana
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            window.removeEventListener('message', handleMessage);
            checkConnectionStatus();
            toast({
              title: "Conexión exitosa",
              description: "Tu cuenta de Google Calendar ha sido conectada",
            });
          } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
            window.removeEventListener('message', handleMessage);
            toast({
              title: "Error de conexión",
              description: "No se pudo conectar con Google Calendar",
              variant: "destructive",
            });
          }
        };

        window.addEventListener('message', handleMessage);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al conectar con Google Calendar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const disconnectFromGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'disconnect' }
      });

      if (error) {
        throw error;
      }

      setStatus({ connected: false });
      toast({
        title: "Desconectado",
        description: "Tu cuenta de Google Calendar ha sido desconectada",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al desconectar Google Calendar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Google Calendar
          </CardTitle>
          <CardDescription>
            Sincroniza tus citas con Google Calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Google Calendar
        </CardTitle>
        <CardDescription>
          Sincroniza tus citas con Google Calendar para evitar conflictos de horarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estado de Conexión */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {status.connected ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium">
                {status.connected ? 'Conectado' : 'No conectado'}
              </p>
              {status.connected && status.email && (
                <p className="text-sm text-gray-600">{status.email}</p>
              )}
            </div>
          </div>
          <Badge variant={status.connected ? "default" : "secondary"}>
            {status.connected ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>

        {/* Información sobre la sincronización */}
        <div className="space-y-2 text-sm text-gray-600">
          <h4 className="font-medium text-gray-900">¿Qué se sincroniza?</h4>
          <ul className="space-y-1 ml-4">
            <li>• Las citas confirmadas se crean automáticamente en tu Google Calendar</li>
            <li>• Los cambios de fecha/hora se actualizan en Google Calendar</li>
            <li>• Las citas canceladas se eliminan de Google Calendar</li>
            <li>• Los eventos existentes en Google Calendar bloquean esos horarios para nuevas reservas</li>
          </ul>
        </div>

        {status.lastSync && (
          <div className="text-sm text-gray-600">
            <strong>Última sincronización:</strong> {new Date(status.lastSync).toLocaleString('es-ES')}
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex gap-2">
          {status.connected ? (
            <Button 
              variant="destructive" 
              onClick={disconnectFromGoogle}
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Desconectar Google Calendar
            </Button>
          ) : (
            <Button 
              onClick={connectToGoogle}
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Conectar con Google Calendar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarSettings;