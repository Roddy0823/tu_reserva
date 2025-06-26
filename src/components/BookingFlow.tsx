
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceSelection from './booking/ServiceSelection';
import StaffSelection from './booking/StaffSelection';
import DateSelection from './booking/DateSelection';
import TimeSelection from './booking/TimeSelection';
import ClientDetails from './booking/ClientDetails';
import BookingSummary from './booking/BookingSummary';
import { useBusinessBySlug } from '@/hooks/useBusinessBySlug';
import { Service, StaffMember } from '@/types/database';

interface BookingData {
  service?: Service;
  staff?: StaffMember;
  date?: Date;
  time?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

interface BookingFlowProps {
  businessSlug: string;
}

const BookingFlow = ({ businessSlug }: BookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const { business, isLoading } = useBusinessBySlug(businessSlug);

  const steps = [
    { id: 1, title: 'Seleccionar Servicio', component: ServiceSelection },
    { id: 2, title: 'Seleccionar Profesional', component: StaffSelection },
    { id: 3, title: 'Seleccionar Fecha', component: DateSelection },
    { id: 4, title: 'Seleccionar Horario', component: TimeSelection },
    { id: 5, title: 'Datos del Cliente', component: ClientDetails },
    { id: 6, title: 'Confirmar Reserva', component: BookingSummary },
  ];

  const canGoNext = () => {
    switch (currentStep) {
      case 1: return !!bookingData.service;
      case 2: return !!bookingData.staff;
      case 3: return !!bookingData.date;
      case 4: return !!bookingData.time;
      case 5: return !!(bookingData.clientName && bookingData.clientEmail);
      default: return false;
    }
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Negocio no encontrado</h1>
          <p className="text-gray-600">El negocio que buscas no existe o no está disponible.</p>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
        <p className="text-gray-600">Reserva tu cita en línea</p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">
          Paso {currentStep} de {steps.length}: {steps[currentStep - 1].title}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            business={business}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        
        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            disabled={!canGoNext()}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default BookingFlow;
