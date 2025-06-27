
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TimeBlock, StaffMember } from '@/types/database';
import { Edit, Trash2, Calendar, Clock, User, Plus, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface StaffAvailabilityCardProps {
  staff: StaffMember;
  timeBlocks: (TimeBlock & { staff_members: { full_name: string } })[];
  onEditTimeBlock: (timeBlock: TimeBlock & { staff_members: { full_name: string } }) => void;
  onDeleteTimeBlock: (timeBlockId: string) => void;
  onAddException: () => void;
  isDeleting: boolean;
}

const StaffAvailabilityCard = ({ 
  staff, 
  timeBlocks, 
  onEditTimeBlock, 
  onDeleteTimeBlock, 
  onAddException,
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

  const getWorkingDays = () => {
    const days = [];
    if (staff.works_monday) days.push('L');
    if (staff.works_tuesday) days.push('M');
    if (staff.works_wednesday) days.push('X');
    if (staff.works_thursday) days.push('J');
    if (staff.works_friday) days.push('V');
    if (staff.works_saturday) days.push('S');
    if (staff.works_sunday) days.push('D');
    return days.join('-');
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {staff.photo_url ? (
                <img src={staff.photo_url} alt={staff.full_name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-gray-900">{staff.full_name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={staff.is_active ? "default" : "secondary"} className="text-xs">
                  {staff.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
                {staff.email && (
                  <span className="text-xs text-gray-500">{staff.email}</span>
                )}
              </div>
            </div>
          </div>
          <Button 
            onClick={onAddException}
            size="sm"
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Excepción
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Horario Regular */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-medium text-blue-900">Horario Regular de Trabajo</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                {staff.work_start_time || '08:00'} - {staff.work_end_time || '18:00'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-blue-800">
              <Calendar className="h-4 w-4" />
              <Badge className="bg-blue-200 text-blue-800 text-xs">
                {getWorkingDays() || 'L-V'}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            Horario base para la disponibilidad de reservas
          </p>
        </div>

        {/* Excepciones activas */}
        {activeTimeBlocks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-500" />
              Excepciones de Disponibilidad
            </h4>
            <div className="space-y-3">
              {activeTimeBlocks.map((timeBlock) => (
                <div key={timeBlock.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-900">
                          {format(new Date(timeBlock.start_time), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                        </span>
                        {getStatusBadge(getBlockStatus(timeBlock))}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-700">
                          {format(new Date(timeBlock.start_time), "HH:mm")} - {format(new Date(timeBlock.end_time), "HH:mm")}
                        </span>
                      </div>
                      {timeBlock.reason && (
                        <p className="text-sm text-red-700 mt-2">
                          <strong>Motivo:</strong> {timeBlock.reason}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditTimeBlock(timeBlock)}
                        className="h-8 w-8 p-0 border-red-200 hover:bg-red-50"
                      >
                        <Edit className="h-3 w-3 text-red-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteTimeBlock(timeBlock.id)}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
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

        {/* Excepciones pasadas */}
        {pastTimeBlocks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Historial de Excepciones</h4>
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
                  +{pastTimeBlocks.length - 3} excepciones anteriores
                </p>
              )}
            </div>
          </div>
        )}

        {/* Estado sin excepciones */}
        {timeBlocks.length === 0 && (
          <div className="text-center py-6 text-gray-500 bg-gray-25 rounded-lg">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium">Sin excepciones de disponibilidad</p>
            <p className="text-xs text-gray-400 mt-1">
              Disponible según horario regular: {staff.work_start_time || '08:00'} - {staff.work_end_time || '18:00'} ({getWorkingDays() || 'L-V'})
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffAvailabilityCard;
