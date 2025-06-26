
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { StaffMember } from '@/types/database';
import { useAvailableTimeSlots } from '@/hooks/useAvailableTimeSlots';
import { useEffect } from 'react';

interface StaffDateTimeSelectionProps {
  business: any;
  bookingData: any;
  updateBookingData: (data: any) => void;
}

const StaffDateTimeSelection = ({ business, bookingData, updateBookingData }: StaffDateTimeSelectionProps) => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(bookingData.date);

  const { availableSlots, isLoading: slotsLoading } = useAvailableTimeSlots(
    bookingData.staff?.id,
    selectedDate,
    bookingData.service?.duration_minutes
  );

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
    updateBookingData({ 
      staff: staffMember, 
      date: undefined, 
      time: undefined 
    });
    setSelectedDate(undefined);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      updateBookingData({ date, time: undefined });
    }
  };

  const handleTimeSelect = (time: string) => {
    updateBookingData({ time });
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

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  return (
    <div className="space-y-6">
      {/* Service Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-blue-900 mb-1">Servicio seleccionado:</p>
        <div className="flex items-center justify-between">
          <span className="text-blue-800">{bookingData.service.name}</span>
          <Badge variant="secondary">${bookingData.service.price}</Badge>
        </div>
      </div>

      {/* Staff Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1. Selecciona el profesional</h3>
        <div className="grid gap-3">
          {staff.map((staffMember) => (
            <Card
              key={staffMember.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                bookingData.staff?.id === staffMember.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleStaffSelect(staffMember)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{staffMember.full_name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      {bookingData.staff && (
        <div>
          <h3 className="text-lg font-semibold mb-4">2. Selecciona la fecha</h3>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < today || date > maxDate}
              initialFocus
              locale={es}
              className="rounded-md border"
            />
          </div>
          {selectedDate && (
            <div className="text-center mt-4">
              <Badge variant="outline">
                {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Time Selection */}
      {selectedDate && bookingData.staff && (
        <div>
          <h3 className="text-lg font-semibold mb-4">3. Selecciona la hora</h3>
          {slotsLoading ? (
            <div className="text-center py-4">Cargando horarios disponibles...</div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No hay horarios disponibles para esta fecha.</p>
              <p className="text-sm text-gray-500 mt-2">Por favor, selecciona otra fecha.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {availableSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={bookingData.time === slot ? "default" : "outline"}
                  onClick={() => handleTimeSelect(slot)}
                  className="h-12"
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selection Summary */}
      {bookingData.staff && selectedDate && bookingData.time && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Tu selección:</h4>
          <div className="space-y-1 text-sm text-green-800">
            <p><strong>Profesional:</strong> {bookingData.staff.full_name}</p>
            <p><strong>Fecha:</strong> {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}</p>
            <p><strong>Hora:</strong> {bookingData.time}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDateTimeSelection;
