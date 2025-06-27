
import { useState, useEffect } from 'react';
import { StaffMember, Service } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

export const useStaffForService = (service: Service, staffMembers: StaffMember[]) => {
  const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableStaff = async () => {
      setLoading(true);
      try {
        console.log('Checking staff that can perform service:', service.id);

        // Obtener SOLO el personal que puede realizar este servicio específico
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
          setAvailableStaff([]);
          return;
        }

        console.log('Staff services found:', staffServices);

        if (!staffServices || staffServices.length === 0) {
          console.log('No staff assigned to this service');
          setAvailableStaff([]);
          return;
        }

        // Filtrar solo el personal activo que puede realizar este servicio
        const serviceStaff = staffServices
          .map(ss => ss.staff_members)
          .filter(staff => staff?.is_active) as StaffMember[];
        
        console.log('Active staff that can perform this service:', serviceStaff);
        setAvailableStaff(serviceStaff);

      } catch (error) {
        console.error('Error:', error);
        setAvailableStaff([]);
      } finally {
        setLoading(false);
      }
    };

    if (staffMembers.length > 0) {
      fetchAvailableStaff();
    }
  }, [staffMembers, service.id]);

  return { availableStaff, loading };
};
