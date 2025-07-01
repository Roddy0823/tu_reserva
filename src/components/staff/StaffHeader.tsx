
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StaffHeaderProps {
  onNewStaff: () => void;
}

const StaffHeader = ({ onNewStaff }: StaffHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Personal</h2>
        <p className="text-gray-500 mt-1">Gestiona los miembros de tu equipo</p>
      </div>
      <Button 
        onClick={onNewStaff} 
        className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Personal
      </Button>
    </div>
  );
};

export default StaffHeader;
