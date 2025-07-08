
import { StaffMember } from '@/types/database';
import StaffCard from './StaffCard';

interface StaffGridProps {
  staffMembers: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
  isDeleting: boolean;
  getStaffServices: (staffId: string) => any;
}

const StaffGrid = ({ staffMembers, onEdit, onDelete, isDeleting, getStaffServices }: StaffGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {staffMembers.map((staff) => (
        <StaffCard
          key={staff.id}
          staff={staff}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
          getStaffServices={getStaffServices}
        />
      ))}
    </div>
  );
};

export default StaffGrid;
