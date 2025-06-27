
import { Service } from '@/types/database';
import ServiceCard from './ServiceCard';

interface ServicesGridProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

const ServicesGrid = ({ services, onEdit, onDelete }: ServicesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ServicesGrid;
