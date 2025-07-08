
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
    <Card className="group card-interactive hover-glow bg-card border-border/50 hover:border-border transition-all duration-200">
      <CardHeader className="pb-4 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors truncate">
              {service.name}
            </CardTitle>
            {service.description && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                {service.description}
              </p>
            )}
          </div>
          {service.image_url && (
            <div className="flex-shrink-0">
              <img
                src={service.image_url}
                alt={service.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-border"
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3 sm:space-y-4 p-4 sm:p-6">
        {/* Price and Duration */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
            <span className="font-semibold text-foreground">
              ${service.price?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span>{service.duration_minutes} min</span>
          </div>
        </div>
        
        {/* Payment Methods */}
        {(service.accepts_cash || service.accepts_transfer) && (
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {service.accepts_cash && (
              <Badge variant="outline" className="text-xs font-medium border-border text-muted-foreground">
                Efectivo
              </Badge>
            )}
            {service.accepts_transfer && (
              <Badge variant="outline" className="text-xs font-medium border-border text-muted-foreground">
                Transferencia
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-border">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(service)}
            className="flex-1 text-xs sm:text-sm h-8 sm:h-9 hover:bg-muted"
          >
            <Edit className="h-3 w-3 sm:mr-2" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(service.id)}
            className="text-destructive hover:bg-destructive-subtle hover:text-destructive h-8 sm:h-9 px-2 sm:px-3"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
