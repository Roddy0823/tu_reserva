
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTimeBlocks } from '@/hooks/useTimeBlocks';
import { useStaff } from '@/hooks/useStaff';
import { useAppointments } from '@/hooks/useAppointments';
import TimeBlockForm from './TimeBlockForm';
import CalendarView from './CalendarView';
import TimeBlockCard from './TimeBlockCard';
import EmptyTimeBlocksState from './EmptyTimeBlocksState';
import { TimeBlock, Appointment } from '@/types/database';
import { Plus, Calendar, List } from 'lucide-react';

const AvailabilityManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTimeBlock, setEditingTimeBlock] = useState<(TimeBlock & { staff_members: { full_name: string } }) | null>(null);
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('calendar');
  
  const { getAllTimeBlocks, createTimeBlock, updateTimeBlock, deleteTimeBlock, isCreating, isUpdating, isDeleting } = useTimeBlocks();
  const { staffMembers } = useStaff();
  const { appointments } = useAppointments();
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

  const handleEditTimeBlock = (timeBlock: TimeBlock & { staff_members: { full_name: string } }) => {
    setEditingTimeBlock(timeBlock);
    setShowForm(true);
  };

  const handleEditAppointment = (appointment: Appointment & { staff_members: { full_name: string }, services: { name: string } }) => {
    // TODO: Implementar edición de citas
    console.log('Editar cita:', appointment);
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
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Disponibilidad</h2>
          <p className="text-gray-600 mt-2">Administra los horarios bloqueados y visualiza las citas programadas</p>
        </div>
        <div className="flex items-center space-x-4">
          <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as 'calendar' | 'list')}>
            <TabsList>
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="h-4 w-4" />
                Calendario
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Bloquear Horario
          </Button>
        </div>
      </div>

      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as 'calendar' | 'list')}>
        <TabsContent value="calendar">
          <CalendarView
            timeBlocks={timeBlocks}
            appointments={appointments}
            onCreateTimeBlock={() => setShowForm(true)}
            onEditTimeBlock={handleEditTimeBlock}
            onEditAppointment={handleEditAppointment}
          />
        </TabsContent>
        
        <TabsContent value="list">
          {timeBlocks.length === 0 ? (
            <EmptyTimeBlocksState onCreateTimeBlock={() => setShowForm(true)} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {timeBlocks.map((timeBlock) => (
                <TimeBlockCard
                  key={timeBlock.id}
                  timeBlock={timeBlock}
                  onEdit={handleEditTimeBlock}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvailabilityManagement;
