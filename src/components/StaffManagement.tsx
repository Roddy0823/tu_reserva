
import { useState } from 'react';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { useStaffServices } from '@/hooks/useStaffServices';
import { useToast } from '@/hooks/use-toast';
import { StaffMember } from '@/types/database';
import StaffForm from './StaffForm';
import StaffHeader from './staff/StaffHeader';
import EmptyStaffState from './staff/EmptyStaffState';
import StaffGrid from './staff/StaffGrid';
import StaffLoadingGrid from './staff/StaffLoadingGrid';

const StaffManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  
  const { staffMembers, isLoading, createStaff, updateStaff, deleteStaff, isCreating, isUpdating, isDeleting } = useStaff();
  const { services } = useServices();
  const { getStaffServices } = useStaffServices();
  const { toast } = useToast();

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsFormOpen(true);
  };

  const handleDelete = async (staffId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este miembro del personal?')) {
      try {
        await deleteStaff(staffId);
        toast({
          title: "Personal eliminado",
          description: "El miembro del personal se ha eliminado correctamente",
        });
      } catch (error: any) {
        toast({
          title: "Error al eliminar personal",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingStaff(null);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingStaff) {
        await updateStaff({ id: editingStaff.id, updates: data });
        toast({
          title: "Personal actualizado",
          description: "El miembro del personal se ha actualizado correctamente",
        });
      } else {
        await createStaff(data);
        toast({
          title: "Personal creado",
          description: "El miembro del personal se ha creado correctamente",
        });
      }
      handleFormClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isFormOpen) {
    return (
      <StaffForm
        staffMember={editingStaff || undefined}
        services={services}
        onSubmit={handleFormSubmit}
        onCancel={handleFormClose}
        isLoading={isCreating || isUpdating}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <StaffHeader onNewStaff={() => setIsFormOpen(true)} />

      {isLoading ? (
        <StaffLoadingGrid />
      ) : staffMembers.length === 0 ? (
        <EmptyStaffState onCreateFirst={() => setIsFormOpen(true)} />
      ) : (
        <StaffGrid
          staffMembers={staffMembers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
          getStaffServices={getStaffServices}
        />
      )}
    </div>
  );
};

export default StaffManagement;
