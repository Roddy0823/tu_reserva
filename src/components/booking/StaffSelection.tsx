
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Service, StaffMember } from '@/types/database';
import LoadingStaffSelection from './staff-selection/LoadingStaffSelection';
import NoStaffAvailable from './staff-selection/NoStaffAvailable';
import AutoSelectingStaff from './staff-selection/AutoSelectingStaff';
import StaffSelectionHeader from './staff-selection/StaffSelectionHeader';
import StaffMemberCard from './staff-selection/StaffMemberCard';
import { useStaffForService } from './staff-selection/useStaffForService';

interface StaffSelectionProps {
  service: Service;
  staffMembers: StaffMember[];
  isLoading: boolean;
  onStaffSelect: (staffMember: StaffMember) => void;
  onBack: () => void;
}

const StaffSelection = ({ service, staffMembers, isLoading, onStaffSelect, onBack }: StaffSelectionProps) => {
  const { availableStaff, loading: loadingStaff } = useStaffForService(service, staffMembers);

  // Auto-seleccionar si solo hay un miembro del personal
  useEffect(() => {
    if (availableStaff.length === 1 && !loadingStaff) {
      setTimeout(() => onStaffSelect(availableStaff[0]), 1500);
    }
  }, [availableStaff, loadingStaff, onStaffSelect]);

  if (isLoading || loadingStaff) {
    return <LoadingStaffSelection />;
  }

  if (availableStaff.length === 0) {
    return <NoStaffAvailable service={service} onBack={onBack} />;
  }

  // Mostrar mensaje de auto-selección si solo hay un miembro del personal
  if (availableStaff.length === 1) {
    return <AutoSelectingStaff staffMember={availableStaff[0]} />;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <StaffSelectionHeader service={service} onBack={onBack} />
      
      <CardContent className="space-y-4">
        {/* Lista del personal especializado */}
        <div className="space-y-3">
          {availableStaff.map((staff) => (
            <StaffMemberCard
              key={staff.id}
              staff={staff}
              service={service}
              onSelect={onStaffSelect}
            />
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Solo se muestra personal especializado y activo para este servicio
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffSelection;
