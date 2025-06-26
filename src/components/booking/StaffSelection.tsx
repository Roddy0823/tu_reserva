
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { StaffMember, Business } from '@/types/database';

interface StaffSelectionProps {
  business: Business;
  bookingData: any;
  updateBookingData: (data: any) => void;
}

const StaffSelection = ({ business, bookingData, updateBookingData }: StaffSelectionProps) => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffForService = async () => {
      if (!bookingData.service) return;

      try {
        const { data, error } = await supabase
          .from('staff_services')
          .select(`
            staff_members (
              id,
              full_name,
              email,
              is_active,
              business_id,
              created_at
            )
          `)
          .eq('service_id', bookingData.service.id);

        if (error) throw error;
        
        const staffMembers = data
          ?.map(item => item.staff_members)
          .filter(Boolean)
          .filter(member => member.is_active) as StaffMember[];

        setStaff(staffMembers || []);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffForService();
  }, [bookingData.service]);

  const handleStaffSelect = (staffMember: StaffMember) => {
    updateBookingData({ staff: staffMember, date: undefined, time: undefined });
  };

  if (!bookingData.service) {
    return <div className="text-center py-4">Primero selecciona un servicio.</div>;
  }

  if (loading) {
    return <div className="text-center py-4">Cargando profesionales...</div>;
  }

  if (staff.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hay profesionales disponibles para este servicio.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600">Servicio seleccionado:</p>
        <Badge variant="outline" className="mt-1">{bookingData.service.name}</Badge>
      </div>
      
      <p className="text-gray-600 mb-4">Selecciona el profesional que prefieres:</p>
      
      <div className="grid gap-4">
        {staff.map((staffMember) => (
          <Card
            key={staffMember.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              bookingData.staff?.id === staffMember.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
            onClick={() => handleStaffSelect(staffMember)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{staffMember.full_name}</CardTitle>
              {staffMember.email && (
                <CardDescription>{staffMember.email}</CardDescription>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffSelection;
