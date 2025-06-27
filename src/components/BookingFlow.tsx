
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
import PaymentStep from './booking/PaymentStep';

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
    { number: 1, title: 'Servicio', description: 'Selecciona tu servicio' },
    { number: 2, title: 'Personal', description: 'Elige tu profesional' },
    { number: 3, title: 'Fecha y Hora', description: 'Agenda tu cita' },
    { number: 4, title: 'Información', description: 'Datos de contacto' },
    { number: 5, title: 'Confirmar', description: 'Revisa y confirma' }
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
        const appointmentWithDetails: Appointment = {
          ...appointment,
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
          setCurrentStep(6); // Paso de pago
        } else {
          setCurrentStep(7); // Paso de éxito
        }
      }
    });
  };

  // New navigation function that allows jumping to any previous step
  const handleNavigateToStep = (stepNumber: number) => {
    if (stepNumber < currentStep && stepNumber >= 1) {
      setCurrentStep(stepNumber);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentComplete = () => {
    setCurrentStep(7); // Ir al paso de éxito
  };

  if (businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (businessError || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-gray-600 text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Negocio no encontrado</h1>
          <p className="text-gray-600">La URL de reserva no es válida o el negocio no existe.</p>
        </div>
      </div>
    );
  }

  // Success page
  if (currentStep === 7 && createdAppointment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
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

  // Payment step for transfer services
  if (currentStep === 6 && createdAppointment && bookingData.service?.accepts_transfer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <BookingHeader business={business} />
          <div className="max-w-2xl mx-auto mt-8">
            <PaymentStep
              appointment={createdAppointment}
              service={bookingData.service}
              businessBankDetails={business.bank_account_details}
              onComplete={handlePaymentComplete}
              onBack={() => setCurrentStep(5)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <BookingHeader business={business} />
        <BookingSteps 
          currentStep={currentStep} 
          steps={steps}
          onStepClick={handleNavigateToStep}
        />

        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {currentStep === 1 && (
              <div className="p-8">
                <ServiceSelection
                  services={services}
                  isLoading={servicesLoading}
                  onServiceSelect={handleServiceSelect}
                />
              </div>
            )}

            {currentStep === 2 && bookingData.service && (
              <div className="p-8">
                <StaffSelection
                  service={bookingData.service}
                  staffMembers={staffMembers}
                  isLoading={staffLoading}
                  onStaffSelect={handleStaffSelect}
                  onBack={handleBack}
                />
              </div>
            )}

            {currentStep === 3 && bookingData.service && bookingData.staffMember && (
              <div className="p-8">
                <StaffDateTimeSelection
                  service={bookingData.service}
                  staffMember={bookingData.staffMember}
                  onDateTimeSelect={handleDateTimeSelect}
                  onBack={handleBack}
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="p-8">
                <ClientDetails
                  onSubmit={handleClientDetailsSubmit}
                  onBack={handleBack}
                />
              </div>
            )}

            {currentStep === 5 && bookingData.service && bookingData.staffMember && bookingData.date && bookingData.time && (
              <div className="p-8">
                <BookingSummary
                  bookingData={bookingData}
                  onConfirm={handleBookingConfirm}
                  onBack={handleBack}
                  isLoading={isCreating}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
