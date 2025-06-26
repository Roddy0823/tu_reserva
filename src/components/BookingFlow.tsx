
import { useState } from 'react';
import { useBusinessBySlug } from '@/hooks/useBusinessBySlug';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';
import ServiceSelection from './booking/ServiceSelection';
import StaffDateTimeSelection from './booking/StaffDateTimeSelection';
import ClientDetails from './booking/ClientDetails';
import BookingSummary from './booking/BookingSummary';
import PaymentStep from './booking/PaymentStep';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const BookingFlow = ({ businessSlug }: { businessSlug: string }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>({
    service: null,
    staff: null,
    date: null,
    time: null,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
  });
  const [appointment, setAppointment] = useState<any>(null);

  const { business, isLoading: isBusinessLoading, error: businessError } = useBusinessBySlug(businessSlug);

  if (isBusinessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (businessError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">Error al cargar el negocio.</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No encontrado</h1>
          <p className="text-gray-600">Negocio no encontrado.</p>
        </div>
      </div>
    );
  }

  const updateBookingData = (data: any) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const canProceedToNext = () => {
    switch (step) {
      case 1: return bookingData.service;
      case 2: return bookingData.staff && bookingData.date && bookingData.time;
      case 3: return bookingData.clientName && bookingData.clientEmail;
      default: return false;
    }
  };

  const stepTitles = [
    'Selecciona un Servicio',
    'Profesional, Fecha y Hora',
    'Tus Datos',
    'Confirmar Reserva',
    'Completado'
  ];

  const currentProgress = (step / 5) * 100;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Business Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
        <p className="text-gray-600">Reserva tu cita en {stepTitles.length} pasos simples</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Paso {step} de {stepTitles.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(currentProgress)}% completado
          </span>
        </div>
        <Progress value={currentProgress} className="h-2" />
      </div>

      {/* Step Title and Back Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{stepTitles[step - 1]}</h2>
        {step > 1 && step < 5 && (
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
        )}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        {step === 1 && (
          <ServiceSelection
            business={business}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        )}

        {step === 2 && (
          <StaffDateTimeSelection
            business={business}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        )}

        {step === 3 && (
          <ClientDetails
            business={business}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        )}

        {step === 4 && (
          <BookingSummary
            business={business}
            bookingData={bookingData}
            updateBookingData={(data) => {
              if (data.appointment) {
                setAppointment(data.appointment);
                setStep(5);
              } else {
                updateBookingData(data);
              }
            }}
          />
        )}

        {step === 5 && appointment && (
          <PaymentStep
            appointment={appointment}
            businessBankDetails={business?.bank_account_details}
            onComplete={() => {
              console.log('Payment process completed');
            }}
          />
        )}
      </div>

      {/* Next Button */}
      {step >= 1 && step <= 3 && (
        <Button 
          onClick={handleNext} 
          className="w-full h-12 text-lg font-medium"
          disabled={!canProceedToNext()}
        >
          {step === 3 ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Revisar y Confirmar
            </>
          ) : (
            'Siguiente'
          )}
        </Button>
      )}
    </div>
  );
};

export default BookingFlow;
