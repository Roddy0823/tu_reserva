
import { Calendar, Users, BarChart } from "lucide-react";

const CompleteSoftwareSection = () => {
  return (
    <section className="py-20 bg-white">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Agenda Online</h3>
            <p className="text-gray-600">
              Gestiona todas tus citas desde una interfaz simple y moderna
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Control de Personal</h3>
            <p className="text-gray-600">
              Administra horarios y disponibilidad de todo tu equipo
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reportes y Analytics</h3>
            <p className="text-gray-600">
              Analiza el rendimiento de tu negocio con reportes detallados
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompleteSoftwareSection;
