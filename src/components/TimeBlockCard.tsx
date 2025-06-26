
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimeBlock } from '@/types/database';
import { Edit, Trash2, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TimeBlockCardProps {
  timeBlock: TimeBlock & { staff_members: { full_name: string } };
  onEdit: (timeBlock: TimeBlock & { staff_members: { full_name: string } }) => void;
  onDelete: (timeBlockId: string) => void;
  isDeleting: boolean;
}

const TimeBlockCard = ({ 
  timeBlock, 
  onEdit, 
  onDelete, 
  isDeleting 
}: TimeBlockCardProps) => {
  const startDate = new Date(timeBlock.start_time);
  const endDate = new Date(timeBlock.end_time);
  const isOngoing = startDate <= new Date() && endDate >= new Date();
  const isPast = endDate < new Date();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-500" />
              <CardTitle className="text-lg">{timeBlock.staff_members.full_name}</CardTitle>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-3 w-3" />
                {format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-3 w-3" />
                {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
              </div>
            </div>
          </div>
          <Badge variant={isPast ? "secondary" : isOngoing ? "destructive" : "default"}>
            {isPast ? "Pasado" : isOngoing ? "En curso" : "Próximo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeBlock.reason && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Motivo:</h4>
              <p className="text-sm text-gray-600">{timeBlock.reason}</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(timeBlock)}
              className="gap-1"
            >
              <Edit className="h-3 w-3" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(timeBlock.id)}
              disabled={isDeleting}
              className="gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeBlockCard;
