
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface BookingStepsProps {
  currentStep: number;
  steps: Step[];
  onStepClick?: (stepNumber: number) => void;
}

const BookingSteps = ({ currentStep, steps, onStepClick }: BookingStepsProps) => {
  return (
    <div className="mb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress bar background */}
        <div className="relative">
          <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200"></div>
          <div 
            className="absolute top-6 left-0 h-0.5 bg-gray-900 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const stepNumber = step.number;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              const isClickable = stepNumber < currentStep && onStepClick;
              
              return (
                <div 
                  key={step.number} 
                  className={`flex flex-col items-center ${isClickable ? 'cursor-pointer group' : ''}`}
                  onClick={() => isClickable && onStepClick(stepNumber)}
                >
                  {/* Step circle */}
                  <div className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 z-10
                    ${isCompleted 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                      : isActive 
                        ? 'bg-white text-gray-900 border-gray-900 shadow-sm' 
                        : 'bg-white text-gray-400 border-gray-200'
                    }
                    ${isClickable ? 'group-hover:border-gray-600 group-hover:scale-105' : ''}
                  `}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  
                  {/* Step content */}
                  <div className="mt-4 text-center min-w-0 max-w-[120px]">
                    <div className={`
                      text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? 'text-gray-900' 
                        : isCompleted 
                          ? 'text-gray-700' 
                          : 'text-gray-400'
                      }
                      ${isClickable ? 'group-hover:text-gray-600' : ''}
                    `}>
                      {step.title}
                    </div>
                    <div className={`
                      text-xs mt-1 transition-all duration-300
                      ${isActive 
                        ? 'text-gray-600' 
                        : isCompleted 
                          ? 'text-gray-500' 
                          : 'text-gray-400'
                      }
                      ${isClickable ? 'group-hover:text-gray-500' : ''}
                    `}>
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSteps;
