
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Plus } from 'lucide-react';

interface EmptyTimeBlocksStateProps {
  onCreateTimeBlock: () => void;
}

const EmptyTimeBlocksState = ({ onCreateTimeBlock }: EmptyTimeBlocksStateProps) => {
  return (
    <Card className="border-dashed border-2 border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin bloqueos de horario</h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          Crea excepciones de disponibilidad para bloquear horarios específicos cuando tu personal no esté disponible
        </p>
        <Button onClick={onCreateTimeBlock} className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Crear Primer Bloqueo
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyTimeBlocksState;
