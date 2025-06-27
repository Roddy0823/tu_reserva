
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Servicios</h2>
          <p className="text-gray-600 text-sm mt-1">Administra los servicios que ofrece tu negocio</p>
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
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios registrados</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md text-sm">
              Comienza creando tu primer servicio para que los clientes puedan reservar citas contigo
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Servicio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow duration-200 border border-gray-200 bg-white">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
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
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-medium text-gray-900 truncate">{service.name}</CardTitle>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {service.accepts_cash && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <DollarSign className="h-2 w-2 mr-1" />
                              Efectivo
                            </Badge>
                          )}
                          {service.accepts_transfer && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              <CreditCard className="h-2 w-2 mr-1" />
                              Transferencia
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {service.description && (
                      <CardDescription className="text-gray-600 text-xs leading-relaxed line-clamp-2">
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
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Edit className="h-3 w-3 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      disabled={isDeleting}
                      className="h-8 w-8 p-0 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs font-medium">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ${service.price?.toLocaleString()} COP
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.duration_minutes} min
                  </Badge>
                </div>

                {(service.min_advance_days || 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-purple-600" />
                    <span className="text-xs text-gray-600">
                      {service.min_advance_days} día{(service.min_advance_days || 0) > 1 ? 's' : ''} de anticipación
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-orange-600" />
                    <span className="text-xs font-medium text-gray-700">Disponible:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      const days = [];
                      if (service.is_monday_active) days.push('L');
                      if (service.is_tuesday_active) days.push('M');
                      if (service.is_wednesday_active) days.push('X');
                      if (service.is_thursday_active) days.push('J');
                      if (service.is_friday_active) days.push('V');
                      if (service.is_saturday_active) days.push('S');
                      if (service.is_sunday_active) days.push('D');
                      
                      return days.length > 0 ? (
                        days.map((day, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 bg-orange-50 text-orange-700 border-orange-200">
                            {day}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">Sin horarios configurados</span>
                      );
                    })()}
                  </div>
                </div>

                {service.confirmation_message && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-800 line-clamp-2">{service.confirmation_message}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
