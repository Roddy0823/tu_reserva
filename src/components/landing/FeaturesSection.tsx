
import { CalendarDays, Users, TrendingUp, BarChart3 } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas para hacer crecer tu negocio
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desde la gestión de citas hasta el control de pagos, tenemos todas las herramientas que tu PyME necesita
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reservas 24/7</h3>
            <p className="text-gray-600">Tus clientes pueden reservar en cualquier momento sin necesidad de llamar</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Personal</h3>
            <p className="text-gray-600">Organiza horarios y disponibilidad de todo tu equipo</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Control de Pagos</h3>
            <p className="text-gray-600">Gestiona pagos en efectivo y transferencias con comprobantes automáticos</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seguimiento Completo</h3>
            <p className="text-gray-600">Analiza el rendimiento de tu negocio con reportes detallados</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
