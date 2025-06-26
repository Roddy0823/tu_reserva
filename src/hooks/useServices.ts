
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service, ServiceInsert } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "./useBusiness";

export const useServices = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  // Obtener todos los servicios del negocio
  const {
    data: services = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['services', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Service[];
    },
    enabled: !!business?.id,
  });

  // Crear un nuevo servicio
  const createServiceMutation = useMutation({
    mutationFn: async (serviceData: Omit<ServiceInsert, 'business_id'>) => {
      if (!business?.id) {
        throw new Error('No hay negocio seleccionado');
      }

      const { data, error } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          business_id: business.id
        })
        .select()
        .single();

      if (error) throw error;
      return data as Service;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', business?.id] });
      toast({
        title: "Servicio creado",
        description: "El servicio se ha creado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al crear servicio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Actualizar un servicio
  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ServiceInsert> }) => {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Service;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', business?.id] });
      toast({
        title: "Servicio actualizado",
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar servicio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Eliminar un servicio
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', business?.id] });
      toast({
        title: "Servicio eliminado",
        description: "El servicio se ha eliminado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al eliminar servicio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    services,
    isLoading,
    error,
    createService: createServiceMutation.mutate,
    updateService: updateServiceMutation.mutate,
    deleteService: deleteServiceMutation.mutate,
    isCreating: createServiceMutation.isPending,
    isUpdating: updateServiceMutation.isPending,
    isDeleting: deleteServiceMutation.isPending,
  };
};
