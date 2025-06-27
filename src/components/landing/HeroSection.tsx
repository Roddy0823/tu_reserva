
import { Button } from "@/components/ui/button";
import { Zap, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-5xl mx-auto">
        {/* Badge de confianza */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm text-gray-600">Usado por cientos de negocios en América Latina</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          El software más completo para<br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            gestionar tu agenda
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          <strong>Tu Reserva</strong> es la solución definitiva para barberías, peluquerías, médicos<br />
          y profesionales. <strong>Reservas 24/7, pagos seguros y Google Calendar integrado.</strong>
        </p>

        {/* Beneficios clave */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">Reduce inasistencias 80%</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-medium">Configuración en 5 minutos</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="font-medium">Soporte en español</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/auth">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              <Zap className="mr-2 h-5 w-5" />
              Comenzar ahora - GRATIS
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="px-8 py-4 text-lg rounded-full border-2 hover:bg-gray-50">
            Ver demostración
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Sin tarjeta de crédito • 10 reservas gratis • Cancela cuando quieras</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
