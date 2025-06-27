
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Building2, Settings, FileText, Clock, Check, Star, ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-600">ReservaSimple</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#caracteristicas" className="text-gray-600 hover:text-blue-600 transition-colors">Características</a>
              <a href="#precios" className="text-gray-600 hover:text-blue-600 transition-colors">Precios</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
              <a href="#reseñas" className="text-gray-600 hover:text-blue-600 transition-colors">Reseñas</a>
            </div>

            <Link to="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">
                Ingresa a tu cuenta
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Automatiza tus reservas y<br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              potencia tu negocio
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Software de turnos para América Latina y España. Reservas<br />
            24/7, pagos seguros en línea y Google Calendar. Para barberías,<br />
            peluquerías, médicos y profesionales.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full">
                <Zap className="mr-2 h-5 w-5" />
                Comenzar ahora
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Sin tarjeta de crédito • 30 turnos gratis</span>
          </div>
        </div>
      </section>

      {/* Google Calendar Integration Section */}
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

      {/* Features Section */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planes que se adaptan a tu negocio
            </h2>
            <p className="text-xl text-gray-600">
              Comienza gratis y crece con nosotros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Básico</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">Gratis</div>
                <p className="text-gray-600">Perfecto para comenzar</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Hasta 30 reservas/mes</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>1 usuario administrador</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Integración Google Calendar</span>
                </li>
              </ul>
              <Link to="/auth" className="block">
                <Button className="w-full" variant="outline">
                  Comenzar Gratis
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-white text-blue-600">Más Popular</Badge>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Plan Pro</h3>
                <div className="text-4xl font-bold mb-2">$29.900</div>
                <div className="text-blue-100 mb-4">/mes</div>
                <p className="text-blue-100">Para negocios en crecimiento</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-white" />
                  <span><strong>Reservas ilimitadas</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-white" />
                  <span>Personal ilimitado</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-white" />
                  <span>Reportes avanzados</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-white" />
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <Link to="/auth" className="block">
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  Comenzar Prueba Gratuita
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para automatizar tu negocio?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Únete a cientos de negocios que ya están ahorrando tiempo y aumentando sus ingresos
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full">
              Comenzar Ahora - Es Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-blue-200 mt-4">
            No se requiere tarjeta de crédito • Configuración en 5 minutos
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">ReservaSimple</span>
              </div>
              <p className="text-gray-400">
                El sistema de reservas más simple y efectivo para tu negocio.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#caracteristicas" className="hover:text-white">Características</a></li>
                <li><a href="#precios" className="hover:text-white">Precios</a></li>
                <li><Link to="/auth" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
                <li><a href="#" className="hover:text-white">WhatsApp</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Acerca de</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Términos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ReservaSimple. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
