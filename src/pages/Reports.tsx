import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Users, 
  Calendar as CalendarIcon,
  DollarSign,
  Package,
  TrendingUp,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

const Reports = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportType, setReportType] = useState<string>('financial');
  const [exportFormat, setExportFormat] = useState<string>('csv');

  const reportTypes = [
    { id: 'financial', name: 'Reporte Financiero', icon: DollarSign, description: 'Ingresos, pagos y rentabilidad' },
    { id: 'services', name: 'Reporte de Servicios', icon: Package, description: 'Rendimiento por servicio' },
    { id: 'staff', name: 'Reporte de Personal', icon: Users, description: 'Productividad del equipo' },
    { id: 'clients', name: 'Reporte de Clientes', icon: Users, description: 'Análisis de clientes' },
    { id: 'inventory', name: 'Reporte de Inventario', icon: Package, description: 'Stock y ventas de productos' }
  ];

  const quickRanges = [
    { label: 'Últimos 7 días', days: 7 },
    { label: 'Últimos 30 días', days: 30 },
    { label: 'Últimos 3 meses', days: 90 },
    { label: 'Este año', days: 365 }
  ];

  const generateReport = () => {
    // Lógica para generar reporte
    console.log('Generando reporte:', { reportType, dateRange, exportFormat });
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Estadísticas y Reportes</h1>
        <p className="text-muted-foreground mt-2">
          Genera reportes detallados y exporta datos de tu negocio
        </p>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generador de Reportes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Análisis Avanzado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          {/* Filtros y Configuración */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Configurar Reporte
              </CardTitle>
              <CardDescription>
                Selecciona el tipo de reporte y el rango de fechas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tipo de Reporte */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Reporte</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Formato de Exportación */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Formato</label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Selector de Fechas */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rango de Fechas</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !dateRange?.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                              {format(dateRange.to, "LLL dd, y", { locale: es })}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y", { locale: es })
                          )
                        ) : (
                          "Seleccionar fechas"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Generar Reporte */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Acción</label>
                  <Button onClick={generateReport} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Generar Reporte
                  </Button>
                </div>
              </div>

              {/* Rangos Rápidos */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rangos Rápidos</label>
                <div className="flex flex-wrap gap-2">
                  {quickRanges.map((range) => (
                    <Button
                      key={range.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const to = new Date();
                        const from = new Date();
                        from.setDate(from.getDate() - range.days);
                        setDateRange({ from, to });
                      }}
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vista Previa del Reporte */}
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
              <CardDescription>
                {reportTypes.find(t => t.id === reportType)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecciona las fechas y genera el reporte para ver la vista previa</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Métricas Clave */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                    <p className="text-2xl font-bold">$2,450,000</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12% vs mes anterior
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Citas Completadas</p>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +8% vs mes anterior
                    </p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Clientes Únicos</p>
                    <p className="text-2xl font-bold">89</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +15% vs mes anterior
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tasa de No-Show</p>
                    <p className="text-2xl font-bold">5.2%</p>
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 rotate-180" />
                      -2% vs mes anterior
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reportes Predefinidos */}
          <Card>
            <CardHeader>
              <CardTitle>Reportes Predefinidos</CardTitle>
              <CardDescription>
                Reportes listos para descargar con datos actualizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <type.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{type.name}</p>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;