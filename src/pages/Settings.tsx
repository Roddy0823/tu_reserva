
import { useBusiness } from '@/hooks/useBusiness';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Bell, CreditCard, Building, Calendar } from 'lucide-react';
import BusinessInfoSettings from '@/components/settings/BusinessInfoSettings';
import BookingRulesSettings from '@/components/settings/BookingRulesSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import GoogleCalendarSettings from '@/components/settings/GoogleCalendarSettings';

const SettingsPage = () => {
  const { business, isLoading } = useBusiness();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No se encontró información del negocio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configuración del Negocio</h1>
        <p className="text-gray-600 mt-2">
          Gestiona la configuración y ajustes de tu negocio
        </p>
      </div>

      <Tabs defaultValue="business-info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="business-info" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Información
          </TabsTrigger>
          <TabsTrigger value="booking-rules" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Reglas de Reserva
          </TabsTrigger>
          <TabsTrigger value="google-calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Google Calendar
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Facturación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business-info">
          <BusinessInfoSettings business={business} />
        </TabsContent>

        <TabsContent value="booking-rules">
          <BookingRulesSettings business={business} />
        </TabsContent>

        <TabsContent value="google-calendar">
          <GoogleCalendarSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings business={business} />
        </TabsContent>

        <TabsContent value="billing">
          <BillingSettings business={business} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
