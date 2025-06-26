
import { useState } from 'react';
import { useBusinessBySlug } from '@/hooks/useBusinessBySlug';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';
import ServiceSelection from './booking/ServiceSelection';
import StaffSelection from './booking/StaffSelection';
import DateSelection from './booking/DateSelection';
import TimeSelection from './booking/TimeSelection';
import ClientDetails from './booking/ClientDetails';
import BookingSummary from './booking/BookingSummary';
import PaymentStep from './booking/PaymentStep';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { addMinutes } from 'date-fns';

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
  const { createAppointment, isCreating } = useCreateAppointment();

  if (isBusinessLoading) {
    return <div>Cargando negocio...</div>;
  }

  if (businessError) {
    return <div>Error al cargar el negocio.</div>;
  }

  if (!business) {
    return <div>Negocio no encontrado.</div>;
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
      case 2: return bookingData.staff;
      case 3: return bookingData.date;
      case 4: return bookingData.time;
      case 5: return bookingData.clientName && bookingData.clientEmail;
      default: return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">{business.name}</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Paso {step}</h2>
        {step > 1 && step < 7 && (
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
        )}
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Selecciona un Servicio</h2>
          <ServiceSelection
            business={business}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Selecciona un Profesional</h2>
          <StaffSelection
            business={business}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Selecciona una Fecha</h2>
          <DateSelection
            business={business}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Selecciona una Hora</h2>
          <TimeSelection
            business={business}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Tus Datos</h2>
          <ClientDetails
            business={business}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        </div>
      )}

      {step === 6 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Resumen de tu Reserva</h2>
          <BookingSummary
            business={business}
            bookingData={bookingData}
            updateBookingData={(data) => {
              if (data.appointment) {
                setAppointment(data.appointment);
                setStep(7);
              } else {
                updateBookingData(data);
              }
            }}
          />
        </div>
      )}

      {step === 7 && appointment && (
        <div>
          <h2 className="text-2xl font-bold mb-6">¡Reserva Completada!</h2>
          <PaymentStep
            appointment={appointment}
            businessBankDetails={business?.bank_account_details}
            onComplete={() => {
              console.log('Payment process completed');
            }}
          />
        </div>
      )}

      {step >= 1 && step <= 5 && canProceedToNext() && (
        <Button onClick={handleNext} className="mt-4 w-full">
          Siguiente
        </Button>
      )}
    </div>
  );
};

export default BookingFlow;
