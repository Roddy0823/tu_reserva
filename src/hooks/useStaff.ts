
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember, StaffMemberInsert } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "./useBusiness";

export const useStaff = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { business } = useBusiness();

  // Obtener todos los miembros del personal del negocio
  const {
    data: staffMembers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['staff', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as StaffMember[];
    },
    enabled: !!business?.id,
  });

  // Crear un nuevo miembro del personal
  const createStaffMutation = useMutation({
    mutationFn: async (staffData: Omit<StaffMemberInsert, 'business_id'>) => {
      if (!business?.id) {
        throw new Error('No hay negocio seleccionado');
      }

      const { data, error } = await supabase
        .from('staff_members')
        .insert({
          ...staffData,
          business_id: business.id
        })
        .select()
        .single();

      if (error) throw error;
      return data as StaffMember;
    },
    onSuccess: (newStaff) => {
      // Actualizar cache de manera optimista
      queryClient.setQueryData(['staff', business?.id], (old: StaffMember[] = []) => {
        return [newStaff, ...old];
      });
      
      // Invalidar query para asegurar consistencia
      queryClient.invalidateQueries({ queryKey: ['staff', business?.id] });
      
      toast({
        title: "Miembro del personal agregado",
        description: `${newStaff.full_name} se ha agregado correctamente`,
      });
    },
    onError: (error) => {
      console.error('Error creating staff:', error);
      toast({
        title: "Error al agregar miembro del personal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Actualizar un miembro del personal
  const updateStaffMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StaffMemberInsert> }) => {
      const { data, error } = await supabase
        .from('staff_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as StaffMember;
    },
    onSuccess: (updatedStaff) => {
      // Actualizar cache de manera optimista
      queryClient.setQueryData(['staff', business?.id], (old: StaffMember[] = []) => {
        return old.map(staff => 
          staff.id === updatedStaff.id ? updatedStaff : staff
        );
      });
      
      // Invalidar queries relacionadas para mantener consistencia
      queryClient.invalidateQueries({ queryKey: ['staff', business?.id] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['staff-services'] });
      
      toast({
        title: "Miembro del personal actualizado",
        description: `Los cambios de ${updatedStaff.full_name} se han guardado correctamente`,
      });
    },
    onError: (error) => {
      console.error('Error updating staff:', error);
      toast({
        title: "Error al actualizar miembro del personal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Eliminar un miembro del personal
  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      // Verificar si el miembro del personal tiene citas futuras
      const { data: futureAppointments } = await supabase
        .from('appointments')
        .select('id')
        .eq('staff_id', id)
        .gte('start_time', new Date().toISOString())
        .limit(1);

      if (futureAppointments && futureAppointments.length > 0) {
        throw new Error('No se puede eliminar este miembro del personal porque tiene citas futuras programadas');
      }

      const { error } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      // Actualizar cache de manera optimista
      queryClient.setQueryData(['staff', business?.id], (old: StaffMember[] = []) => {
        return old.filter(staff => staff.id !== deletedId);
      });
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['staff', business?.id] });
      queryClient.invalidateQueries({ queryKey: ['staff-services'] });
      
      toast({
        title: "Miembro del personal eliminado",
        description: "El miembro del personal se ha eliminado correctamente",
      });
    },
    onError: (error) => {
      console.error('Error deleting staff:', error);
      toast({
        title: "Error al eliminar miembro del personal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    staffMembers,
    staff: staffMembers, // Agregar staff como alias para compatibilidad
    isLoading,
    error,
    createStaff: createStaffMutation.mutate,
    updateStaff: updateStaffMutation.mutate,
    deleteStaff: deleteStaffMutation.mutate,
    isCreating: createStaffMutation.isPending,
    isUpdating: updateStaffMutation.isPending,
    isDeleting: deleteStaffMutation.isPending,
  };
};
