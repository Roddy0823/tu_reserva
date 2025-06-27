
import { Service } from '@/types/database';
import { Clock } from 'lucide-react';

interface ServiceInfoProps {
  service: Service;
}

const ServiceInfo = ({ service }: ServiceInfoProps) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-4">
      <div className="flex items-center gap-2 text-slate-800">
        <Clock className="h-4 w-4" />
        <span className="font-medium">{service.name}</span>
        <span className="text-slate-600">• {service.duration_minutes} min</span>
        <span className="text-slate-600">• ${service.price?.toLocaleString()} COP</span>
      </div>
    </div>
  );
};

export default ServiceInfo;
