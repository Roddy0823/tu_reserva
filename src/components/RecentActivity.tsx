
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, Clock } from 'lucide-react';

interface RecentActivityItem {
  id: string;
  client_name: string;
  start_time: string;
  status: 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
  services: { name: string } | null;
  staff_members: { full_name: string } | null;
  created_at: string;
}

interface RecentActivityProps {
  activities: RecentActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      case 'completado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmada';
      case 'pendiente': return 'Pendiente';
      case 'cancelado': return 'Cancelada';
      case 'completado': return 'Completada';
      default: return status;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No hay actividad reciente</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{activity.client_name}</span>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {getStatusText(activity.status)}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  {activity.services && (
                    <div>Servicio: {activity.services.name}</div>
                  )}
                  {activity.staff_members && (
                    <div>Personal: {activity.staff_members.full_name}</div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {format(new Date(activity.start_time), "dd 'de' MMMM 'a las' HH:mm", { locale: es })}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-400">
                {format(new Date(activity.created_at), "dd/MM/yyyy", { locale: es })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentActivity;
