
import { useState } from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BusinessSetup = () => {
  const { createBusiness, isCreating } = useBusiness();
  const [formData, setFormData] = useState({
    name: '',
    booking_url_slug: '',
    bank_account_details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createBusiness(formData);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Configurar tu Negocio</CardTitle>
          <CardDescription>
            Completa la información básica para comenzar a recibir reservas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <p className="text-xs text-gray-500">
                Solo letras minúsculas, números y guiones. Será tu URL única para reservas.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank">Datos Bancarios (opcional)</Label>
              <Textarea
                id="bank"
                value={formData.bank_account_details}
                onChange={(e) => setFormData(prev => ({ ...prev, bank_account_details: e.target.value }))}
                placeholder="Banco: Nombre del Banco&#10;Cuenta: 1234567890&#10;CBU: 1234567890123456789012"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Información que se mostrará a los clientes para realizar pagos.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? "Creando negocio..." : "Crear Negocio"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSetup;
