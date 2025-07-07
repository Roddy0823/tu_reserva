
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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

  const getDaySchedules = () => {
    const schedules = [];
    const dayMapping = [
      { day: 'Lunes', works: staff.works_monday, start: staff.monday_start_time, end: staff.monday_end_time },
      { day: 'Martes', works: staff.works_tuesday, start: staff.tuesday_start_time, end: staff.tuesday_end_time },
      { day: 'Miércoles', works: staff.works_wednesday, start: staff.wednesday_start_time, end: staff.wednesday_end_time },
      { day: 'Jueves', works: staff.works_thursday, start: staff.thursday_start_time, end: staff.thursday_end_time },
      { day: 'Viernes', works: staff.works_friday, start: staff.friday_start_time, end: staff.friday_end_time },
      { day: 'Sábado', works: staff.works_saturday, start: staff.saturday_start_time, end: staff.saturday_end_time },
      { day: 'Domingo', works: staff.works_sunday, start: staff.sunday_start_time, end: staff.sunday_end_time },
    ];

    return dayMapping.filter(d => d.works);
  };

  return (
    <Card className="card-elevated bg-card border-border/50 overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-background-subtle to-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center shadow-lg">
                {staff.photo_url ? (
                  <img src={staff.photo_url} alt={staff.full_name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-sm ${staff.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold text-foreground">{staff.full_name}</CardTitle>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={staff.is_active ? "default" : "secondary"} 
                  className={`status-indicator ${staff.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                >
                  {staff.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
                {staff.email && (
                  <span className="text-sm text-muted-foreground font-medium">{staff.email}</span>
                )}
              </div>
            </div>
          </div>
          <Button 
            onClick={onAddException}
            size="sm"
            className="btn-interactive hover-glow bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Excepción
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
        {/* Horario Regular con Accordion */}
        <Accordion type="single" defaultValue="schedule" collapsible>
          <AccordionItem value="schedule" className="border-border/30">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-subtle rounded-full flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-foreground">Horarios de Trabajo</h4>
                  <p className="text-sm text-muted-foreground">
                    {getDaySchedules().length} días configurados
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="grid gap-3 mt-4">
                {getDaySchedules().map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background-subtle rounded-lg border border-border/30 hover:border-border transition-colors">
                    <span className="font-medium text-foreground">{schedule.day}</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono">
                        {schedule.start || staff.work_start_time || '08:00'} - {schedule.end || staff.work_end_time || '18:00'}
                      </span>
                    </div>
                  </div>
                ))}
                {getDaySchedules().length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="font-medium">Sin horarios configurados</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Excepciones activas */}
        {activeTimeBlocks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-border/30">
              <div className="w-10 h-10 bg-destructive-subtle rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Excepciones Activas</h4>
                <p className="text-sm text-muted-foreground">{activeTimeBlocks.length} excepciones programadas</p>
              </div>
            </div>
            <div className="grid gap-4">
              {activeTimeBlocks.map((timeBlock) => (
                <div key={timeBlock.id} className="card-interactive bg-destructive-subtle border border-destructive/20 rounded-lg p-5 hover:border-destructive/40 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-destructive" />
                        <span className="font-medium text-destructive">
                          {format(new Date(timeBlock.start_time), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                        </span>
                        {getStatusBadge(getBlockStatus(timeBlock))}
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-destructive/70" />
                        <span className="font-mono text-destructive/90">
                          {format(new Date(timeBlock.start_time), "HH:mm")} - {format(new Date(timeBlock.end_time), "HH:mm")}
                        </span>
                      </div>
                      {timeBlock.reason && (
                        <div className="bg-white/60 rounded-lg p-3 border border-destructive/10">
                          <p className="text-sm text-destructive/80">
                            <span className="font-medium">Motivo:</span> {timeBlock.reason}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditTimeBlock(timeBlock)}
                        className="btn-interactive h-9 w-9 p-0 border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
                      >
                        <Edit className="h-4 w-4 text-destructive" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteTimeBlock(timeBlock.id)}
                        disabled={isDeleting}
                        className="btn-interactive h-9 w-9 p-0 border-destructive/30 hover:bg-destructive hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
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
          <div className="text-center py-12 bg-background-subtle rounded-xl border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Sin excepciones programadas</h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Personal disponible según horarios configurados ({getWorkingDays() || 'Sin horarios'})
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffAvailabilityCard;
