
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTimeBlocks } from '@/hooks/useTimeBlocks';
import { useStaff } from '@/hooks/useStaff';
import TimeBlockForm from './TimeBlockForm';
import { TimeBlock } from '@/types/database';
import { Plus, Edit, Trash2, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TimeBlockManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTimeBlock, setEditingTimeBlock] = useState<(TimeBlock & { staff_members: { full_name: string } }) | null>(null);
  
  const { getAllTimeBlocks, createTimeBlock, updateTimeBlock, deleteTimeBlock, isCreating, isUpdating, isDeleting } = useTimeBlocks();
  const { staffMembers } = useStaff();
  const { data: timeBlocks = [], isLoading } = getAllTimeBlocks();

  const handleCreateTimeBlock = (data: any) => {
    createTimeBlock(data, {
      onSuccess: () => {
        setShowForm(false);
      }
    });
  };

  const handleUpdateTimeBlock = (data: any) => {
    if (editingTimeBlock) {
      updateTimeBlock(
        { id: editingTimeBlock.id, updates: data },
        {
          onSuccess: () => {
            setEditingTimeBlock(null);
            setShowForm(false);
          }
        }
      );
    }
  };

  const handleEdit = (timeBlock: TimeBlock & { staff_members: { full_name: string } }) => {
    setEditingTimeBlock(timeBlock);
    setShowForm(true);
  };

  const handleDelete = (timeBlockId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este bloqueo?')) {
      deleteTimeBlock(timeBlockId);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTimeBlock(null);
  };

  if (showForm) {
    return (
      <TimeBlockForm
        timeBlock={editingTimeBlock || undefined}
        staffMembers={staffMembers}
        onSubmit={editingTimeBlock ? handleUpdateTimeBlock : handleCreateTimeBlock}
        onCancel={handleCancel}
        isLoading={isCreating || isUpdating}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Gestión de Bloqueos</h3>
          <p className="text-gray-600">Administra los horarios bloqueados de tu personal</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Bloquear Horario
        </Button>
      </div>

      {timeBlocks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay horarios bloqueados</h3>
            <p className="text-gray-600 text-center mb-4">
              Comienza bloqueando horarios para gestionar la disponibilidad de tu personal
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Primer Bloqueo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {timeBlocks.map((timeBlock) => (
            <TimeBlockCard
              key={timeBlock.id}
              timeBlock={timeBlock}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TimeBlockCard = ({ 
  timeBlock, 
  onEdit, 
  onDelete, 
  isDeleting 
}: { 
  timeBlock: TimeBlock & { staff_members: { full_name: string } };
  onEdit: (timeBlock: TimeBlock & { staff_members: { full_name: string } }) => void;
  onDelete: (timeBlockId: string) => void;
  isDeleting: boolean;
}) => {
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

export default TimeBlockManagement;
