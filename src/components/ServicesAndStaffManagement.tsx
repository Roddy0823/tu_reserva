
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users } from 'lucide-react';
import ServicesManagement from './ServicesManagement';
import StaffManagement from './StaffManagement';

const ServicesAndStaffManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'staff') {
      setActiveTab('staff');
    } else {
      setActiveTab('services');
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams(value === 'staff' ? { tab: 'staff' } : {});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Servicios y Personal</h1>
          <p className="text-lg text-gray-600">Administra los servicios y el personal de tu negocio</p>
        </div>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Panel de Administración
            </CardTitle>
            <CardDescription className="text-blue-100">
              Gestiona todos los aspectos de tu negocio desde un solo lugar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 m-6 mb-0">
                <TabsTrigger value="services" className="flex items-center gap-2 text-base py-3">
                  <Package className="h-4 w-4" />
                  Servicios
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-2 text-base py-3">
                  <Users className="h-4 w-4" />
                  Personal
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="services" className="mt-0">
                <div className="p-6">
                  <ServicesManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="staff" className="mt-0">
                <div className="p-6">
                  <StaffManagement />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServicesAndStaffManagement;
