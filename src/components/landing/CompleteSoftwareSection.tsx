
import { Calendar, Users, BarChart, CreditCard, Clock, Shield } from "lucide-react";

const CompleteSoftwareSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-purple-600 mb-4">
            Software Completo para<br />
            Gestión de Turnos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Todas las herramientas que necesitas para administrar tu agenda online y hacer<br />
            crecer tu negocio en América Latina
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Agenda Online</h3>
            <p className="text-gray-600 text-center mb-4">
              Gestiona todas tus citas desde una interfaz simple y moderna
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Reservas automáticas 24/7
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Recordatorios por WhatsApp
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Calendario personalizable
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Control de Personal</h3>
            <p className="text-gray-600 text-center mb-4">
              Administra horarios y disponibilidad de todo tu equipo
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Horarios personalizados
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Gestión de servicios por empleado
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Control de disponibilidad
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Reportes y Analytics</h3>
            <p className="text-gray-600 text-center mb-4">
              Analiza el rendimiento de tu negocio con reportes detallados
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Estadísticas de ventas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Análisis de inasistencias
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Reportes de personal
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Pagos Online</h3>
            <p className="text-gray-600 text-center mb-4">
              Acepta pagos seguros con MercadoPago y transferencias
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                Integración MercadoPago
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                Pagos por adelantado
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                Comprobantes automáticos
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Gestión de Tiempo</h3>
            <p className="text-gray-600 text-center mb-4">
              Optimiza tu tiempo y mejora la experiencia del cliente
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                Lista de espera inteligente
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                Tiempo de servicio flexible
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                Reprogramación automática
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Seguridad Total</h3>
            <p className="text-gray-600 text-center mb-4">
              Protege la información de tu negocio y tus clientes
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                Datos encriptados
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                Backups automáticos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                Cumplimiento GDPR
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompleteSoftwareSection;
