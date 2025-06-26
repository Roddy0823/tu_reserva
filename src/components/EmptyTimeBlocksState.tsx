
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Plus } from 'lucide-react';

interface EmptyTimeBlocksStateProps {
  onCreateTimeBlock: () => void;
}

const EmptyTimeBlocksState = ({ onCreateTimeBlock }: EmptyTimeBlocksStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay horarios bloqueados</h3>
        <p className="text-gray-600 text-center mb-4">
          Comienza bloqueando horarios para gestionar la disponibilidad de tu personal
        </p>
        <Button onClick={onCreateTimeBlock} className="gap-2">
          <Plus className="h-4 w-4" />
          Crear Primer Bloqueo
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyTimeBlocksState;
