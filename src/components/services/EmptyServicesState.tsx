
import { Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyServicesStateProps {
  onCreateFirst: () => void;
}

const EmptyServicesState = ({ onCreateFirst }: EmptyServicesStateProps) => {
  return (
    <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">No hay servicios</h3>
        <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
          Comienza agregando tu primer servicio para que los clientes puedan hacer reservas
        </p>
        <Button 
          onClick={onCreateFirst} 
          className="bg-slate-900 hover:bg-slate-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Primer Servicio
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyServicesState;
