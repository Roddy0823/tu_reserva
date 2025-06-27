
import { ReactNode } from 'react';
import { Business } from '@/types/database';
import BookingHeader from './BookingHeader';
import BookingSteps from './BookingSteps';

interface BookingContainerProps {
  business: Business;
  currentStep: number;
  steps: Array<{ number: number; title: string; description: string }>;
  children: ReactNode;
}

const BookingContainer = ({ business, currentStep, steps, children }: BookingContainerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <BookingHeader business={business} />
        <BookingSteps currentStep={currentStep} steps={steps} />

        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingContainer;
