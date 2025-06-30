
import { useState } from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BusinessSetup = () => {
  const { createBusiness, isCreating, generateAlternativeSlug } = useBusiness();
  const [formData, setFormData] = useState({
    name: '',
    booking_url_slug: '',
    bank_account_details: ''
  });
  const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.booking_url_slug.trim()) {
      return;
    }
    
    createBusiness(formData);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    setFormData(prev => ({ ...prev, booking_url_slug: value }));
    
    // Limpiar sugerencias cuando el usuario cambia el slug
    if (slugSuggestions.length > 0) {
      setSlugSuggestions([]);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name }));
    
    // Auto-generar slug basado en el nombre si el slug está vacío
    if (!formData.booking_url_slug && name) {
      const autoSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      setFormData(prev => ({ ...prev, booking_url_slug: autoSlug }));
    }
  };

  const generateSuggestions = () => {
    if (!formData.booking_url_slug) return;
    
    const suggestions = [
      generateAlternativeSlug(formData.booking_url_slug),
      generateAlternativeSlug(formData.booking_url_slug),
      generateAlternativeSlug(formData.booking_url_slug)
    ];
    
    setSlugSuggestions(suggestions);
  };

  const applySuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, booking_url_slug: suggestion }));
    setSlugSuggestions([]);
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
                onChange={handleNameChange}
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
              
              {formData.booking_url_slug && (
                <div className="space-y-2">
                  <p className="text-xs text-blue-600">
                    URL completa: tusitio.com/reservas/{formData.booking_url_slug}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSuggestions}
                    className="text-xs"
                  >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Ver alternativas
                  </Button>
                </div>
              )}
              
              {slugSuggestions.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Sugerencias de URL alternativas:</p>
                      <div className="flex flex-wrap gap-2">
                        {slugSuggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => applySuggestion(suggestion)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
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
              {isCreating ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creando negocio...
                </div>
              ) : (
                "Crear Negocio"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSetup;
