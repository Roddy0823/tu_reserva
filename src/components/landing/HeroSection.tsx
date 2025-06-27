
import { Button } from "@/components/ui/button";
import { Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
