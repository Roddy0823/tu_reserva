import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Appointment, AppointmentStatus } from "@/types/database";

interface StateTransitionOptions {
  appointmentId: string;
  newStatus: AppointmentStatus;
  currentAppointment: Appointment;
}

export const useAppointmentStateManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ appointmentId, newStatus, currentAppointment }: StateTransitionOptions) => {
      // Validar transiciones de estado válidas
      const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
        'pendiente': ['confirmado', 'cancelado'],
        'confirmado': ['completado', 'cancelado'],
        'cancelado': [], // No se puede cambiar desde cancelado
        'completado': [] // No se puede cambiar desde completado
      };

      const allowedNextStates = validTransitions[currentAppointment.status];
      if (!allowedNextStates.includes(newStatus)) {
        throw new Error(`No se puede cambiar de ${currentAppointment.status} a ${newStatus}`);
      }

      // Validación especial para confirmado: debe tener pago aprobado si requiere transferencia
      if (newStatus === 'confirmado') {
        // Para esta validación necesitamos obtener los datos completos del servicio
        const { data: serviceData } = await supabase
          .from('services')
          .select('accepts_transfer')
          .eq('id', currentAppointment.service_id)
          .single();
          
        const requiresPaymentApproval = serviceData?.accepts_transfer;
        if (requiresPaymentApproval && currentAppointment.payment_status !== 'aprobado') {
          throw new Error('Esta cita requiere aprobación de pago antes de ser confirmada');
        }
      }

      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);
      
      if (error) throw error;

      return { appointmentId, newStatus, currentAppointment };
    },
    onSuccess: (data) => {
      // Invalidar todas las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
      queryClient.invalidateQueries({ queryKey: ['completed-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['available-time-slots'] });
      
      const statusMessages = {
        'confirmado': 'Cita confirmada exitosamente',
        'completado': 'Cita marcada como completada',
        'cancelado': 'Cita cancelada'
      };

      toast({
        title: "Estado actualizado",
        description: statusMessages[data.newStatus] || "Estado de la cita actualizado",
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

  // Función helper para obtener las acciones disponibles para una cita
  const getAvailableActions = (appointment: Appointment & { 
    services?: { accepts_transfer?: boolean, accepts_cash?: boolean } 
  }) => {
    const actions: { action: AppointmentStatus; label: string; variant?: string }[] = [];
    
    switch (appointment.status) {
      case 'pendiente':
        // Si acepta transferencia pero no tiene pago aprobado, no puede confirmar
        const requiresPaymentApproval = appointment.services?.accepts_transfer;
        const canConfirm = !requiresPaymentApproval || appointment.payment_status === 'aprobado';
        
        if (canConfirm) {
          actions.push({ action: 'confirmado', label: 'Confirmar' });
        }
        actions.push({ action: 'cancelado', label: 'Cancelar', variant: 'outline' });
        break;
        
      case 'confirmado':
        const isUpcoming = new Date(appointment.start_time) > new Date();
        if (isUpcoming) {
          actions.push({ action: 'completado', label: 'Completar' });
        }
        actions.push({ action: 'cancelado', label: 'Cancelar', variant: 'outline' });
        break;
        
      case 'cancelado':
      case 'completado':
        // No hay acciones disponibles para estados finales
        break;
    }
    
    return actions;
  };

  // Función helper para obtener información del estado
  const getStatusInfo = (status: AppointmentStatus, paymentStatus?: string) => {
    const statusConfig = {
      'pendiente': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        text: 'Pendiente',
        description: 'Esperando confirmación'
      },
      'confirmado': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        text: 'Confirmada',
        description: 'Cita confirmada'
      },
      'cancelado': { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        text: 'Cancelada',
        description: 'Cita cancelada'
      },
      'completado': { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        text: 'Completada',
        description: 'Servicio completado'
      }
    };

    const baseInfo = statusConfig[status];
    
    // Agregar información adicional para citas pendientes con pagos
    if (status === 'pendiente' && paymentStatus === 'pendiente') {
      baseInfo.description = 'Esperando aprobación de pago';
    }
    
    return baseInfo;
  };

  return {
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    getAvailableActions,
    getStatusInfo
  };
};