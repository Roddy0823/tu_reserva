
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service, StaffMember } from '@/types/database';
import { User, ArrowLeft, Clock } from 'lucide-react';

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

  useEffect(() => {
    // Simplificar: por ahora, mostrar todo el personal activo
    // En una versión futura se puede implementar la lógica de servicios específicos
    const activeStaff = staffMembers.filter(staff => staff.is_active);
    setAvailableStaff(activeStaff);
    setLoadingStaff(false);

    // Auto-seleccionar si solo hay un miembro del personal
    if (activeStaff.length === 1) {
      setTimeout(() => onStaffSelect(activeStaff[0]), 1000);
    }
  }, [staffMembers, onStaffSelect]);

  if (isLoading || loadingStaff) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando personal disponible...</p>
      </div>
    );
  }

  if (availableStaff.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Personal no disponible</h2>
            <p className="text-gray-600">No encontramos personal disponible para este servicio</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">
            No hay personal disponible para el servicio <strong>"{service.name}"</strong> en este momento.
          </p>
        </div>
        <Button variant="outline" onClick={onBack} className="w-full">
          ← Seleccionar otro servicio
        </Button>
      </div>
    );
  }

  // Mostrar mensaje de auto-selección si solo hay un miembro del personal
  if (availableStaff.length === 1) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Personal asignado automáticamente
          </h3>
          <p className="text-gray-600 mb-2">
            {availableStaff[0].full_name} realizará tu servicio
          </p>
          <p className="text-sm text-gray-500">
            Redirigiendo automáticamente...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">Selecciona el Personal</h2>
          <p className="text-gray-600">¿Quién te gustaría que realice tu servicio?</p>
        </div>
      </div>
      
      {/* Información del servicio seleccionado */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{service.name}</span>
          <span className="text-gray-500">• {service.duration_minutes} min</span>
          <span className="text-gray-500">• ${service.price?.toLocaleString()} COP</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Opción para cualquier personal disponible */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer group"
          onClick={() => onStaffSelect(availableStaff[0])}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all">
              <User className="h-8 w-8 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-lg">Cualquier persona disponible</h3>
              <p className="text-gray-600">
                Te asignaremos el personal más pronto disponible
              </p>
              <p className="text-sm text-gray-700 font-medium mt-1">
                ✓ Recomendado para mayor flexibilidad
              </p>
            </div>
          </div>
        </div>

        {/* Lista del personal individual */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 border-b pb-2">O elige una persona específica:</h4>
          {availableStaff.map((staff) => (
            <div
              key={staff.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer group"
              onClick={() => onStaffSelect(staff)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all">
                  <User className="h-7 w-7 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{staff.full_name}</h3>
                  {staff.email && (
                    <p className="text-gray-600 text-sm">{staff.email}</p>
                  )}
                </div>
                <div className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffSelection;
