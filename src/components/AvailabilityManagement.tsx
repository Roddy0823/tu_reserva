
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List, Plus } from 'lucide-react';
import AvailabilityCalendar from './AvailabilityCalendar';
import TimeBlockManagement from './TimeBlockManagement';

const AvailabilityManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Disponibilidad</h2>
          <p className="text-gray-600 mt-2">Administra los horarios y citas de tu personal</p>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendario
          </TabsTrigger>
          <TabsTrigger value="blocks" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Bloqueos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <AvailabilityCalendar />
        </TabsContent>

        <TabsContent value="blocks">
          <TimeBlockManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvailabilityManagement;
