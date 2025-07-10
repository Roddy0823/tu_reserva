import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Download, 
  Eye, 
  Calendar, 
  Crown, 
  BarChart,
  User,
  Shield,
  Bell,
  Trash2,
  Settings
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionCard from '../SubscriptionCard';
import BillingSettings from './BillingSettings';

interface AccountSettingsProps {
  business: any;
}

const AccountSettings = ({ business }: AccountSettingsProps) => {
  const { 
    subscription, 
    plans, 
    currentUsage, 
    isFreePlan, 
    currentBookings, 
    maxBookings,
    openCustomerPortal,
    isOpeningPortal,
  } = useSubscription();

  return (
    <div className="space-y-6">
      {/* Información de la Cuenta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información de la Cuenta
          </CardTitle>
          <CardDescription>
            Detalles de tu cuenta de usuario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm">usuario@ejemplo.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Negocio</label>
              <p className="text-sm">{business?.name || 'Sin nombre'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
              <p className="text-sm">15 de Enero, 2024</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Último Acceso</label>
              <p className="text-sm">Hoy, 10:30 AM</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suscripción y Facturación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Suscripción y Facturación
          </CardTitle>
          <CardDescription>
            Gestiona tu plan de suscripción y métodos de pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BillingSettings business={business} />
        </CardContent>
      </Card>

      {/* Seguridad de la Cuenta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad de la Cuenta
          </CardTitle>
          <CardDescription>
            Configuración de seguridad y privacidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Cambiar Contraseña</p>
                <p className="text-sm text-muted-foreground">
                  Actualiza tu contraseña regularmente para mayor seguridad
                </p>
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Cambiar
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Autenticación de Dos Factores</p>
                <p className="text-sm text-muted-foreground">
                  Añade una capa extra de seguridad a tu cuenta
                </p>
              </div>
              <Badge variant="outline">Próximamente</Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sesiones Activas</p>
                <p className="text-sm text-muted-foreground">
                  Revisa y gestiona tus sesiones activas
                </p>
              </div>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Ver Sesiones
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias de Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Preferencias de Notificaciones
          </CardTitle>
          <CardDescription>
            Configura qué notificaciones quieres recibir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notificaciones por Email</p>
                <p className="text-sm text-muted-foreground">
                  Recibe actualizaciones importantes por correo
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notificaciones Push</p>
                <p className="text-sm text-muted-foreground">
                  Alertas en tiempo real en tu navegador
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Resumen Semanal</p>
                <p className="text-sm text-muted-foreground">
                  Recibe un resumen semanal de tu negocio
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zona de Peligro */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Zona de Peligro
          </CardTitle>
          <CardDescription>
            Acciones irreversibles que afectarán permanentemente tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Eliminar Cuenta</p>
                <p className="text-sm text-muted-foreground">
                  Elimina permanentemente tu cuenta y todos los datos asociados
                </p>
              </div>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Cuenta
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Exportar Datos</p>
                <p className="text-sm text-muted-foreground">
                  Descarga una copia de todos tus datos antes de eliminar la cuenta
                </p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;