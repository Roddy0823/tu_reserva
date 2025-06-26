
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download, Eye, Calendar } from 'lucide-react';

interface BillingSettingsProps {
  business: any;
}

const BillingSettings = ({ business }: BillingSettingsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plan Actual</CardTitle>
          <CardDescription>
            Información sobre tu membresía y facturación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Plan Básico</h3>
              <p className="text-sm text-gray-500">
                Ideal para negocios pequeños
              </p>
            </div>
            <Badge variant="secondary">Activo</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Precio</p>
              <p className="font-medium">$29/mes</p>
            </div>
            <div>
              <p className="text-gray-500">Próxima facturación</p>
              <p className="font-medium">15 de Enero, 2024</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Características incluidas:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Hasta 100 citas por mes</li>
              <li>• 3 miembros del equipo</li>
              <li>• Notificaciones por email</li>
              <li>• Soporte por chat</li>
            </ul>
          </div>

          <Button variant="outline" className="w-full">
            Actualizar Plan
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pago</CardTitle>
          <CardDescription>
            Gestiona tus métodos de pago para la facturación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-8 w-8 text-gray-400" />
              <div>
                <p className="font-medium">Visa terminada en 4242</p>
                <p className="text-sm text-gray-500">Expira 12/25</p>
              </div>
            </div>
            <Badge variant="outline">Principal</Badge>
          </div>

          <Button variant="outline" className="w-full">
            Añadir Método de Pago
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Facturación</CardTitle>
          <CardDescription>
            Descarga tus facturas anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '1 Dic 2023', amount: '$29.00', status: 'Pagada' },
              { date: '1 Nov 2023', amount: '$29.00', status: 'Pagada' },
              { date: '1 Oct 2023', amount: '$29.00', status: 'Pagada' },
            ].map((invoice, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{invoice.date}</p>
                    <p className="text-sm text-gray-500">{invoice.amount}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-green-600">
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSettings;
