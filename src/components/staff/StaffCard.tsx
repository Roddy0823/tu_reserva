
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StaffMember } from '@/types/database';
import { Edit, Trash2, Mail, Camera } from 'lucide-react';

interface StaffCardProps {
  staff: StaffMember;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
  isDeleting: boolean;
  getStaffServices: (staffId: string) => any;
}

const StaffCard = ({ staff, onEdit, onDelete, isDeleting, getStaffServices }: StaffCardProps) => {
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
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-gray-100">
                <AvatarImage 
                  src={staff.photo_url} 
                  alt={staff.full_name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                  {getInitials(staff.full_name)}
                </AvatarFallback>
              </Avatar>
              {!staff.photo_url && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="h-3 w-3 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-base font-medium text-gray-900">{staff.full_name}</CardTitle>
              {staff.email && (
                <div className="flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <p className="text-xs text-gray-600">{staff.email}</p>
                </div>
              )}
            </div>
          </div>
          <Badge 
            variant={staff.is_active ? "default" : "secondary"}
            className={staff.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}
          >
            {staff.is_active ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {staffServices.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Servicios que realiza:</h4>
            <div className="flex flex-wrap gap-1">
              {staffServices.map((service: any) => (
                <Badge 
                  key={service.id} 
                  variant="outline" 
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  {service.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(staff)}
            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
          >
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(staff.id)}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffCard;
