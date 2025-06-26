
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Building2, Settings, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Reservas para PYMEs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gestiona tu negocio, servicios, personal y reservas de manera eficiente
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <CardTitle>Gestión de Negocio</CardTitle>
              </div>
              <CardDescription>
                Configura tu negocio, datos bancarios y URL personalizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Configurar Negocio
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-green-600" />
                <CardTitle>Servicios</CardTitle>
              </div>
              <CardDescription>
                Crea y gestiona los servicios que ofreces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Gestionar Servicios
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-purple-600" />
                <CardTitle>Personal</CardTitle>
              </div>
              <CardDescription>
                Administra tu equipo y sus especialidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Gestionar Personal
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-8 w-8 text-orange-600" />
                <CardTitle>Reservas</CardTitle>
              </div>
              <CardDescription>
                Visualiza y gestiona todas las citas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Reservas
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-red-600" />
                <CardTitle>Horarios</CardTitle>
              </div>
              <CardDescription>
                Configura disponibilidad y bloqueos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Gestionar Horarios
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-gray-600" />
                <CardTitle>Configuración</CardTitle>
              </div>
              <CardDescription>
                Ajustes generales del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Iniciar Sesión
            </Button>
            <Button variant="outline">
              Registrar Negocio
            </Button>
            <Button variant="outline">
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm font-medium">
              Base de datos configurada correctamente
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
