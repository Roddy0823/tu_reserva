
import { Service, StaffMember } from '@/types/database';
import { BookingData } from './hooks/useBookingData';
import { useIsMobile } from '@/hooks/use-mobile';
import ServiceSelection from './ServiceSelection';
import StaffSelection from './StaffSelection';
import StaffDateTimeSelection from './StaffDateTimeSelection';
import ClientDetails from './ClientDetails';
import BookingSummary from './BookingSummary';

interface BookingStepRendererProps {
  currentStep: number;
  bookingData: BookingData;
  services: Service[];
  staffMembers: StaffMember[];
  servicesLoading: boolean;
  staffLoading: boolean;
  isCreating: boolean;
  onServiceSelect: (service: Service) => void;
  onStaffSelect: (staffMember: StaffMember) => void;
  onDateTimeSelect: (date: Date, time: string) => void;
  onClientDetailsSubmit: (clientData: { name: string; email: string; phone: string }) => void;
  onBookingConfirm: () => void;
  onBack: () => void;
}

const BookingStepRenderer = ({
  currentStep,
  bookingData,
  services,
  staffMembers,
  servicesLoading,
  staffLoading,
  isCreating,
  onServiceSelect,
  onStaffSelect,
  onDateTimeSelect,
  onClientDetailsSubmit,
  onBookingConfirm,
  onBack
}: BookingStepRendererProps) => {
  const isMobile = useIsMobile();

  // Wrapper para optimización móvil
  const MobileOptimizedWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!isMobile) return <>{children}</>;
    
    return (
      <div className="space-y-4">
        {children}
      </div>
    );
  };

  switch (currentStep) {
    case 1:
      return (
        <MobileOptimizedWrapper>
          <ServiceSelection
            services={services}
            isLoading={servicesLoading}
            onServiceSelect={onServiceSelect}
          />
        </MobileOptimizedWrapper>
      );

    case 2:
      if (!bookingData.service) return null;
      return (
        <MobileOptimizedWrapper>
          <StaffSelection
            service={bookingData.service}
            staffMembers={staffMembers}
            isLoading={staffLoading}
            onStaffSelect={onStaffSelect}
            onBack={onBack}
          />
        </MobileOptimizedWrapper>
      );

    case 3:
      if (!bookingData.service || !bookingData.staffMember) return null;
      return (
        <MobileOptimizedWrapper>
          <StaffDateTimeSelection
            service={bookingData.service}
            staffMember={bookingData.staffMember}
            onDateTimeSelect={onDateTimeSelect}
            onBack={onBack}
          />
        </MobileOptimizedWrapper>
      );

    case 4:
      return (
        <MobileOptimizedWrapper>
          <ClientDetails
            onSubmit={onClientDetailsSubmit}
            onBack={onBack}
          />
        </MobileOptimizedWrapper>
      );

    case 5:
      if (!bookingData.service || !bookingData.staffMember || !bookingData.date || !bookingData.time) return null;
      return (
        <MobileOptimizedWrapper>
          <BookingSummary
            bookingData={bookingData}
            onConfirm={onBookingConfirm}
            onBack={onBack}
            isLoading={isCreating}
          />
        </MobileOptimizedWrapper>
      );

    default:
      return null;
  }
};

export default BookingStepRenderer;
