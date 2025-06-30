
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_user_id', user.id)
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

  // Función para generar sugerencias de URL alternativas
  const generateAlternativeSlug = (baseSlug: string) => {
    const timestamp = Date.now().toString().slice(-4);
    const randomSuffix = Math.floor(Math.random() * 99) + 1;
    return `${baseSlug}-${randomSuffix}`;
  };

  // Crear un nuevo negocio
  const createBusinessMutation = useMutation({
    mutationFn: async (businessData: BusinessInsert) => {
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
        title: "¡Negocio creado exitosamente!",
        description: "Tu negocio se ha registrado correctamente y ya puedes comenzar a configurar tus servicios.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating business:', error);
      
      if (error.code === '23505' && error.message.includes('businesses_booking_url_slug_key')) {
        toast({
          title: "URL de reservas ya existe",
          description: "Esta URL ya está en uso. Por favor, elige una URL diferente para tu negocio.",
          variant: "destructive",
        });
      } else if (error.message.includes('duplicate key')) {
        toast({
          title: "Información duplicada",
          description: "Ya existe un negocio con estos datos. Verifica la información e intenta nuevamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error al crear negocio",
          description: error.message || "Ocurrió un error inesperado. Intenta nuevamente.",
          variant: "destructive",
        });
      }
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
    onError: (error: any) => {
      console.error('Error updating business:', error);

      if (error.code === '23505' && error.message.includes('businesses_booking_url_slug_key')) {
        toast({
          title: "URL de reservas ya existe",
          description: "Esta URL ya está en uso por otro negocio. Por favor, elige una URL diferente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error al actualizar negocio",
          description: error.message || "Ocurrió un error inesperado. Intenta nuevamente.",
          variant: "destructive",
        });
      }
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
    generateAlternativeSlug,
  };
};
