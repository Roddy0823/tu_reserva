
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RecentActivityProps {
  activities: Array<{
    id: string;
    client_name: string;
    start_time: string;
    status: 'pendiente' | 'confirmado' | 'cancelado';
    services: { name: string } | null;
    staff_members: { full_name: string } | null;
    created_at: string;
  }>;
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Pendiente';
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Actividad Reciente</span>
          </CardTitle>
          <CardDescription>Últimos turnos agendados o modificados</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Actividad Reciente</span>
        </CardTitle>
        <CardDescription>Últimos turnos agendados o modificados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{activity.client_name}</span>
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
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(activity.start_time), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Creado: {format(new Date(activity.created_at), "dd/MM HH:mm", { locale: es })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
