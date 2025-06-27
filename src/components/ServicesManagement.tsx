
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/database';
import { Plus, Edit, Trash2, Clock, DollarSign, Calendar, MapPin, Camera, MessageSquare, Users, CreditCard } from 'lucide-react';
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
          setShowForm(false);
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

  const getPaymentMethodBadges = (service: Service) => {
    const badges = [];
    
    if (service.accepts_cash) {
      badges.push(
        <Badge key="cash" variant="outline" className="flex items-center space-x-1 bg-green-50 text-green-700 border-green-200">
          <DollarSign className="h-3 w-3" />
          <span>Efectivo</span>
        </Badge>
      );
    }
    
    if (service.accepts_transfer) {
      badges.push(
        <Badge key="transfer" variant="outline" className="flex items-center space-x-1 bg-blue-50 text-blue-700 border-blue-200">
          <CreditCard className="h-3 w-3" />
          <span>Transferencia</span>
        </Badge>
      );
    }
    
    if (badges.length === 0) {
      badges.push(
        <Badge key="none" variant="outline" className="text-gray-500">
          No configurado
        </Badge>
      );
    }
    
    return badges;
  };

  const getActiveDays = (service: Service) => {
    const days = [];
    if (service.is_monday_active) days.push('L');
    if (service.is_tuesday_active) days.push('M');
    if (service.is_wednesday_active) days.push('X');
    if (service.is_thursday_active) days.push('J');
    if (service.is_friday_active) days.push('V');
    if (service.is_saturday_active) days.push('S');
    if (service.is_sunday_active) days.push('D');
    return days;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <ServiceForm
        service={editingService || undefined}
        onSubmit={editingService ? handleUpdateService : handleCreateService}
        onCancel={handleCancelForm}
        isLoading={isCreating || isUpdating}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with action */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Servicios</h2>
          <p className="text-sm text-gray-600">Gestiona los servicios que ofrece tu negocio</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="border border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios registrados</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Comienza creando tu primer servicio para que los clientes puedan reservar citas contigo
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {service.image_url ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={service.image_url} 
                            alt={service.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Camera className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg font-medium text-gray-900 mb-2">{service.name}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          {getPaymentMethodBadges(service)}
                        </div>
                      </div>
                    </div>
                    
                    {service.description && (
                      <CardDescription className="text-gray-600 text-sm mb-3">
                        {service.description}
                      </CardDescription>
                    )}
                    
                    {service.confirmation_message && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-blue-800">{service.confirmation_message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      disabled={isUpdating}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      disabled={isDeleting}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Precio y Duración */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="flex items-center space-x-1 bg-green-50 text-green-700 border-green-200">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-medium">${service.price?.toLocaleString()} COP</span>
                    </Badge>
                    <Badge variant="secondary" className="flex items-center space-x-1 bg-blue-50 text-blue-700 border-blue-200">
                      <Clock className="h-3 w-3" />
                      <span>{service.duration_minutes} min</span>
                    </Badge>
                  </div>

                  {/* Días de anticipación */}
                  {(service.min_advance_days || 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        Reservar con {service.min_advance_days} día{(service.min_advance_days || 0) > 1 ? 's' : ''} de anticipación
                      </span>
                    </div>
                  )}

                  {/* Días activos */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-xs font-medium text-gray-600">Disponible:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {getActiveDays(service).length > 0 ? (
                        getActiveDays(service).map((day, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1 bg-gray-50 text-gray-600 border-gray-200">
                            {day}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Sin horarios configurados</span>
                      )}
                    </div>
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
