
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "./useBusiness";

export const useStaffServices = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  // Obtener los servicios asociados a un miembro del personal
  const getStaffServices = (staffId: string) => {
    return useQuery({
      queryKey: ['staff-services', staffId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('staff_services')
          .select(`
            service_id,
            services (
              id,
              name,
              duration_minutes,
              price
            )
          `)
          .eq('staff_id', staffId);
        
        if (error) throw error;
        return data.map(item => item.services).filter(Boolean);
      },
      enabled: !!staffId,
    });
  };

  // Asociar servicios a un miembro del personal
  const updateStaffServicesMutation = useMutation({
    mutationFn: async ({ staffId, serviceIds }: { staffId: string; serviceIds: string[] }) => {
      // Primero eliminar todas las asociaciones existentes
      await supabase
        .from('staff_services')
        .delete()
        .eq('staff_id', staffId);

      // Luego insertar las nuevas asociaciones
      if (serviceIds.length > 0) {
        const { error } = await supabase
          .from('staff_services')
          .insert(
            serviceIds.map(serviceId => ({
              staff_id: staffId,
              service_id: serviceId
            }))
          );

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-services'] });
      toast({
        title: "Servicios actualizados",
        description: "Los servicios del miembro del personal se han actualizado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar servicios",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    getStaffServices,
    updateStaffServices: updateStaffServicesMutation.mutate,
    isUpdatingServices: updateStaffServicesMutation.isPending,
  };
};
