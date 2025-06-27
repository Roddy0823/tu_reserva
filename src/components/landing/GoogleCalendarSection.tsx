
import { Badge } from "@/components/ui/badge";
import { Clock, Check } from "lucide-react";

const GoogleCalendarSection = () => {
  return (
    <section id="caracteristicas" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            Sincroniza tu agenda con<br />Google Calendar
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Integración perfecta con Google Calendar para que tus clientes reciban<br />
            recordatorios automáticos y eviten conflictos de horarios
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Google Calendar Preview */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">G</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Google Calendar</div>
                    <div className="text-sm text-gray-500">Sincronizado con ReservaSimple</div>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-green-100 text-green-800 border-green-200">Conectado</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm text-blue-800">Sincronización con ReservaSimple</div>
                    <div className="ml-auto text-xs text-blue-600">Activa</div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 mb-1">Corte de cabello - Juan P.</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      15 de julio, 2024 • 10:30
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">Reservado</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recordatorios automáticos</h3>
                  <p className="text-gray-600">Tus clientes reciben notificaciones directamente en su calendario de Google</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Evita solapamientos</h3>
                  <p className="text-gray-600">Los clientes se dan cuenta si ya tienen otro evento en su calendario</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sincronización perfecta</h3>
                  <p className="text-gray-600">Todos los cambios se reflejan automáticamente en ambas plataformas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleCalendarSection;
