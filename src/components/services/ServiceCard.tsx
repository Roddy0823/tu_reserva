
import { Edit, Trash2, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/types/database';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

const ServiceCard = ({ service, onEdit, onDelete }: ServiceCardProps) => {
  return (
    <Card className="group border-gray-200 hover:shadow-lg transition-all duration-200 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium text-gray-900 group-hover:text-slate-700 transition-colors truncate">
              {service.name}
            </CardTitle>
            {service.description && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                {service.description}
              </p>
            )}
          </div>
          {service.image_url && (
            <div className="ml-4 flex-shrink-0">
              <img
                src={service.image_url}
                alt={service.name}
                className="w-14 h-14 rounded-lg object-cover border border-gray-200"
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price and Duration */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold text-gray-900">
              ${service.price?.toLocaleString()} COP
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>{service.duration_minutes} min</span>
          </div>
        </div>
        
        {/* Payment Methods */}
        {(service.accepts_cash || service.accepts_transfer) && (
          <div className="flex flex-wrap gap-2">
            {service.accepts_cash && (
              <Badge variant="outline" className="text-xs font-medium border-gray-200 text-gray-600">
                Efectivo
              </Badge>
            )}
            {service.accepts_transfer && (
              <Badge variant="outline" className="text-xs font-medium border-gray-200 text-gray-600">
                Transferencia
              </Badge>
            )}
          </div>
        )}

        {/* Actions - Updated to match StaffCard style */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(service)}
            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
          >
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(service.id)}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
