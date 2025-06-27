
import { Service, StaffMember } from '@/types/database';
import { BookingData } from './hooks/useBookingData';
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
  switch (currentStep) {
    case 1:
      return (
        <ServiceSelection
          services={services}
          isLoading={servicesLoading}
          onServiceSelect={onServiceSelect}
        />
      );

    case 2:
      if (!bookingData.service) return null;
      return (
        <StaffSelection
          service={bookingData.service}
          staffMembers={staffMembers}
          isLoading={staffLoading}
          onStaffSelect={onStaffSelect}
          onBack={onBack}
        />
      );

    case 3:
      if (!bookingData.service || !bookingData.staffMember) return null;
      return (
        <StaffDateTimeSelection
          service={bookingData.service}
          staffMember={bookingData.staffMember}
          onDateTimeSelect={onDateTimeSelect}
          onBack={onBack}
        />
      );

    case 4:
      return (
        <ClientDetails
          onSubmit={onClientDetailsSubmit}
          onBack={onBack}
        />
      );

    case 5:
      if (!bookingData.service || !bookingData.staffMember || !bookingData.date || !bookingData.time) return null;
      return (
        <BookingSummary
          bookingData={bookingData}
          onConfirm={onBookingConfirm}
          onBack={onBack}
          isLoading={isCreating}
        />
      );

    default:
      return null;
  }
};

export default BookingStepRenderer;
