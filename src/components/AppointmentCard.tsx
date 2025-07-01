
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Appointment, AppointmentStatus } from '@/types/database';
import { Clock, User, Phone, Mail, DollarSign, Edit, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppointmentCardProps {
  appointment: Appointment & { 
    staff_members: { full_name: string }, 
    services: { name: string, duration_minutes: number, price: number, accepts_transfer?: boolean, accepts_cash?: boolean } 
  };
  onEdit?: (appointment: any) => void;
}

const AppointmentCard = ({ appointment, onEdit }: AppointmentCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: AppointmentStatus) => {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointment.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Estado actualizado",
        description: "El estado de la cita se ha actualizado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar estado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      case 'completado': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmada';
      case 'pendiente': return 'Pendiente';
      case 'cancelado': return 'Cancelada';
      case 'completado': return 'Completada';
      default: return status;
    }
  };

  const handleStatusUpdate = async (newStatus: AppointmentStatus) => {
    setIsUpdating(true);
    try {
      await updateStatusMutation.mutateAsync(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const startTime = new Date(appointment.start_time);
  const endTime = new Date(appointment.end_time);
  const isUpcoming = startTime > new Date();
  const isOngoing = startTime <= new Date() && endTime >= new Date();
  
  // Determinar si la cita requiere comprobante de pago
  const requiresPaymentProof = appointment.services?.accepts_transfer || false;
  const acceptsCash = appointment.services?.accepts_cash !== false; // Default true si no está definido

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${isOngoing ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{appointment.client_name}</h3>
              <Badge className={getStatusColor(appointment.status)}>
                {getStatusText(appointment.status)}
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
          {/* Botones para citas que NO requieren comprobante (solo efectivo) */}
          {!requiresPaymentProof && acceptsCash && (
            <>
              {appointment.status === 'pendiente' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('confirmado')}
                  disabled={isUpdating}
                  className="gap-1"
                >
                  <CheckCircle className="h-3 w-3" />
                  Confirmar
                </Button>
              )}
              
              {appointment.status === 'confirmado' && isUpcoming && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('completado')}
                  disabled={isUpdating}
                  className="gap-1"
                >
                  <CheckCircle className="h-3 w-3" />
                  Completar
                </Button>
              )}
            </>
          )}

          {/* Botones para citas que requieren comprobante de pago */}
          {requiresPaymentProof && (
            <>
              {appointment.status === 'pendiente' && appointment.payment_status === 'aprobado' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('confirmado')}
                  disabled={isUpdating}
                  className="gap-1"
                >
                  <CheckCircle className="h-3 w-3" />
                  Confirmar
                </Button>
              )}
              
              {appointment.status === 'confirmado' && isUpcoming && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate('completado')}
                  disabled={isUpdating}
                  className="gap-1"
                >
                  <CheckCircle className="h-3 w-3" />
                  Completar
                </Button>
              )}
            </>
          )}

          {/* Botón cancelar disponible para todas las citas pendientes o confirmadas */}
          {['pendiente', 'confirmado'].includes(appointment.status) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate('cancelado')}
              disabled={isUpdating}
              className="gap-1 text-red-600 hover:text-red-700"
            >
              <XCircle className="h-3 w-3" />
              Cancelar
            </Button>
          )}

          {/* Botón editar disponible para todas las citas */}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
