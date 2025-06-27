
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
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
  );
};

export default CTASection;
