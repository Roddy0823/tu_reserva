
import { useState } from 'react';
import { useTimeBlocks } from '@/hooks/useTimeBlocks';
import { useStaff } from '@/hooks/useStaff';
import TimeBlockForm from './TimeBlockForm';
import StaffAvailabilityCard from './StaffAvailabilityCard';
import { TimeBlock } from '@/types/database';

const AvailabilityManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTimeBlock, setEditingTimeBlock] = useState<(TimeBlock & { staff_members: { full_name: string } }) | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  
  const { getAllTimeBlocks, createTimeBlock, updateTimeBlock, deleteTimeBlock, isCreating, isUpdating, isDeleting } = useTimeBlocks();
  const { staffMembers } = useStaff();
  const { data: timeBlocks = [], isLoading } = getAllTimeBlocks();

  const handleCreateTimeBlock = (data: any) => {
    createTimeBlock(data, {
      onSuccess: () => {
        setShowForm(false);
        setSelectedStaffId(null);
      }
    });
  };

  const handleUpdateTimeBlock = (data: any) => {
    if (editingTimeBlock) {
      updateTimeBlock(
        { id: editingTimeBlock.id, updates: data },
        {
          onSuccess: () => {
            setEditingTimeBlock(null);
            setShowForm(false);
            setSelectedStaffId(null);
          }
        }
      );
    }
  };

  const handleEditTimeBlock = (timeBlock: TimeBlock & { staff_members: { full_name: string } }) => {
    setEditingTimeBlock(timeBlock);
    setShowForm(true);
  };

  const handleAddException = (staffId: string) => {
    setSelectedStaffId(staffId);
    setShowForm(true);
  };

  const handleDelete = (timeBlockId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este bloqueo?')) {
      deleteTimeBlock(timeBlockId);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTimeBlock(null);
    setSelectedStaffId(null);
  };

  if (showForm) {
    return (
      <TimeBlockForm
        timeBlock={editingTimeBlock || undefined}
        staffMembers={staffMembers}
        selectedStaffId={selectedStaffId}
        onSubmit={editingTimeBlock ? handleUpdateTimeBlock : handleCreateTimeBlock}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Gestión de Disponibilidad</h2>
        <p className="text-gray-600 mt-1">Administra las excepciones de disponibilidad para tu personal</p>
      </div>

      <div className="space-y-6">
        {staffMembers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay personal registrado</p>
          </div>
        ) : (
          staffMembers.map((staff) => (
            <StaffAvailabilityCard
              key={staff.id}
              staff={staff}
              timeBlocks={timeBlocks.filter(block => block.staff_id === staff.id)}
              onEditTimeBlock={handleEditTimeBlock}
              onDeleteTimeBlock={handleDelete}
              onAddException={() => handleAddException(staff.id)}
              isDeleting={isDeleting}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AvailabilityManagement;
