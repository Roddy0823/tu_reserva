
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStaff } from '@/hooks/useStaff';
import { useServices } from '@/hooks/useServices';
import { useStaffServices } from '@/hooks/useStaffServices';
import StaffForm from './StaffForm';
import { StaffMember } from '@/types/database';
import { Plus, Edit, Trash2, Mail, User, Camera } from 'lucide-react';

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Personal</h2>
          <p className="text-gray-600 mt-2">Administra los miembros de tu equipo con fotos y servicios</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
          <Plus className="h-4 w-4" />
          Agregar Personal
        </Button>
      </div>

      {staffMembers.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay personal registrado</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Comienza agregando miembros a tu equipo para gestionar las citas de manera eficiente
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
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

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg overflow-hidden">
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarImage 
                  src={staff.photo_url} 
                  alt={staff.full_name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                  {getInitials(staff.full_name)}
                </AvatarFallback>
              </Avatar>
              {!staff.photo_url && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900">{staff.full_name}</CardTitle>
              {staff.email && (
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-3 w-3 text-gray-500" />
                  <p className="text-sm text-gray-600">{staff.email}</p>
                </div>
              )}
            </div>
          </div>
          <Badge 
            variant={staff.is_active ? "default" : "secondary"}
            className={staff.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
          >
            {staff.is_active ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {staffServices.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Servicios que realiza:</h4>
            <div className="flex flex-wrap gap-2">
              {staffServices.map((service: any) => (
                <Badge 
                  key={service.id} 
                  variant="outline" 
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  {service.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(staff)}
            className="gap-2 hover:bg-blue-50 hover:border-blue-200"
          >
            <Edit className="h-3 w-3" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(staff.id)}
            disabled={isDeleting}
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
          >
            <Trash2 className="h-3 w-3" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffManagement;
