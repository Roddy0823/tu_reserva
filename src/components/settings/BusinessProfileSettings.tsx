import { useState, useEffect } from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building, MapPin, Phone, Mail, Clock, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusinessProfileSettingsProps {
  business: any;
}

const BusinessProfileSettings = ({ business }: BusinessProfileSettingsProps) => {
  const { updateBusiness, isUpdating } = useBusiness();
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    contact_phone: '',
    contact_email: '',
    bank_account_details: '',
    // Horarios generales
    general_start_time: '09:00',
    general_end_time: '18:00',
  });

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        description: business.description || '',
        address: business.address || '',
        contact_phone: business.contact_phone || '',
        contact_email: business.contact_email || '',
        bank_account_details: business.bank_account_details || '',
        general_start_time: business.general_start_time || '09:00',
        general_end_time: business.general_end_time || '18:00',
      });
    }
  }, [business]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    updateBusiness(formData);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Información General
          </CardTitle>
          <CardDescription>
            Datos básicos de tu negocio que aparecerán en tu página pública
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Negocio *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Salón de Belleza María"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email de Contacto</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="contacto@minegocios.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe tu negocio, servicios principales y qué te hace especial..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Información de Contacto y Ubicación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Contacto y Ubicación
          </CardTitle>
          <CardDescription>
            Información para que tus clientes puedan encontrarte y contactarte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección Completa</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Calle 123 #45-67, Barrio Centro, Ciudad"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
            <Input
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              placeholder="+57 300 123 4567"
            />
          </div>
        </CardContent>
      </Card>

      {/* Horarios Generales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horarios de Atención Generales
          </CardTitle>
          <CardDescription>
            Horarios base para tu negocio (puedes personalizar por servicio y personal)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="general_start_time">Hora de Apertura</Label>
              <Input
                id="general_start_time"
                type="time"
                value={formData.general_start_time}
                onChange={(e) => handleInputChange('general_start_time', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="general_end_time">Hora de Cierre</Label>
              <Input
                id="general_end_time"
                type="time"
                value={formData.general_end_time}
                onChange={(e) => handleInputChange('general_end_time', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos Bancarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Datos Bancarios para Transferencias
          </CardTitle>
          <CardDescription>
            Información que se mostrará a los clientes al seleccionar pago por transferencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank_account_details">Datos Bancarios</Label>
            <Textarea
              id="bank_account_details"
              value={formData.bank_account_details}
              onChange={(e) => handleInputChange('bank_account_details', e.target.value)}
              placeholder="Banco: Bancolombia
Tipo de Cuenta: Ahorros  
Número: 1234-5678-9012
Titular: Juan Pérez
CC: 12.345.678"
              className="min-h-[120px] font-mono text-sm"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Esta información se mostrará tal como la escribas. Asegúrate de incluir todos los datos necesarios para recibir transferencias.
          </p>
        </CardContent>
      </Card>

      {/* Botón de Guardar */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!hasChanges || isUpdating}
          className="min-w-32"
        >
          {isUpdating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </Button>
      </div>
    </div>
  );
};

export default BusinessProfileSettings;