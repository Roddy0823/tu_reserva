
import { useState } from 'react';
import { Plus, Edit, Trash2, Package, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';
import ServiceForm from './ServiceForm';

const ServicesManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { services, isLoading, deleteService, createService, updateService } = useServices();
  const { toast } = useToast();

  const handleEdit = (service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        await deleteService(serviceId);
        toast({
          title: "Servicio eliminado",
          description: "El servicio se ha eliminado correctamente",
        });
      } catch (error) {
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

  const handleFormSubmit = async (data) => {
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
    } catch (error) {
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
    <div className="space-y-8">
      {/* Clean Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Servicios</h2>
          <p className="text-gray-500 mt-1">Gestiona los servicios de tu negocio</p>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)} 
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Services Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : services.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No hay servicios</h3>
            <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
              Comienza agregando tu primer servicio para que los clientes puedan hacer reservas
            </p>
            <Button 
              onClick={() => setIsFormOpen(true)} 
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className="group border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 bg-white"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-slate-700 transition-colors truncate">
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
              
              <CardContent className="pt-0 space-y-4">
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

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(service)}
                    className="flex-1 border-gray-200 hover:border-slate-300 hover:bg-slate-50 text-gray-700 hover:text-slate-900"
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(service.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
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
