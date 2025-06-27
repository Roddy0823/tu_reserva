
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando personal disponible...</p>
        </CardContent>
      </Card>
    );
  }

  if (availableStaff.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <CardTitle className="text-xl text-red-600">Personal no disponible</CardTitle>
              <p className="text-gray-600">No encontramos personal disponible para este servicio</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              No hay personal disponible para el servicio <strong>"{service.name}"</strong> en este momento.
            </p>
          </div>
          <Button variant="outline" onClick={onBack} className="w-full">
            ← Seleccionar otro servicio
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Mostrar mensaje de auto-selección si solo hay un miembro del personal
  if (availableStaff.length === 1) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <CardTitle className="text-xl">Selecciona el Personal</CardTitle>
            <p className="text-gray-600">¿Quién te gustaría que realice tu servicio?</p>
          </div>
        </div>
        
        {/* Información del servicio seleccionado */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{service.name}</span>
            <span className="text-blue-600">• {service.duration_minutes} min</span>
            <span className="text-blue-600">• ${service.price?.toLocaleString()} COP</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Opción para cualquier personal disponible */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
          onClick={() => onStaffSelect(availableStaff[0])}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">Cualquier persona disponible</h3>
              <p className="text-gray-600">
                Te asignaremos el personal más pronto disponible
              </p>
              <p className="text-sm text-green-600 font-medium mt-1">
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
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
              onClick={() => onStaffSelect(staff)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                  <User className="h-7 w-7 text-gray-600 group-hover:text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{staff.full_name}</h3>
                  {staff.email && (
                    <p className="text-gray-600 text-sm">{staff.email}</p>
                  )}
                </div>
                <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffSelection;
