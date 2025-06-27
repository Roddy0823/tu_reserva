
import { Checkbox } from '@/components/ui/checkbox';
import { Service } from '@/types/database';

interface StaffServicesSelectionProps {
  services: Service[];
  selectedServices: string[];
  onServiceToggle: (serviceId: string, checked: boolean) => void;
}

const StaffServicesSelection = ({ services, selectedServices, onServiceToggle }: StaffServicesSelectionProps) => {
  if (services.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Servicios que puede realizar</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg">
        {services.map((service) => (
          <div key={service.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
            <Checkbox
              id={service.id}
              checked={selectedServices.includes(service.id)}
              onCheckedChange={(checked) => 
                onServiceToggle(service.id, checked as boolean)
              }
            />
            <label
              htmlFor={service.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
            >
              <div className="font-semibold">{service.name}</div>
              <div className="text-xs text-gray-500">{service.duration_minutes} min - ${service.price}</div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffServicesSelection;
