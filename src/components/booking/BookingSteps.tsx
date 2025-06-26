
import { Check } from 'lucide-react';

interface BookingStepsProps {
  currentStep: number;
  steps: string[];
}

const BookingSteps = ({ currentStep, steps }: BookingStepsProps) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${isCompleted 
                    ? 'bg-green-500 text-white border-green-500 shadow-lg' 
                    : isActive 
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-110' 
                      : 'bg-white text-gray-400 border-gray-300'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`
                  mt-3 text-sm font-medium text-center px-2 transition-all
                  ${isActive 
                    ? 'text-blue-600 font-semibold' 
                    : isCompleted 
                      ? 'text-green-600 font-medium' 
                      : 'text-gray-500'
                  }
                `}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-1 mx-4 mt-[-20px] rounded-full transition-all
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingSteps;
