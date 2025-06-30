
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StaffMember, StaffMemberInsert } from "@/types/database";
import { useBusiness } from "./useBusiness";

export const useStaff = (businessId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  const query = useQuery({
    queryKey: ['staff', businessId],
    queryFn: async () => {
      let query = supabase
        .from('staff_members')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      // Si se proporciona businessId (para reservas públicas), filtrar por ese negocio
      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching staff:', error);
        throw error;
      }
      return data as StaffMember[];
    },
    enabled: !businessId || !!businessId, // Siempre habilitado, o habilitado si hay businessId
  });

  // Create staff mutation
  const createStaffMutation = useMutation({
    mutationFn: async (staffData: StaffMemberInsert) => {
      const dataWithBusinessId = {
        ...staffData,
        business_id: business?.id || staffData.business_id
      };

      const { data, error } = await supabase
        .from('staff_members')
        .insert(dataWithBusinessId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Personal creado",
        description: "El miembro del personal se ha creado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear personal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update staff mutation
  const updateStaffMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StaffMemberInsert> }) => {
      const { data, error } = await supabase
        .from('staff_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Personal actualizado",
        description: "El miembro del personal se ha actualizado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar personal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete staff mutation
  const deleteStaffMutation = useMutation({
    mutationFn: async (staffId: string) => {
      const { error } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', staffId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Personal eliminado",
        description: "El miembro del personal se ha eliminado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al eliminar personal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    staffMembers: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createStaff: createStaffMutation.mutate,
    updateStaff: updateStaffMutation.mutate,
    deleteStaff: deleteStaffMutation.mutate,
    isCreating: createStaffMutation.isPending,
    isUpdating: updateStaffMutation.isPending,
    isDeleting: deleteStaffMutation.isPending,
  };
};
