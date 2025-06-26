
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { useStaffServices } from '@/hooks/useStaffServices';
import StaffForm from './StaffForm';
import { StaffMember } from '@/types/database';
import { Plus, Edit, Trash2, Mail, User } from 'lucide-react';

const StaffManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  
  const { staffMembers, isLoading, createStaff, updateStaff, deleteStaff, isCreating, isUpdating, isDeleting } = useStaff();
  const { services } = useServices();
  const { getStaffServices } = useStaffServices();

  const handleCreateStaff = (data: any) => {
    createStaff(data, {
      onSuccess: () => {
        setShowForm(false);
      }
    });
  };

  const handleUpdateStaff = (data: any) => {
    if (editingStaff) {
      updateStaff(
        { id: editingStaff.id, updates: data },
        {
          onSuccess: () => {
            setEditingStaff(null);
            setShowForm(false);
          }
        }
      );
    }
  };

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setShowForm(true);
  };

  const handleDelete = (staffId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este miembro del personal?')) {
      deleteStaff(staffId);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStaff(null);
  };

  if (showForm) {
    return (
      <StaffForm
        staffMember={editingStaff || undefined}
        services={services}
        onSubmit={editingStaff ? handleUpdateStaff : handleCreateStaff}
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
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Personal</h2>
          <p className="text-gray-600 mt-2">Administra los miembros de tu equipo</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Personal
        </Button>
      </div>

      {staffMembers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay personal registrado</h3>
            <p className="text-gray-600 text-center mb-4">
              Comienza agregando miembros a tu equipo para gestionar las citas
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Primer Miembro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {staffMembers.map((staff) => (
            <StaffCard 
              key={staff.id} 
              staff={staff}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
              getStaffServices={getStaffServices}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StaffCard = ({ 
  staff, 
  onEdit, 
  onDelete, 
  isDeleting,
  getStaffServices 
}: { 
  staff: StaffMember;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
  isDeleting: boolean;
  getStaffServices: (staffId: string) => any;
}) => {
  const { data: staffServices = [] } = getStaffServices(staff.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{staff.full_name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              {staff.email && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Mail className="h-3 w-3" />
                  {staff.email}
                </div>
              )}
            </div>
          </div>
          <Badge variant={staff.is_active ? "default" : "secondary"}>
            {staff.is_active ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {staffServices.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Servicios:</h4>
              <div className="flex flex-wrap gap-1">
                {staffServices.map((service: any) => (
                  <Badge key={service.id} variant="outline" className="text-xs">
                    {service.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(staff)}
              className="gap-1"
            >
              <Edit className="h-3 w-3" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(staff.id)}
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

export default StaffManagement;
