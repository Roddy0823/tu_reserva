
import { useState, useEffect } from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Building, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusinessInfoSettingsProps {
  business: any;
}

const BusinessInfoSettings = ({ business }: BusinessInfoSettingsProps) => {
  const { updateBusiness, isUpdating } = useBusiness();
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    booking_url_slug: '',
    bank_account_details: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    description: '',
  });

  // Sincronizar datos del negocio con el estado del formulario
  useEffect(() => {
    if (business) {
      const newFormData = {
        name: business.name || '',
        booking_url_slug: business.booking_url_slug || '',
        bank_account_details: business.bank_account_details || '',
        contact_email: business.contact_email || '',
        contact_phone: business.contact_phone || '',
        address: business.address || '',
        description: business.description || '',
      };
      setFormData(newFormData);
      setHasChanges(false);
    }
  }, [business]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Verificar si hay cambios comparando con los datos originales
      const hasAnyChanges = Object.keys(newData).some(key => 
        newData[key as keyof typeof newData] !== (business?.[key] || '')
      );
      setHasChanges(hasAnyChanges);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      toast({
        title: "Sin cambios",
        description: "No hay cambios para guardar",
      });
      return;
    }

    try {
      await updateBusiness(formData);
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating business:', error);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    handleInputChange('booking_url_slug', value);
  };

  if (!business) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Información General del Negocio
        </CardTitle>
        <CardDescription>
          Actualiza la información básica de tu negocio. Los cambios se guardan automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-20 w-20">
              <AvatarImage src={business?.logo_url} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                <Building className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Button type="button" variant="outline" size="sm" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Cambiar Logo
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG o GIF. Máximo 2MB. (Próximamente)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre del Negocio *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Salón de Belleza María"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-medium">
                URL de Reservas *
              </Label>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    tusitio.com/reservas/
                  </span>
                  <Input
                    id="slug"
                    value={formData.booking_url_slug}
                    onChange={handleSlugChange}
                    placeholder="mi-salon"
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {formData.booking_url_slug && (
                  <p className="text-xs text-blue-600">
                    URL completa: tusitio.com/reservas/{formData.booking_url_slug}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email de Contacto
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="contacto@mi-salon.com"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Teléfono de Contacto
              </Label>
              <Input
                id="phone"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="+57 300 123 4567"
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Dirección
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Calle Principal 123, Ciudad"
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descripción del Negocio
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe tu negocio, servicios principales, horarios, etc."
              rows={4}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank" className="text-sm font-medium">
              Datos Bancarios
            </Label>
            <Textarea
              id="bank"
              value={formData.bank_account_details}
              onChange={(e) => handleInputChange('bank_account_details', e.target.value)}
              placeholder="Banco: Nombre del Banco&#10;Cuenta: 1234567890&#10;CBU: 1234567890123456789012"
              rows={3}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500">
              Información que se mostrará a los clientes para realizar pagos por transferencia.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {hasChanges && (
                <div className="flex items-center gap-2 text-amber-600">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Cambios sin guardar</span>
                </div>
              )}
              {!hasChanges && !isUpdating && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Todo guardado</span>
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={isUpdating || !hasChanges}
              className="min-w-[120px] transition-all duration-200"
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </div>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessInfoSettings;
