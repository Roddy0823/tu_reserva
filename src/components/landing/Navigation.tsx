
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
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
  );
};

export default Navigation;
