import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  AlertTriangle,
  Star,
  RefreshCw
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalSpent: number;
  totalAppointments: number;
  noShows: number;
  lastVisit: string;
  status: 'vip' | 'regular' | 'new' | 'inactive';
  rating: number;
}

const ClientCRM = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data de clientes
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'Jennifer López',
      email: 'jennifer@email.com',
      phone: '+57 300 123 4567',
      totalSpent: 850000,
      totalAppointments: 12,
      noShows: 0,
      lastVisit: '2024-03-10',
      status: 'vip',
      rating: 5.0
    },
    {
      id: '2',
      name: 'Roberto Silva',
      email: 'roberto@email.com',
      phone: '+57 301 234 5678',
      totalSpent: 320000,
      totalAppointments: 8,
      noShows: 1,
      lastVisit: '2024-03-08',
      status: 'regular',
      rating: 4.8
    },
    {
      id: '3',
      name: 'Carmen Delgado',
      email: 'carmen@email.com',
      phone: '+57 302 345 6789',
      totalSpent: 180000,
      totalAppointments: 7,
      noShows: 0,
      lastVisit: '2024-03-05',
      status: 'regular',
      rating: 4.9
    },
    {
      id: '4',
      name: 'Miguel Ángel Torres',
      email: 'miguel@email.com',
      phone: '+57 303 456 7890',
      totalSpent: 45000,
      totalAppointments: 2,
      noShows: 2,
      lastVisit: '2024-02-15',
      status: 'inactive',
      rating: 3.5
    },
    {
      id: '5',
      name: 'Lucía Morales',
      email: 'lucia@email.com',
      phone: '+57 304 567 8901',
      totalSpent: 75000,
      totalAppointments: 3,
      noShows: 0,
      lastVisit: '2024-03-12',
      status: 'new',
      rating: 4.7
    }
  ];

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'vip':
        return <Badge className="bg-purple-100 text-purple-800">VIP</Badge>;
      case 'regular':
        return <Badge variant="secondary">Regular</Badge>;
      case 'new':
        return <Badge className="bg-green-100 text-green-800">Nuevo</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactivo</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getRiskLevel = (noShows: number) => {
    if (noShows === 0) return { level: 'Bajo', color: 'text-green-600' };
    if (noShows <= 2) return { level: 'Medio', color: 'text-yellow-600' };
    return { level: 'Alto', color: 'text-red-600' };
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Estadísticas del CRM
  const crmStats = {
    totalClients: mockClients.length,
    vipClients: mockClients.filter(c => c.status === 'vip').length,
    newClients: mockClients.filter(c => c.status === 'new').length,
    inactiveClients: mockClients.filter(c => c.status === 'inactive').length,
    averageSpent: mockClients.reduce((sum, c) => sum + c.totalSpent, 0) / mockClients.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-7 w-7 text-primary" />
              CRM de Clientes
            </h1>
            <p className="text-muted-foreground">
              Administra la base de datos de tus clientes y su historial
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
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Estadísticas del CRM */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{crmStats.totalClients}</div>
              <div className="text-xs text-muted-foreground">Total Clientes</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{crmStats.vipClients}</div>
              <div className="text-xs text-muted-foreground">Clientes VIP</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{crmStats.newClients}</div>
              <div className="text-xs text-muted-foreground">Nuevos</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{crmStats.inactiveClients}</div>
              <div className="text-xs text-muted-foreground">Inactivos</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${Math.round(crmStats.averageSpent / 1000)}k
              </div>
              <div className="text-xs text-muted-foreground">Gasto Promedio</div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lista de Clientes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Lista de Clientes
              </CardTitle>
              <CardDescription>
                Base de datos completa de tus clientes
              </CardDescription>
              <div className="flex items-center gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredClients.map((client) => {
                  const risk = getRiskLevel(client.noShows);
                  return (
                    <div
                      key={client.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedClient?.id === client.id ? 'bg-primary/5 border-primary' : 'bg-card'
                      }`}
                      onClick={() => setSelectedClient(client)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback>{client.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium truncate">{client.name}</h4>
                            {getStatusBadge(client.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>${client.totalSpent.toLocaleString()}</span>
                            <span>{client.totalAppointments} citas</span>
                            <span className={risk.color}>Riesgo: {risk.level}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{client.rating}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Detalle del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Ficha del Cliente
              </CardTitle>
              <CardDescription>
                Información detallada y historial
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedClient ? (
                <div className="space-y-6">
                  {/* Información básica */}
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarImage src={selectedClient.avatar} />
                      <AvatarFallback className="text-lg">
                        {selectedClient.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{selectedClient.name}</h3>
                    <div className="flex justify-center mt-2">
                      {getStatusBadge(selectedClient.status)}
                    </div>
                  </div>

                  {/* Contacto */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedClient.phone}</span>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary">
                        ${selectedClient.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Gastado</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedClient.totalAppointments}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Citas</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">
                        {selectedClient.rating}
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className={`text-lg font-bold ${getRiskLevel(selectedClient.noShows).color}`}>
                        {selectedClient.noShows}
                      </div>
                      <div className="text-xs text-muted-foreground">No-Shows</div>
                    </div>
                  </div>

                  {/* Última visita */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Última visita: {selectedClient.lastVisit}</span>
                  </div>

                  {/* Alertas */}
                  {selectedClient.noShows > 1 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Cliente con alto riesgo de No-Show
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="space-y-2">
                    <Button className="w-full" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Nueva Cita
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Ver Historial
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Selecciona un cliente para ver su información</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientCRM;