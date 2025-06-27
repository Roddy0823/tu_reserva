
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimeBlock, TimeBlockInsert } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "./useBusiness";

export const useTimeBlocks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  // Obtener bloques de tiempo para un miembro del personal específico
  const getTimeBlocks = (staffId?: string) => {
    return useQuery({
      queryKey: ['time-blocks', staffId],
      queryFn: async () => {
        if (!staffId) return [];
        
        const { data, error } = await supabase
          .from('time_blocks')
          .select(`
            *,
            staff_members (
              full_name
            )
          `)
          .eq('staff_id', staffId)
          .order('start_time', { ascending: true });
        
        if (error) throw error;
        return data as (TimeBlock & { staff_members: { full_name: string } })[];
      },
      enabled: !!staffId,
    });
  };

  // Obtener todos los bloques de tiempo del negocio
  const getAllTimeBlocks = () => {
    return useQuery({
      queryKey: ['time-blocks', 'all', business?.id],
      queryFn: async () => {
        if (!business?.id) return [];
        
        const { data, error } = await supabase
          .from('time_blocks')
          .select(`
            *,
            staff_members!inner (
              full_name,
              business_id
            )
          `)
          .eq('staff_members.business_id', business.id)
          .order('start_time', { ascending: true });
        
        if (error) throw error;
        return data as (TimeBlock & { staff_members: { full_name: string } })[];
      },
      enabled: !!business?.id,
    });
  };

  // Crear un nuevo bloque de tiempo
  const createTimeBlockMutation = useMutation({
    mutationFn: async (timeBlockData: TimeBlockInsert) => {
      const { data, error } = await supabase
        .from('time_blocks')
        .insert(timeBlockData)
        .select()
        .single();

      if (error) throw error;
      return data as TimeBlock;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-blocks'] });
      toast({
        title: "Bloqueo creado",
        description: "El bloqueo de horario se ha creado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al crear bloqueo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Actualizar un bloque de tiempo
  const updateTimeBlockMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TimeBlockInsert> }) => {
      const { data, error } = await supabase
        .from('time_blocks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as TimeBlock;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-blocks'] });
      toast({
        title: "Bloqueo actualizado",
        description: "Los cambios se han guardado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar bloqueo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Eliminar un bloque de tiempo
  const deleteTimeBlockMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('time_blocks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-blocks'] });
      toast({
        title: "Bloqueo eliminado",
        description: "El bloqueo de horario se ha eliminado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al eliminar bloqueo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    getTimeBlocks,
    getAllTimeBlocks,
    createTimeBlock: createTimeBlockMutation.mutate,
    updateTimeBlock: updateTimeBlockMutation.mutate,
    deleteTimeBlock: deleteTimeBlockMutation.mutate,
    isCreating: createTimeBlockMutation.isPending,
    isUpdating: updateTimeBlockMutation.isPending,
    isDeleting: deleteTimeBlockMutation.isPending,
  };
};
