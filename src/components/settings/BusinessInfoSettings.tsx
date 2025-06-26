
import { useState } from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Building } from 'lucide-react';

interface BusinessInfoSettingsProps {
  business: any;
}

const BusinessInfoSettings = ({ business }: BusinessInfoSettingsProps) => {
  const { updateBusiness, isUpdating } = useBusiness();
  const [formData, setFormData] = useState({
    name: business?.name || '',
    booking_url_slug: business?.booking_url_slug || '',
    bank_account_details: business?.bank_account_details || '',
    contact_email: business?.contact_email || '',
    contact_phone: business?.contact_phone || '',
    address: business?.address || '',
    description: business?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness(formData);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    setFormData(prev => ({ ...prev, booking_url_slug: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información General del Negocio</CardTitle>
        <CardDescription>
          Actualiza la información básica de tu negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={business?.logo_url} />
              <AvatarFallback>
                <Building className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Cambiar Logo
              </Button>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG o GIF. Máximo 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Negocio *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Salón de Belleza María"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL de Reservas *</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">tusitio.com/reservas/</span>
                <Input
                  id="slug"
                  value={formData.booking_url_slug}
                  onChange={handleSlugChange}
                  placeholder="mi-salon"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email de Contacto</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder="contacto@mi-salon.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono de Contacto</Label>
              <Input
                id="phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="+34 123 456 789"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Calle Principal 123, Ciudad"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción del Negocio</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe tu negocio, servicios principales, horarios, etc."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank">Datos Bancarios</Label>
            <Textarea
              id="bank"
              value={formData.bank_account_details}
              onChange={(e) => setFormData(prev => ({ ...prev, bank_account_details: e.target.value }))}
              placeholder="Banco: Nombre del Banco&#10;Cuenta: 1234567890&#10;CBU: 1234567890123456789012"
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Información que se mostrará a los clientes para realizar pagos.
            </p>
          </div>

          <Button type="submit" disabled={isUpdating} className="w-full">
            {isUpdating ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessInfoSettings;
