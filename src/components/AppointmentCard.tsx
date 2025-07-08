
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/types/database';
import { User, Phone, Mail, DollarSign, Edit, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppointmentStateManager } from '@/hooks/useAppointmentStateManager';

interface AppointmentCardProps {
  appointment: Appointment & { 
    staff_members: { full_name: string }, 
    services: { name: string, duration_minutes: number, price: number, accepts_transfer?: boolean, accepts_cash?: boolean } 
  };
  onEdit?: (appointment: any) => void;
}

const AppointmentCard = ({ appointment, onEdit }: AppointmentCardProps) => {
  const { updateStatus, isUpdating, getAvailableActions, getStatusInfo } = useAppointmentStateManager();

  const handleStatusUpdate = (newStatus: any) => {
    updateStatus({
      appointmentId: appointment.id,
      newStatus,
      currentAppointment: appointment
    });
  };

  const startTime = new Date(appointment.start_time);
  const endTime = new Date(appointment.end_time);
  const isOngoing = startTime <= new Date() && endTime >= new Date();
  
  const statusInfo = getStatusInfo(appointment.status, appointment.payment_status);
  const availableActions = getAvailableActions(appointment);

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${isOngoing ? 'ring-2 ring-primary' : ''} card-interactive`}>
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">
                {appointment.client_name}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge className={statusInfo.color}>
                  {statusInfo.text}
                </Badge>
                {isOngoing && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                    En curso
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{appointment.services.name}</p>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <p className="text-sm font-medium text-foreground">
              {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
            </p>
            <p className="text-xs text-muted-foreground">
              {appointment.services.duration_minutes} min
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{appointment.staff_members.full_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>${appointment.services.price.toLocaleString()}</span>
          </div>
          {appointment.client_phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{appointment.client_phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{appointment.client_email}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
          {/* Renderizar botones según acciones disponibles */}
          {availableActions.map((action) => (
            <Button
              key={action.action}
              size="sm"
              variant={action.variant as any || "default"}
              onClick={() => handleStatusUpdate(action.action)}
              disabled={isUpdating}
              className={`gap-1 text-xs sm:text-sm ${action.variant === 'outline' && action.action === 'cancelado' ? 'text-destructive hover:text-destructive' : ''}`}
            >
              {action.action === 'confirmado' && <CheckCircle className="h-3 w-3" />}
              {action.action === 'completado' && <CheckCircle className="h-3 w-3" />}
              {action.action === 'cancelado' && <XCircle className="h-3 w-3" />}
              <span className="hidden sm:inline">{action.label}</span>
              <span className="sm:hidden">
                {action.action === 'confirmado' && 'Conf.'}
                {action.action === 'completado' && 'Comp.'}
                {action.action === 'cancelado' && 'Canc.'}
              </span>
            </Button>
          ))}

          {/* Botón editar siempre disponible */}
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(appointment)}
              className="gap-1 text-xs sm:text-sm"
            >
              <Edit className="h-3 w-3" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          )}
        </div>

        {/* Información adicional para citas pendientes */}
        {appointment.status === 'pendiente' && appointment.services.accepts_transfer && appointment.payment_status === 'pendiente' && (
          <div className="w-full mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs sm:text-sm text-amber-800">
            ⏳ Esperando aprobación de comprobante de pago
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
