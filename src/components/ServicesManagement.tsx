
import { useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import { Service } from '@/types/database';
import ServiceForm from './ServiceForm';
import ServicesHeader from './services/ServicesHeader';
import EmptyServicesState from './services/EmptyServicesState';
import ServicesGrid from './services/ServicesGrid';
import ServicesLoadingGrid from './services/ServicesLoadingGrid';

const ServicesManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { services, isLoading, deleteService, createService, updateService } = useServices();
  const { toast } = useToast();

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        await deleteService(serviceId);
        toast({
          title: "Servicio eliminado",
          description: "El servicio se ha eliminado correctamente",
        });
      } catch (error: any) {
        toast({
          title: "Error al eliminar servicio",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingService(null);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingService) {
        await updateService({ id: editingService.id, ...data });
        toast({
          title: "Servicio actualizado",
          description: "El servicio se ha actualizado correctamente",
        });
      } else {
        await createService(data);
        toast({
          title: "Servicio creado",
          description: "El servicio se ha creado correctamente",
        });
      }
      handleFormClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isFormOpen) {
    return (
      <ServiceForm
        service={editingService}
        onSubmit={handleFormSubmit}
        onCancel={handleFormClose}
        isLoading={false}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <ServicesHeader onNewService={() => setIsFormOpen(true)} />

      {isLoading ? (
        <ServicesLoadingGrid />
      ) : services.length === 0 ? (
        <EmptyServicesState onCreateFirst={() => setIsFormOpen(true)} />
      ) : (
        <ServicesGrid
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ServicesManagement;
