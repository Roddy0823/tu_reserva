
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Servicios y Personal</h1>
          <p className="mt-2 text-sm text-gray-600">Administra los servicios y el personal de tu negocio</p>
        </div>

        {/* Clean Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="border-b border-gray-200 mb-6">
            <TabsList className="h-10 w-auto bg-transparent p-0 space-x-8">
              <TabsTrigger 
                value="services" 
                className="border-b-2 border-transparent bg-transparent px-1 pb-3 pt-2 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent"
              >
                <Package className="h-4 w-4 mr-2" />
                Servicios
              </TabsTrigger>
              <TabsTrigger 
                value="staff" 
                className="border-b-2 border-transparent bg-transparent px-1 pb-3 pt-2 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent"
              >
                <Users className="h-4 w-4 mr-2" />
                Personal
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="services" className="mt-0">
            <ServicesManagement />
          </TabsContent>
          
          <TabsContent value="staff" className="mt-0">
            <StaffManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ServicesAndStaffManagement;
