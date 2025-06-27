
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service } from '@/types/database';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface NoStaffAvailableProps {
  service: Service;
  onBack: () => void;
}

const NoStaffAvailable = ({ service, onBack }: NoStaffAvailableProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <CardTitle className="text-xl text-red-600">Personal no disponible</CardTitle>
            <p className="text-slate-600">No hay personal especializado para este servicio</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium mb-2">
                No hay personal habilitado para "{service.name}"
              </p>
              <p className="text-red-700 text-sm mb-3">
                Para poder ofrecer este servicio, necesitas:
              </p>
              <ul className="text-red-700 text-sm space-y-1 ml-4">
                <li>• Personal activo en tu equipo</li>
                <li>• Asignar este servicio específico al personal</li>
                <li>• Configurar horarios de trabajo para el personal</li>
              </ul>
              <p className="text-red-600 text-sm mt-3 font-medium">
                Contacta al administrador para configurar el personal.
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={onBack} className="w-full">
          ← Seleccionar otro servicio
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoStaffAvailable;
