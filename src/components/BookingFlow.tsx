import { useState } from 'react';
import { useBusinessBySlug } from '@/hooks/useBusinessBySlug';
import { useServices } from '@/hooks/useServices';
import { useStaff } from '@/hooks/useStaff';
import { useCreateAppointment } from '@/hooks/useCreateAppointment';
import ServiceSelection from './booking/ServiceSelection';
import StaffSelection from './booking/StaffSelection';
import DateSelection from './booking/DateSelection';
import TimeSelection from './booking/TimeSelection';
import ClientDetails from './booking/ClientDetails';
import BookingSummary from './booking/BookingSummary';
import PaymentStep from './booking/PaymentStep';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { addMinutes, format } from 'date-fns';

const BookingFlow = ({ businessSlug }: { businessSlug: string }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientData, setClientData] = useState<any>(null);
  const [newAppointment, setNewAppointment] = useState<any>(null);

  const { business, isLoading: isBusinessLoading, error: businessError } = useBusinessBySlug(businessSlug);
  const { services, isLoading: isServicesLoading, error: servicesError } = useServices(business?.id);
  const { staff, isLoading: isStaffLoading, error: staffError } = useStaff(business?.id);
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

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime || !clientData || !business) return;

    const startTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = addMinutes(startTime, selectedService.duration_minutes);

    const appointmentData = {
      business_id: business.id,
      service_id: selectedService.id,
      staff_id: selectedStaff.id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      client_name: clientData.name,
      client_email: clientData.email,
      client_phone: clientData.phone || null,
    };

    createAppointment(appointmentData, {
      onSuccess: (data) => {
        setNewAppointment(data);
        setStep(7); // Move to payment step
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">{business.name}</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Paso {step}</h2>
        {step > 1 && (
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
            services={services}
            onServiceSelect={(service) => {
              setSelectedService(service);
              handleNext();
            }}
            isLoading={isServicesLoading}
          />
        </div>
      )}

      {step === 2 && selectedService && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Selecciona un Profesional</h2>
          <StaffSelection
            staff={staff}
            serviceId={selectedService.id}
            onStaffSelect={(staff) => {
              setSelectedStaff(staff);
              handleNext();
            }}
            isLoading={isStaffLoading}
          />
        </div>
      )}

      {step === 3 && selectedService && selectedStaff && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Selecciona una Fecha</h2>
          <DateSelection
            onDateSelect={(date) => {
              setSelectedDate(date);
              handleNext();
            }}
          />
        </div>
      )}

      {step === 4 && selectedService && selectedStaff && selectedDate && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Selecciona una Hora</h2>
          <TimeSelection
            staffId={selectedStaff.id}
            date={selectedDate}
            serviceDuration={selectedService.duration_minutes}
            onTimeSelect={(time) => {
              setSelectedTime(time);
              handleNext();
            }}
          />
        </div>
      )}

      {step === 5 && selectedService && selectedStaff && selectedDate && selectedTime && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Tus Datos</h2>
          <ClientDetails
            onClientDetailsSubmit={(data) => {
              setClientData(data);
              handleNext();
            }}
          />
        </div>
      )}

        {step === 6 && selectedService && selectedStaff && selectedDate && selectedTime && clientData && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Resumen de tu Reserva</h2>
            <BookingSummary
              service={selectedService}
              staff={selectedStaff}
              date={selectedDate}
              time={selectedTime}
              clientData={clientData}
              onConfirm={handleConfirmBooking}
              isLoading={isCreating}
            />
          </div>
        )}

        {step === 7 && newAppointment && (
          <div>
            <h2 className="text-2xl font-bold mb-6">¡Reserva Completada!</h2>
            <PaymentStep
              appointment={newAppointment}
              businessBankDetails={business?.bank_account_details}
              onComplete={() => {
                // Could redirect to a success page or show final message
                console.log('Payment process completed');
              }}
            />
          </div>
        )}

      {step < 6 && step !== 1 && (
        <Button onClick={handleNext} className="mt-4">
          Siguiente
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default BookingFlow;
