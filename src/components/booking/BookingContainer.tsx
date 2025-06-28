
import { ReactNode } from 'react';
import { Business } from '@/types/database';
import { useIsMobile } from '@/hooks/use-mobile';
import BookingHeader from './BookingHeader';
import BookingSteps from './BookingSteps';

interface BookingContainerProps {
  business: Business;
  currentStep: number;
  steps: Array<{ number: number; title: string; description: string }>;
  children: ReactNode;
}

const BookingContainer = ({ business, currentStep, steps, children }: BookingContainerProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <BookingHeader business={business} />
        
        {!isMobile && <BookingSteps currentStep={currentStep} steps={steps} />}

        <div className={`mx-auto ${isMobile ? 'mt-6' : 'mt-12'} ${isMobile ? 'max-w-full' : 'max-w-3xl'}`}>
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className={`${isMobile ? 'p-4 sm:p-6' : 'p-8'}`}>
              {isMobile && (
                <div className="mb-6 text-center">
                  <div className="text-sm text-slate-600 mb-2">
                    Paso {currentStep} de {steps.length}
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 font-medium text-slate-800">
                    {steps.find(s => s.number === currentStep)?.title}
                  </div>
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingContainer;
