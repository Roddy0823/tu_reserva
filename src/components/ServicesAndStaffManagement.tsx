
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Servicios y Personal</h1>
          <p className="text-gray-600">Gestiona los servicios que ofreces y tu equipo de trabajo</p>
        </div>

        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              {/* Navigation Tabs - Centered */}
              <div className="border-b border-gray-200 px-6">
                <TabsList className="h-12 bg-transparent p-0 w-full justify-start">
                  <TabsTrigger 
                    value="services" 
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent bg-transparent hover:text-gray-900 text-gray-600"
                  >
                    <Package className="h-4 w-4" />
                    Servicios
                  </TabsTrigger>
                  <TabsTrigger 
                    value="staff" 
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent bg-transparent hover:text-gray-900 text-gray-600"
                  >
                    <Users className="h-4 w-4" />
                    Personal
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="services" className="mt-0 p-6">
                <ServicesManagement />
              </TabsContent>
              
              <TabsContent value="staff" className="mt-0 p-6">
                <StaffManagement />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServicesAndStaffManagement;
