
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  return (
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
                <span>Hasta 10 reservas/mes</span>
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
  );
};

export default PricingSection;
