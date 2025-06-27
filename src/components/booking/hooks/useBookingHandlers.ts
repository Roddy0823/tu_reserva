
import { Service, StaffMember, Appointment, AppointmentStatus } from '@/types/database';
import { BookingData } from './useBookingData';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';

interface UseBookingHandlersProps {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  goToStep: (step: number) => void;
  goNext: () => void;
  businessId?: string;
  setCreatedAppointment: (appointment: Appointment) => void;
}

export const useBookingHandlers = ({ 
  bookingData, 
  updateBookingData, 
  goToStep, 
  goNext, 
  businessId,
  setCreatedAppointment 
}: UseBookingHandlersProps) => {
  const { createAppointment, isCreating } = useCreateAppointment();

  const handleServiceSelect = (service: Service) => {
    updateBookingData({ service });
    goToStep(2);
  };

  const handleStaffSelect = (staffMember: StaffMember) => {
    updateBookingData({ staffMember });
    goToStep(3);
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    updateBookingData({ date, time });
    goToStep(4);
  };

  const handleClientDetailsSubmit = (clientData: { name: string; email: string; phone: string }) => {
    updateBookingData({
      clientName: clientData.name,
      clientEmail: clientData.email,
      clientPhone: clientData.phone
    });
    goToStep(5);
  };

  const handleBookingConfirm = async () => {
    if (!bookingData.service || !bookingData.staffMember || !bookingData.date || !bookingData.time || !businessId) {
      return;
    }

    const [hours, minutes] = bookingData.time.split(':').map(Number);
    const startTime = new Date(bookingData.date);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + bookingData.service.duration_minutes);

    const appointmentData = {
      business_id: businessId,
      service_id: bookingData.service.id,
      staff_id: bookingData.staffMember.id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      client_name: bookingData.clientName || '',
      client_email: bookingData.clientEmail || '',
      client_phone: bookingData.clientPhone || '',
      status: 'pendiente' as const,
      payment_status: 'pendiente' as const
    };

    createAppointment(appointmentData, {
      onSuccess: (appointment) => {
        const appointmentWithDetails: Appointment = {
          ...appointment,
          status: appointment.status as AppointmentStatus,
          services: {
            name: bookingData.service!.name,
            price: bookingData.service!.price,
            duration_minutes: bookingData.service!.duration_minutes
          },
          staff_members: {
            full_name: bookingData.staffMember!.full_name
          }
        };
        setCreatedAppointment(appointmentWithDetails);
        
        // Si el servicio acepta transferencias, ir al paso de pago
        if (bookingData.service!.accepts_transfer) {
          goToStep(6); // Paso de pago
        } else {
          goToStep(7); // Paso de éxito
        }
      }
    });
  };

  return {
    handleServiceSelect,
    handleStaffSelect,
    handleDateTimeSelect,
    handleClientDetailsSubmit,
    handleBookingConfirm,
    isCreating
  };
};
