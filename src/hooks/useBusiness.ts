
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Business, BusinessInsert } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

export const useBusiness = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Obtener el negocio del usuario actual
  const {
    data: business,
    isLoading,
    error
  } = useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No se encontró negocio (usuario no tiene negocio registrado)
          return null;
        }
        throw error;
      }
      
      return data as Business;
    },
  });

  // Crear un nuevo negocio
  const createBusinessMutation = useMutation({
    mutationFn: async (businessData: Omit<BusinessInsert, 'owner_user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await supabase
        .from('businesses')
        .insert({
          ...businessData,
          owner_user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data as Business;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] });
      toast({
        title: "Negocio creado",
        description: "Tu negocio se ha registrado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al crear negocio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Actualizar negocio
  const updateBusinessMutation = useMutation({
    mutationFn: async (updates: Partial<BusinessInsert>) => {
      if (!business?.id) {
        throw new Error('No hay negocio para actualizar');
      }

      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', business.id)
        .select()
        .single();

      if (error) throw error;
      return data as Business;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] });
      toast({
        title: "Negocio actualizado",
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar negocio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    business,
    isLoading,
    error,
    createBusiness: createBusinessMutation.mutate,
    updateBusiness: updateBusinessMutation.mutate,
    isCreating: createBusinessMutation.isPending,
    isUpdating: updateBusinessMutation.isPending,
  };
};
