
import { CalendarDays, CreditCard, Users, BarChart, Shield, Clock } from "lucide-react";

const FeaturesOverviewSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir Tu Reserva?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La solución más completa para gestionar tu negocio de servicios en América Latina
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-blue-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Reservas 24/7</h3>
            <p className="text-gray-600">
              Tus clientes pueden agendar citas en cualquier momento, sin necesidad de llamar
            </p>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Pagos Seguros</h3>
            <p className="text-gray-600">
              Acepta pagos por adelantado con MercadoPago y reduce las inasistencias
            </p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestión de Personal</h3>
            <p className="text-gray-600">
              Organiza horarios y disponibilidad de todo tu equipo de trabajo
            </p>
          </div>

          <div className="text-center p-6 bg-orange-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Reportes Detallados</h3>
            <p className="text-gray-600">
              Analiza el rendimiento de tu negocio con estadísticas completas
            </p>
          </div>

          <div className="text-center p-6 bg-teal-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Seguro</h3>
            <p className="text-gray-600">
              Todas las transacciones protegidas con los más altos estándares de seguridad
            </p>
          </div>

          <div className="text-center p-6 bg-indigo-50 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ahorra Tiempo</h3>
            <p className="text-gray-600">
              Automatiza las tareas repetitivas y enfócate en hacer crecer tu negocio
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverviewSection;
