
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ServiceInfo from './ServiceInfo';
import { Service } from '@/types/database';

interface StaffSelectionHeaderProps {
  service: Service;
  onBack: () => void;
}

const StaffSelectionHeader = ({ service, onBack }: StaffSelectionHeaderProps) => {
  return (
    <CardHeader className="pb-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <CardTitle className="text-xl text-slate-900">Selecciona tu Especialista</CardTitle>
          <p className="text-slate-600">Personal especializado en este servicio</p>
        </div>
      </div>
      
      <ServiceInfo service={service} />
    </CardHeader>
  );
};

export default StaffSelectionHeader;
