
import { useState } from 'react';

export const useBookingSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: 'Servicio', description: 'Selecciona tu servicio' },
    { number: 2, title: 'Personal', description: 'Elige tu profesional' },
    { number: 3, title: 'Fecha y Hora', description: 'Agenda tu cita' },
    { number: 4, title: 'Información', description: 'Datos de contacto' },
    { number: 5, title: 'Confirmar', description: 'Revisa y confirma' }
  ];

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goNext = () => {
    setCurrentStep(currentStep + 1);
  };

  return {
    currentStep,
    steps,
    goToStep,
    goBack,
    goNext,
    setCurrentStep
  };
};
