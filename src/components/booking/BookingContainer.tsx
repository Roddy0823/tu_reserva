
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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <BookingHeader business={business} />
        
        {!isMobile && <BookingSteps currentStep={currentStep} steps={steps} />}

        <div className={`mx-auto ${isMobile ? 'mt-4' : 'mt-12'} ${isMobile ? 'max-w-full px-2' : 'max-w-3xl'}`}>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-slate-200 overflow-hidden">
            <div className={`${isMobile ? 'p-3 sm:p-4' : 'p-6 sm:p-8'}`}>
              {isMobile && (
                <div className="mb-4 sm:mb-6 text-center">
                  <div className="text-xs sm:text-sm text-slate-600 mb-2">
                    Paso {currentStep} de {steps.length}
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 sm:h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm sm:text-base font-medium text-slate-800">
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
