import { AppointmentStatus } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppointmentStatusFilterProps {
  selectedStatus?: AppointmentStatus | 'all';
  onStatusChange: (status: AppointmentStatus | 'all') => void;
  stats: {
    pendiente: number;
    confirmado: number;
    cancelado: number;
    completado: number;
    total: number;
    pendingPaymentApprovals: number;
  };
}

const AppointmentStatusFilter = ({ selectedStatus = 'all', onStatusChange, stats }: AppointmentStatusFilterProps) => {
  const statusOptions = [
    { 
      value: 'all' as const, 
      label: 'Todas', 
      count: stats.total, 
      color: 'bg-gray-100 text-gray-800' 
    },
    { 
      value: 'pendiente' as const, 
      label: 'Pendientes', 
      count: stats.pendiente, 
      color: 'bg-yellow-100 text-yellow-800',
      sublabel: stats.pendingPaymentApprovals > 0 ? `${stats.pendingPaymentApprovals} esperando pago` : undefined
    },
    { 
      value: 'confirmado' as const, 
      label: 'Confirmadas', 
      count: stats.confirmado, 
      color: 'bg-green-100 text-green-800' 
    },
    { 
      value: 'completado' as const, 
      label: 'Completadas', 
      count: stats.completado, 
      color: 'bg-blue-100 text-blue-800' 
    },
    { 
      value: 'cancelado' as const, 
      label: 'Canceladas', 
      count: stats.cancelado, 
      color: 'bg-red-100 text-red-800' 
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Filtrar por Estado</h3>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedStatus === option.value ? "default" : "outline"}
            onClick={() => onStatusChange(option.value)}
            className={cn(
              "relative",
              selectedStatus === option.value && "ring-2 ring-blue-500"
            )}
          >
            <div className="flex items-center gap-2">
              <span>{option.label}</span>
              <Badge className={option.color}>
                {option.count}
              </Badge>
            </div>
            {option.sublabel && (
              <div className="absolute -bottom-6 left-0 text-xs text-amber-600 whitespace-nowrap">
                {option.sublabel}
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AppointmentStatusFilter;