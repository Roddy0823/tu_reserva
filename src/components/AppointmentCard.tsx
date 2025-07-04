
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
    <Card className={`transition-all duration-200 hover:shadow-lg ${isOngoing ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{appointment.client_name}</h3>
              <Badge className={statusInfo.color}>
                {statusInfo.text}
              </Badge>
              {isOngoing && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  En curso
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{appointment.services.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
            </p>
            <p className="text-xs text-gray-500">
              {appointment.services.duration_minutes} min
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span>{appointment.staff_members.full_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span>${appointment.services.price.toLocaleString()}</span>
          </div>
          {appointment.client_phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{appointment.client_phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="truncate">{appointment.client_email}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {/* Renderizar botones según acciones disponibles */}
          {availableActions.map((action) => (
            <Button
              key={action.action}
              size="sm"
              variant={action.variant as any || "default"}
              onClick={() => handleStatusUpdate(action.action)}
              disabled={isUpdating}
              className={`gap-1 ${action.variant === 'outline' && action.action === 'cancelado' ? 'text-red-600 hover:text-red-700' : ''}`}
            >
              {action.action === 'confirmado' && <CheckCircle className="h-3 w-3" />}
              {action.action === 'completado' && <CheckCircle className="h-3 w-3" />}
              {action.action === 'cancelado' && <XCircle className="h-3 w-3" />}
              {action.label}
            </Button>
          ))}

          {/* Botón editar siempre disponible */}
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(appointment)}
              className="gap-1"
            >
              <Edit className="h-3 w-3" />
              Editar
            </Button>
          )}

          {/* Información adicional para citas pendientes */}
          {appointment.status === 'pendiente' && appointment.services.accepts_transfer && appointment.payment_status === 'pendiente' && (
            <div className="w-full mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
              ⏳ Esperando aprobación de comprobante de pago
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
