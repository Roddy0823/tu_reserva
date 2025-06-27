import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service, StaffMember } from '@/types/database';
import { User, ArrowLeft, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
    const fetchAvailableStaff = async () => {
      setLoadingStaff(true);
      try {
        // Obtener el personal que puede realizar este servicio específico
        const { data: staffServices, error } = await supabase
          .from('staff_services')
          .select(`
            staff_id,
            staff_members!inner (
              id,
              full_name,
              email,
              is_active,
              photo_url
            )
          `)
          .eq('service_id', service.id);

        if (error) {
          console.error('Error fetching staff services:', error);
          // Si no hay relaciones staff_services, mostrar todo el personal activo
          const activeStaff = staffMembers.filter(staff => staff.is_active);
          setAvailableStaff(activeStaff);
        } else {
          // Filtrar solo el personal activo que puede realizar este servicio
          const serviceStaff = staffServices
            .map(ss => ss.staff_members)
            .filter(staff => staff?.is_active);
          
          console.log('Staff that can perform this service:', serviceStaff);
          
          if (serviceStaff.length === 0) {
            // Si no hay personal específico, mostrar todo el personal activo
            const activeStaff = staffMembers.filter(staff => staff.is_active);
            setAvailableStaff(activeStaff);
          } else {
            setAvailableStaff(serviceStaff as StaffMember[]);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        // Fallback: mostrar todo el personal activo
        const activeStaff = staffMembers.filter(staff => staff.is_active);
        setAvailableStaff(activeStaff);
      } finally {
        setLoadingStaff(false);
      }
    };

    if (staffMembers.length > 0) {
      fetchAvailableStaff();
    }
  }, [staffMembers, service.id]);

  // Auto-seleccionar si solo hay un miembro del personal
  useEffect(() => {
    if (availableStaff.length === 1 && !loadingStaff) {
      setTimeout(() => onStaffSelect(availableStaff[0]), 1500);
    }
  }, [availableStaff, loadingStaff, onStaffSelect]);

  if (isLoading || loadingStaff) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 text-lg">Cargando personal disponible...</p>
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
              <p className="text-slate-600">No encontramos personal disponible para este servicio</p>
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
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Personal asignado automáticamente
            </h3>
            <p className="text-slate-600 mb-2">
              {availableStaff[0].full_name} realizará tu servicio
            </p>
            <p className="text-sm text-slate-500">
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
            <CardTitle className="text-xl text-slate-900">Selecciona el Personal</CardTitle>
            <p className="text-slate-600">¿Quién te gustaría que realice tu servicio?</p>
          </div>
        </div>
        
        {/* Información del servicio seleccionado */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-4">
          <div className="flex items-center gap-2 text-slate-800">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{service.name}</span>
            <span className="text-slate-600">• {service.duration_minutes} min</span>
            <span className="text-slate-600">• ${service.price?.toLocaleString()} COP</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Lista del personal individual */}
        <div className="space-y-3">
          {availableStaff.map((staff) => (
            <div
              key={staff.id}
              className="border border-slate-200 rounded-lg p-4 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer group"
              onClick={() => onStaffSelect(staff)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center group-hover:from-slate-200 group-hover:to-slate-300 transition-all">
                  {staff.photo_url ? (
                    <img 
                      src={staff.photo_url} 
                      alt={staff.full_name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-7 w-7 text-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{staff.full_name}</h3>
                  {staff.email && (
                    <p className="text-slate-600 text-sm">{staff.email}</p>
                  )}
                  <p className="text-xs text-green-600 mt-1">✓ Especialista en {service.name}</p>
                </div>
                <div className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
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
