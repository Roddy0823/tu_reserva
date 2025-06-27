
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
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
  );
};

export default Footer;
