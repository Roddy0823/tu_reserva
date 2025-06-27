
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface BookingStepsProps {
  currentStep: number;
  steps: Step[];
}

const BookingSteps = ({ currentStep, steps }: BookingStepsProps) => {
  return (
    <div className="mb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress bar background */}
        <div className="relative">
          <div className="absolute top-6 left-0 w-full h-1 bg-slate-200 rounded-full"></div>
          <div 
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const stepNumber = step.number;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  {/* Step circle */}
                  <div className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-4 transition-all duration-300 z-10
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-lg scale-105' 
                      : isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-500 shadow-lg scale-110' 
                        : 'bg-white text-slate-400 border-slate-300 shadow-sm'
                    }
                  `}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                    
                    {/* Active step pulse */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-blue-500 opacity-25 animate-ping"></div>
                    )}
                  </div>
                  
                  {/* Step content */}
                  <div className="mt-4 text-center min-w-0 max-w-[120px]">
                    <div className={`
                      text-sm font-semibold transition-all duration-300
                      ${isActive 
                        ? 'text-blue-600' 
                        : isCompleted 
                          ? 'text-green-600' 
                          : 'text-slate-500'
                      }
                    `}>
                      {step.title}
                    </div>
                    <div className={`
                      text-xs mt-1 transition-all duration-300
                      ${isActive 
                        ? 'text-blue-500' 
                        : isCompleted 
                          ? 'text-green-500' 
                          : 'text-slate-400'
                      }
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
