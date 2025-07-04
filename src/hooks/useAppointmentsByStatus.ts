import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentStatus } from "@/types/database";
import { useBusiness } from "./useBusiness";

export const useAppointmentsByStatus = (status?: AppointmentStatus) => {
  const { business } = useBusiness();

  const {
    data: appointments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointments', 'by-status', business?.id, status],
    queryFn: async () => {
      if (!business?.id) return [];
      
      let query = supabase
        .from('appointments')
        .select(`
          *,
          staff_members!inner (
            full_name,
            business_id
          ),
          services (
            name,
            duration_minutes,
            price,
            accepts_transfer,
            accepts_cash
          )
        `)
        .eq('staff_members.business_id', business.id)
        .order('start_time', { ascending: true });

      // Aplicar filtro de estado si se proporciona
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Filter out appointments without proper staff_members or services data
      const validAppointments = (data || []).filter(appointment => 
        appointment.staff_members && appointment.services
      );
      
      return validAppointments as (Appointment & { 
        staff_members: { full_name: string, business_id: string }, 
        services: { 
          name: string, 
          duration_minutes: number, 
          price: number,
          accepts_transfer?: boolean,
          accepts_cash?: boolean
        } 
      })[];
    },
    enabled: !!business?.id,
  });

  // Calculate statistics by status
  const getStatsByStatus = () => {
    const statsByStatus = {
      pendiente: appointments.filter(apt => apt.status === 'pendiente').length,
      confirmado: appointments.filter(apt => apt.status === 'confirmado').length,
      cancelado: appointments.filter(apt => apt.status === 'cancelado').length,
      completado: appointments.filter(apt => apt.status === 'completado').length,
      total: appointments.length
    };

    const pendingPaymentApprovals = appointments.filter(apt => 
      apt.status === 'pendiente' && 
      apt.services?.accepts_transfer && 
      apt.payment_status === 'pendiente'
    ).length;

    return {
      ...statsByStatus,
      pendingPaymentApprovals
    };
  };

  return {
    appointments,
    stats: getStatsByStatus(),
    isLoading,
    error,
    refetch,
  };
};