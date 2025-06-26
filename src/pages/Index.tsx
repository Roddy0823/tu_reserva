
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Building2, Settings, FileText, Clock, Check, Star, ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              ✨ Nuevo: Sistema de Reservas Inteligente
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transforma tu Negocio con
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Reservas Inteligentes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              El sistema completo para PyMEs que automatiza tus citas, gestiona tu personal y maximiza tus ingresos. 
              <strong className="text-white">Sin complicaciones, solo resultados.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                Ver Demo
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Sin tarjeta de crédito
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Configuración en 5 minutos
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Soporte 24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Negocios Activos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Citas Gestionadas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfacción</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">45%</div>
              <div className="text-gray-600">Aumento en Ventas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
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
            <Card className="relative group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarDays className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Reservas Automatizadas</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Tus clientes reservan 24/7 sin llamadas. Sistema inteligente que evita dobles citas y optimiza tu agenda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Calendario en tiempo real
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Recordatorios automáticos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    URL personalizada
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative group hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Gestión de Personal</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Organiza horarios, especialidades y disponibilidad de tu equipo desde un solo lugar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Horarios personalizados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Control de especialidades
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Estadísticas de rendimiento
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative group hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Control de Pagos</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Gestiona pagos en efectivo y transferencias con comprobantes digitales automáticos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Múltiples métodos de pago
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Comprobantes automáticos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Reportes financieros
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative group hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Multi-Negocio</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Perfecto para salones, clínicas, talleres, consultorías y cualquier negocio con citas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Salones de belleza
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Consultorios médicos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Talleres y servicios
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative group hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Zap className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Configuración Rápida</CardTitle>
                </div>
                <CardDescription className="text-base">
                  En menos de 5 minutos tu negocio estará recibiendo reservas online.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Setup automático
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Sin conocimientos técnicos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Soporte incluido
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative group hover:shadow-xl transition-all duration-300 border-l-4 border-l-indigo-500">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Shield className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">Seguro y Confiable</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Tus datos y los de tus clientes están protegidos con la mejor tecnología de seguridad.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Encriptación SSL
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Backups automáticos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Disponibilidad 99.9%
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600">
              Más de 500 negocios ya confían en nosotros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Antes perdía 3 horas diarias contestando llamadas para citas. Ahora mis clientes reservan solos y yo me enfoco en mi trabajo. ¡Increíble!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-pink-600 font-bold">MR</span>
                  </div>
                  <div>
                    <div className="font-semibold">María Rodríguez</div>
                    <div className="text-sm text-gray-500">Salón de Belleza "Glamour"</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "El control de pagos es fantástico. Ya no se me olvida cobrar y tengo todo organizado. Mis ingresos aumentaron 40%."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">CL</span>
                  </div>
                  <div>
                    <div className="font-semibold">Carlos López</div>
                    <div className="text-sm text-gray-500">Taller Mecánico</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "La facilidad de uso es impresionante. En 5 minutos ya estaba funcionando. Mis pacientes están encantados con las reservas online."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold">AM</span>
                  </div>
                  <div>
                    <div className="font-semibold">Ana Martínez</div>
                    <div className="text-sm text-gray-500">Consultorio Dental</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
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
            <Card className="border-2 border-gray-200 relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Plan Básico</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">Gratis</div>
                <CardDescription className="text-base">
                  Perfect para comenzar y probar el sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Hasta 50 reservas/mes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>1 usuario administrador</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Servicios ilimitados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Soporte por email</span>
                  </li>
                </ul>
                <Link to="/auth" className="block">
                  <Button className="w-full mt-8" variant="outline">
                    Comenzar Gratis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 relative bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Más Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Plan Pro</CardTitle>
                <div className="text-4xl font-bold text-blue-600 mb-2">$29.900</div>
                <div className="text-sm text-gray-500 mb-4">/mes</div>
                <CardDescription className="text-base">
                  Para negocios en crecimiento que necesitan más poder
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span><strong>Reservas ilimitadas</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Personal ilimitado</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Reportes avanzados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Notificaciones SMS</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Soporte prioritario</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Integración con redes sociales</span>
                  </li>
                </ul>
                <Link to="/auth" className="block">
                  <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700">
                    Comenzar Prueba Gratuita
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para revolucionar tu negocio?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a más de 500 negocios que ya están ahorrando tiempo y aumentando sus ingresos con nuestro sistema.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4">
                Comenzar Ahora - Es Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4">
              Agendar Demo Personalizada
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            No se requiere tarjeta de crédito • Configuración en 5 minutos • Soporte incluido
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ReservasPro</h3>
              <p className="text-gray-400">
                El sistema de reservas más completo para PyMEs en Colombia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/auth" className="hover:text-white">Características</Link></li>
                <li><Link to="/auth" className="hover:text-white">Precios</Link></li>
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
            <p>&copy; 2024 ReservasPro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
