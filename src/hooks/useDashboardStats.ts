
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBusiness } from "./useBusiness";

export const useDashboardStats = () => {
  const { business } = useBusiness();

  // Obtener turnos de hoy
  const { data: todayAppointments = [] } = useQuery({
    queryKey: ['appointments', 'today', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('business_id', business.id)
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString());

      if (error) throw error;
      return data || [];
    },
    enabled: !!business?.id,
  });

  // Obtener turnos pendientes
  const { data: pendingAppointments = [] } = useQuery({
    queryKey: ['appointments', 'pending', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('business_id', business.id)
        .eq('status', 'pendiente');

      if (error) throw error;
      return data || [];
    },
    enabled: !!business?.id,
  });

  // Obtener comprobantes pendientes de validación
  const { data: pendingPayments = [] } = useQuery({
    queryKey: ['appointments', 'pending-payments', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('business_id', business.id)
        .eq('payment_status', 'pendiente')
        .not('payment_proof_url', 'is', null);

      if (error) throw error;
      return data || [];
    },
    enabled: !!business?.id,
  });

  // Obtener actividad reciente (últimos 10 turnos)
  const { data: recentActivity = [] } = useQuery({
    queryKey: ['appointments', 'recent', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services (name),
          staff_members (full_name)
        `)
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!business?.id,
  });

  // Calcular estadísticas
  const stats = {
    todayAppointments: todayAppointments.length,
    todayCancellations: todayAppointments.filter(apt => apt.status === 'cancelado').length,
    pendingAppointments: pendingAppointments.length,
    pendingPayments: pendingPayments.length,
  };

  return {
    stats,
    recentActivity,
    isLoading: !business?.id,
  };
};
