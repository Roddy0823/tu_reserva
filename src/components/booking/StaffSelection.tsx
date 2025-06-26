
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service, StaffMember } from '@/types/database';
import { User, ArrowLeft } from 'lucide-react';
import { useStaffServices } from '@/hooks/useStaffServices';

interface StaffSelectionProps {
  service: Service;
  staffMembers: StaffMember[];
  isLoading: boolean;
  onStaffSelect: (staffMember: StaffMember) => void;
  onBack: () => void;
}

const StaffSelection = ({ service, staffMembers, isLoading, onStaffSelect, onBack }: StaffSelectionProps) => {
  const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const { getStaffServices } = useStaffServices();

  useEffect(() => {
    const checkStaffAvailability = async () => {
      setLoadingStaff(true);
      const available: StaffMember[] = [];

      for (const staff of staffMembers) {
        if (!staff.is_active) continue;
        
        const { data: staffServices } = getStaffServices(staff.id);
        const canProvideService = staffServices?.some(s => s?.id === service.id);
        
        if (canProvideService) {
          available.push(staff);
        }
      }

      setAvailableStaff(available);
      setLoadingStaff(false);

      // Auto-select if only one staff member available
      if (available.length === 1) {
        setTimeout(() => onStaffSelect(available[0]), 500);
      }
    };

    if (staffMembers.length > 0) {
      checkStaffAvailability();
    }
  }, [service.id, staffMembers, getStaffServices, onStaffSelect]);

  if (isLoading || loadingStaff) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  if (availableStaff.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Personal no disponible</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            No hay personal disponible para el servicio "{service.name}" en este momento.
          </p>
          <Button variant="outline" onClick={onBack} className="mt-4">
            Seleccionar otro servicio
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show auto-selection message if only one staff member
  if (availableStaff.length === 1) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              Seleccionando automáticamente a {availableStaff[0].full_name}...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Selecciona el Personal</CardTitle>
            <p className="text-gray-600">Elige quién realizará tu servicio</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Option for any available staff */}
          <div
            className="border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
            onClick={() => onStaffSelect(availableStaff[0])} // Select first available for "any"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cualquiera disponible</h3>
                <p className="text-gray-600 text-sm">
                  El sistema asignará el personal disponible más pronto
                </p>
              </div>
            </div>
            <Button className="w-full mt-3">
              Continuar con cualquiera
            </Button>
          </div>

          {/* Individual staff members */}
          {availableStaff.map((staff) => (
            <div
              key={staff.id}
              className="border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => onStaffSelect(staff)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{staff.full_name}</h3>
                  {staff.email && (
                    <p className="text-gray-600 text-sm">{staff.email}</p>
                  )}
                </div>
              </div>
              <Button className="w-full mt-3" onClick={() => onStaffSelect(staff)}>
                Seleccionar a {staff.full_name}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffSelection;
