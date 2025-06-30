
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Service, ServiceInsert } from "@/types/database";
import { useBusiness } from "./useBusiness";

export const useServices = (businessId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  const query = useQuery({
    queryKey: ['services', businessId],
    queryFn: async () => {
      let query = supabase
        .from('services')
        .select('*')
        .order('name');

      // Si se proporciona businessId (para reservas públicas), filtrar por ese negocio
      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      return data as Service[];
    },
    enabled: !businessId || !!businessId, // Siempre habilitado, o habilitado si hay businessId
  });

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: async (serviceData: ServiceInsert) => {
      const dataWithBusinessId = {
        ...serviceData,
        business_id: business?.id || serviceData.business_id
      };

      const { data, error } = await supabase
        .from('services')
        .insert(dataWithBusinessId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Servicio creado",
        description: "El servicio se ha creado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear servicio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<ServiceInsert>) => {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Servicio actualizado",
        description: "El servicio se ha actualizado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar servicio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: "Servicio eliminado",
        description: "El servicio se ha eliminado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al eliminar servicio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    services: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createService: createServiceMutation.mutate,
    updateService: updateServiceMutation.mutate,
    deleteService: deleteServiceMutation.mutate,
    isCreating: createServiceMutation.isPending,
    isUpdating: updateServiceMutation.isPending,
    isDeleting: deleteServiceMutation.isPending,
  };
};
