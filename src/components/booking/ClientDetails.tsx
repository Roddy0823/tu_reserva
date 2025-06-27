
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Mail, Phone } from 'lucide-react';

interface ClientDetailsProps {
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
  onBack: () => void;
}

const ClientDetails = ({ onSubmit, onBack }: ClientDetailsProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El número de teléfono es obligatorio';
    } else if (!/^\+?[\d\s\-\(\)]{8,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Ingresa un número de teléfono válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),  
        phone: formData.phone.trim()
      });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Tus Datos de Contacto</h2>
          <p className="text-gray-600">Necesitamos estos datos para confirmar tu reserva</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <User className="h-4 w-4" />
            Nombre Completo *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ej: Juan Pérez"
            className={`border-gray-200 focus:border-gray-900 focus:ring-gray-900 ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <Mail className="h-4 w-4" />
            Correo Electrónico *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Ej: juan@email.com"
            className={`border-gray-200 focus:border-gray-900 focus:ring-gray-900 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Te enviaremos la confirmación de tu cita a este correo
          </p>
        </div>

        {/* Phone Field */}
        <div>
          <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-medium mb-2">
            <Phone className="h-4 w-4" />
            Número de Teléfono *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Ej: +57 300 123 4567"
            className={`border-gray-200 focus:border-gray-900 focus:ring-gray-900 ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Te contactaremos en caso de necesitar confirmar algún detalle
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 border border-gray-200">
          <p>
            Al continuar, aceptas que podemos usar esta información para contactarte 
            sobre tu reserva y enviarte recordatorios relacionados con tu cita.
          </p>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800">
          Continuar
        </Button>
      </form>
    </div>
  );
};

export default ClientDetails;
