
import { useState, useEffect } from 'react';
import { useBusinessBySlug } from '@/hooks/useBusinessBySlug';
import { useServices } from '@/hooks/useServices';
import { useStaff } from '@/hooks/useStaff';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';
import { Service, StaffMember, Appointment } from '@/types/database';
import BookingHeader from './booking/BookingHeader';
import BookingSteps from './booking/BookingSteps';
import ServiceSelection from './booking/ServiceSelection';
import StaffSelection from './booking/StaffSelection';
import StaffDateTimeSelection from './booking/StaffDateTimeSelection';
import ClientDetails from './booking/ClientDetails';
import BookingSummary from './booking/BookingSummary';
import BookingSuccess from './booking/BookingSuccess';

interface BookingFlowProps {
  businessSlug: string;
}

export interface BookingData {
  service?: Service;
  staffMember?: StaffMember;
  date?: Date;
  time?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

const BookingFlow = ({ businessSlug }: BookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  const { business, isLoading: businessLoading, error: businessError } = useBusinessBySlug(businessSlug);
  const { services, isLoading: servicesLoading } = useServices();
  const { staffMembers, isLoading: staffLoading } = useStaff();
  const { createAppointment, isCreating } = useCreateAppointment();

  const steps = [
    'Servicio',
    'Personal',
    'Fecha/Hora',
    'Datos',
    'Confirmar'
  ];

  // Reset services and staff when business changes
  useEffect(() => {
    if (business) {
      // Services and staff will be fetched automatically through hooks
    }
  }, [business]);

  const handleServiceSelect = (service: Service) => {
    setBookingData(prev => ({ ...prev, service }));
    setCurrentStep(2);
  };

  const handleStaffSelect = (staffMember: StaffMember) => {
    setBookingData(prev => ({ ...prev, staffMember }));
    setCurrentStep(3);
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setBookingData(prev => ({ ...prev, date, time }));
    setCurrentStep(4);
  };

  const handleClientDetailsSubmit = (clientData: { name: string; email: string; phone: string }) => {
    setBookingData(prev => ({
      ...prev,
      clientName: clientData.name,
      clientEmail: clientData.email,
      clientPhone: clientData.phone
    }));
    setCurrentStep(5);
  };

  const handleBookingConfirm = async () => {
    if (!bookingData.service || !bookingData.staffMember || !bookingData.date || !bookingData.time || !business) {
      return;
    }

    const [hours, minutes] = bookingData.time.split(':').map(Number);
    const startTime = new Date(bookingData.date);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + bookingData.service.duration_minutes);

    const appointmentData = {
      business_id: business.id,
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
        setCreatedAppointment(appointment);
        setCurrentStep(6);
      }
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando información del negocio...</p>
        </div>
      </div>
    );
  }

  if (businessError || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Negocio no encontrado</h1>
          <p className="text-gray-600">La URL de reserva no es válida o el negocio no existe.</p>
        </div>
      </div>
    );
  }

  // Success page
  if (currentStep === 6 && createdAppointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <BookingSuccess
            business={business}
            appointment={createdAppointment}
            service={bookingData.service!}
            staffMember={bookingData.staffMember!}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <BookingHeader business={business} />
        <BookingSteps currentStep={currentStep} steps={steps} />

        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <ServiceSelection
              services={services}
              isLoading={servicesLoading}
              onServiceSelect={handleServiceSelect}
            />
          )}

          {currentStep === 2 && bookingData.service && (
            <StaffSelection
              service={bookingData.service}
              staffMembers={staffMembers}
              isLoading={staffLoading}
              onStaffSelect={handleStaffSelect}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && bookingData.service && bookingData.staffMember && (
            <StaffDateTimeSelection
              service={bookingData.service}
              staffMember={bookingData.staffMember}
              onDateTimeSelect={handleDateTimeSelect}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <ClientDetails
              onSubmit={handleClientDetailsSubmit}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && bookingData.service && bookingData.staffMember && bookingData.date && bookingData.time && (
            <BookingSummary
              bookingData={bookingData}
              onConfirm={handleBookingConfirm}
              onBack={handleBack}
              isLoading={isCreating}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
