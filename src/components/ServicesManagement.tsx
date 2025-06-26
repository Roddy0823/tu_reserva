
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/database';
import { Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import ServiceForm from './ServiceForm';

const ServicesManagement = () => {
  const { services, isLoading, createService, updateService, deleteService, isCreating, isUpdating, isDeleting } = useServices();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleCreateService = (data: any) => {
    createService(data, {
      onSuccess: () => {
        setShowForm(false);
      }
    });
  };

  const handleUpdateService = (data: any) => {
    if (editingService) {
      updateService({ id: editingService.id, updates: data }, {
        onSuccess: () => {
          setEditingService(null);
        }
      });
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      deleteService(id);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingService(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando servicios...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ServiceForm
          service={editingService || undefined}
          onSubmit={editingService ? handleUpdateService : handleCreateService}
          onCancel={handleCancelForm}
          isLoading={isCreating || isUpdating}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
          <p className="text-gray-600">Administra los servicios que ofrece tu negocio</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios registrados</h3>
              <p className="text-gray-500 mb-4">Comienza creando tu primer servicio</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Servicio
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    {service.description && (
                      <CardDescription className="mt-2">
                        {service.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{service.duration_minutes} min</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>${service.price}</span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
