
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TimeBlock, StaffMember } from '@/types/database';
import { Edit, Trash2, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface StaffAvailabilityCardProps {
  staff: StaffMember;
  timeBlocks: (TimeBlock & { staff_members: { full_name: string } })[];
  onEditTimeBlock: (timeBlock: TimeBlock & { staff_members: { full_name: string } }) => void;
  onDeleteTimeBlock: (timeBlockId: string) => void;
  isDeleting: boolean;
}

const StaffAvailabilityCard = ({ 
  staff, 
  timeBlocks, 
  onEditTimeBlock, 
  onDeleteTimeBlock, 
  isDeleting 
}: StaffAvailabilityCardProps) => {
  const activeTimeBlocks = timeBlocks.filter(block => new Date(block.end_time) >= new Date());
  const pastTimeBlocks = timeBlocks.filter(block => new Date(block.end_time) < new Date());

  const getBlockStatus = (timeBlock: TimeBlock) => {
    const startDate = new Date(timeBlock.start_time);
    const endDate = new Date(timeBlock.end_time);
    const now = new Date();

    if (endDate < now) return 'past';
    if (startDate <= now && endDate >= now) return 'current';
    return 'upcoming';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'past':
        return <Badge variant="secondary" className="text-xs">Pasado</Badge>;
      case 'current':
        return <Badge variant="destructive" className="text-xs">En curso</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Próximo</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-gray-900">{staff.full_name}</CardTitle>
              <p className="text-sm text-gray-500">
                {staff.is_active ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Horario regular</p>
            <p className="text-xs text-gray-400">Disponible según servicios configurados</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Bloqueos activos */}
        {activeTimeBlocks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Excepciones de Disponibilidad</h4>
            <div className="space-y-3">
              {activeTimeBlocks.map((timeBlock) => (
                <div key={timeBlock.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {format(new Date(timeBlock.start_time), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                        </span>
                        {getStatusBadge(getBlockStatus(timeBlock))}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {format(new Date(timeBlock.start_time), "HH:mm")} - {format(new Date(timeBlock.end_time), "HH:mm")}
                        </span>
                      </div>
                      {timeBlock.reason && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Motivo:</strong> {timeBlock.reason}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditTimeBlock(timeBlock)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteTimeBlock(timeBlock.id)}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bloqueos pasados */}
        {pastTimeBlocks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Historial de Bloqueos</h4>
            <div className="space-y-2">
              {pastTimeBlocks.slice(0, 3).map((timeBlock) => (
                <div key={timeBlock.id} className="bg-gray-25 rounded-lg p-3 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(timeBlock.start_time), "dd/MM/yyyy HH:mm")} - {format(new Date(timeBlock.end_time), "HH:mm")}
                      </div>
                      {timeBlock.reason && (
                        <p className="text-xs text-gray-400 mt-1">{timeBlock.reason}</p>
                      )}
                    </div>
                    {getStatusBadge(getBlockStatus(timeBlock))}
                  </div>
                </div>
              ))}
              {pastTimeBlocks.length > 3 && (
                <p className="text-xs text-gray-400 text-center py-2">
                  +{pastTimeBlocks.length - 3} bloqueos anteriores
                </p>
              )}
            </div>
          </div>
        )}

        {/* Estado sin bloqueos */}
        {timeBlocks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Sin excepciones de disponibilidad</p>
            <p className="text-xs text-gray-400 mt-1">Disponible según horario regular de servicios</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffAvailabilityCard;
