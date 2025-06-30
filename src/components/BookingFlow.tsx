
import { useState, useEffect } from 'react';
import { useBusinessBySlug } from '@/hooks/useBusinessBySlug';
import { useServices } from '@/hooks/useServices';
import { useStaff } from '@/hooks/useStaff';
import { useIsMobile } from '@/hooks/use-mobile';
import { Appointment } from '@/types/database';
import BookingHeader from './booking/BookingHeader';
import BookingSuccess from './booking/BookingSuccess';
import PaymentStep from './booking/PaymentStep';
import BookingLoadingState from './booking/BookingLoadingState';
import BookingErrorState from './booking/BookingErrorState';
import BookingContainer from './booking/BookingContainer';
import BookingStepRenderer from './booking/BookingStepRenderer';
import { useBookingData } from './booking/hooks/useBookingData';
import { useBookingSteps } from './booking/hooks/useBookingSteps';
import { useBookingHandlers } from './booking/hooks/useBookingHandlers';

interface BookingFlowProps {
  businessSlug: string;
}

const BookingFlow = ({ businessSlug }: BookingFlowProps) => {
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const isMobile = useIsMobile();

  const { business, isLoading: businessLoading, error: businessError } = useBusinessBySlug(businessSlug);
  
  // Pasar businessId a los hooks para filtrar por negocio específico
  const { services, isLoading: servicesLoading } = useServices(business?.id);
  const { staffMembers, isLoading: staffLoading } = useStaff(business?.id);
  
  const { bookingData, updateBookingData } = useBookingData();
  const { currentStep, steps, goToStep, goBack } = useBookingSteps();
  
  const {
    handleServiceSelect,
    handleStaffSelect,
    handleDateTimeSelect,
    handleClientDetailsSubmit,
    handleBookingConfirm,
    isCreating
  } = useBookingHandlers({
    bookingData,
    updateBookingData,
    goToStep,
    goNext: () => goToStep(currentStep + 1),
    businessId: business?.id,
    setCreatedAppointment
  });

  // Optimización para móviles - scroll to top en cambio de paso
  useEffect(() => {
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, isMobile]);

  const handlePaymentComplete = () => {
    goToStep(7); // Ir al paso de éxito
  };

  if (businessLoading) {
    return <BookingLoadingState />;
  }

  if (businessError || !business) {
    return <BookingErrorState />;
  }

  // Success page
  if (currentStep === 7 && createdAppointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-4 sm:py-8">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <BookingHeader business={business} />
          <div className="max-w-2xl mx-auto mt-6 sm:mt-8">
            <PaymentStep
              appointment={createdAppointment}
              service={bookingData.service}
              businessBankDetails={business.bank_account_details}
              onComplete={handlePaymentComplete}
              onBack={() => goToStep(5)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <BookingContainer 
      business={business} 
      currentStep={currentStep} 
      steps={steps}
    >
      <BookingStepRenderer
        currentStep={currentStep}
        bookingData={bookingData}
        services={services}
        staffMembers={staffMembers}
        servicesLoading={servicesLoading}
        staffLoading={staffLoading}
        isCreating={isCreating}
        onServiceSelect={handleServiceSelect}
        onStaffSelect={handleStaffSelect}
        onDateTimeSelect={handleDateTimeSelect}
        onClientDetailsSubmit={handleClientDetailsSubmit}
        onBookingConfirm={handleBookingConfirm}
        onBack={goBack}
      />
    </BookingContainer>
  );
};

export default BookingFlow;
