
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
    <Card className="card-interactive hover-glow bg-card border-border/50 hover:border-border transition-all duration-200">
      <CardHeader className="pb-4 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-border/50">
                <AvatarImage 
                  src={staff.photo_url} 
                  alt={staff.full_name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm font-medium">
                  {getInitials(staff.full_name)}
                </AvatarFallback>
              </Avatar>
              {!staff.photo_url && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm sm:text-base font-medium text-foreground truncate">
                {staff.full_name}
              </CardTitle>
              {staff.email && (
                <div className="flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground truncate">{staff.email}</p>
                </div>
              )}
            </div>
          </div>
          <Badge 
            variant={staff.is_active ? "default" : "secondary"}
            className={`text-xs flex-shrink-0 ${
              staff.is_active 
                ? "bg-green-100 text-green-700 border-green-200" 
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            {staff.is_active ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
        {staffServices.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Servicios:</h4>
            <div className="flex flex-wrap gap-1">
              {staffServices.map((service: any) => (
                <Badge 
                  key={service.id} 
                  variant="outline" 
                  className="text-xs bg-primary/5 text-primary border-primary/20"
                >
                  {service.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(staff)}
            className="text-muted-foreground hover:text-primary hover:bg-primary/5 h-8 text-xs"
          >
            <Edit className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(staff.id)}
            disabled={isDeleting}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 h-8 text-xs"
          >
            <Trash2 className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Eliminar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffCard;
