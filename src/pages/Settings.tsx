
import { useBusiness } from '@/hooks/useBusiness';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Globe, Link, User } from 'lucide-react';
import BusinessProfileSettings from '@/components/settings/BusinessProfileSettings';
import PublicPageSettings from '@/components/settings/PublicPageSettings';
import IntegrationsSettings from '@/components/settings/IntegrationsSettings';
import AccountSettings from '@/components/settings/AccountSettings';

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
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona toda la configuración de tu negocio y cuenta
        </p>
      </div>

      <Tabs defaultValue="business-profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business-profile" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Perfil del Negocio
          </TabsTrigger>
          <TabsTrigger value="public-page" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Página Pública
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Integraciones
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Cuenta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business-profile">
          <BusinessProfileSettings business={business} />
        </TabsContent>

        <TabsContent value="public-page">
          <PublicPageSettings business={business} />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsSettings />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettings business={business} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
