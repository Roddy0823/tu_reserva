import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, List, Plus, Filter, Download, RefreshCw } from "lucide-react";
import CalendarView from "@/components/CalendarView";
import AppointmentsList from "@/components/AppointmentsList";
import { useTodayAppointments } from "@/hooks/useTodayAppointments";

const AppointmentCenter = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { appointments, isLoading } = useTodayAppointments();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Estadísticas rápidas
  const todayStats = {
    total: appointments?.length || 0,
    confirmed: appointments?.filter(apt => apt.status === 'confirmado').length || 0,
    pending: appointments?.filter(apt => apt.status === 'pendiente').length || 0,
    completed: appointments?.filter(apt => apt.status === 'completado').length || 0,
    cancelled: appointments?.filter(apt => apt.status === 'cancelado').length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-7 w-7 text-primary" />
              Centro de Control de Citas
            </h1>
            <p className="text-muted-foreground">
              Gestiona todas las citas de tu negocio desde un solo lugar
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{todayStats.total}</div>
              <div className="text-xs text-muted-foreground">Total Hoy</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{todayStats.confirmed}</div>
              <div className="text-xs text-muted-foreground">Confirmadas</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{todayStats.pending}</div>
              <div className="text-xs text-muted-foreground">Pendientes</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{todayStats.completed}</div>
              <div className="text-xs text-muted-foreground">Completadas</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{todayStats.cancelled}</div>
              <div className="text-xs text-muted-foreground">Canceladas</div>
            </div>
          </Card>
        </div>

        {/* Pestañas principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendario</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Lista de Citas</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Contenido de las pestañas */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Vista de Calendario
                </CardTitle>
                <CardDescription>
                  Visualiza tus citas en formato calendario con insignias de estado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Vista de calendario en desarrollo</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  Lista de Citas
                </CardTitle>
                <CardDescription>
                  Gestiona todas las citas con filtros avanzados y acciones en lote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center text-muted-foreground">
                  <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Lista de citas en desarrollo</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AppointmentCenter;