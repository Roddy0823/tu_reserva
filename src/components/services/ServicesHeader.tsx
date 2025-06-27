
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServicesHeaderProps {
  onNewService: () => void;
}

const ServicesHeader = ({ onNewService }: ServicesHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Servicios</h2>
        <p className="text-gray-500 mt-1">Gestiona los servicios de tu negocio</p>
      </div>
      <Button 
        onClick={onNewService} 
        className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Servicio
      </Button>
    </div>
  );
};

export default ServicesHeader;
