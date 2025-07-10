import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Scissors, 
  Users, 
  Tag, 
  Ban, 
  ShoppingBag, 
  Plus, 
  RefreshCw,
  Settings,
  AlertTriangle
} from "lucide-react";
import ServicesManagement from "@/components/ServicesManagement";
import StaffManagement from "@/components/StaffManagement";
import { useServices } from "@/hooks/useServices";
import { useStaff } from "@/hooks/useStaff";

// Componentes placeholder para las nuevas pestañas
const CategoriesManagement = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Gestión de Categorías</h3>
        <p className="text-sm text-muted-foreground">
          Organiza tus servicios en categorías para facilitar la navegación
        </p>
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Nueva Categoría
      </Button>
    </div>
    
    <div className="grid gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Peluquería</h4>
            <p className="text-sm text-muted-foreground">5 servicios</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Activa</Badge>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Belleza</h4>
            <p className="text-sm text-muted-foreground">8 servicios</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Activa</Badge>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 border-orange-200 bg-orange-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Sin Categoría
            </h4>
            <p className="text-sm text-muted-foreground">3 servicios sin categorizar</p>
          </div>
          <Button variant="outline" size="sm">
            Organizar
          </Button>
        </div>
      </Card>
    </div>
  </div>
);

const BlocksManagement = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Gestión de Bloqueos</h3>
        <p className="text-sm text-muted-foreground">
          Crea y gestiona ausencias y períodos de no disponibilidad
        </p>
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Bloqueo
      </Button>
    </div>
    
    <div className="grid gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Almuerzo - María González</h4>
            <p className="text-sm text-muted-foreground">Hoy 12:00 - 13:00</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Recurrente</Badge>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Vacaciones - Carlos Ruiz</h4>
            <p className="text-sm text-muted-foreground">15-20 Marzo</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Aprobado</Badge>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const MarketplaceManagement = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Gestión de Marketplace</h3>
        <p className="text-sm text-muted-foreground">
          Administra tu inventario de productos y stock
        </p>
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Producto
      </Button>
    </div>
    
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Shampoo Premium</h4>
          <Badge variant="secondary">$15.000</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Stock: 12 unidades</span>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Mascarilla Hidratante</h4>
          <Badge variant="secondary">$8.000</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Stock: 5 unidades</span>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </Card>
      
      <Card className="p-4 border-red-200 bg-red-50/50">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Acondicionador Reparador
          </h4>
          <Badge variant="destructive">$12.000</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-red-600">Stock: 1 unidad (Bajo)</span>
          <Button variant="outline" size="sm">
            Reponer
          </Button>
        </div>
      </Card>
    </div>
  </div>
);

const CatalogManagement = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { services } = useServices();
  const { staffMembers } = useStaff();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Estadísticas del catálogo
  const catalogStats = {
    services: services?.length || 0,
    staff: staffMembers?.length || 0,
    categories: 3, // Mock data
    products: 15,  // Mock data
    activeBlocks: 2 // Mock data
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Settings className="h-7 w-7 text-primary" />
              Gestión de Catálogo y Disponibilidad
            </h1>
            <p className="text-muted-foreground">
              Administra servicios, personal, categorías y disponibilidad
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
          </div>
        </div>

        {/* Estadísticas del Catálogo */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{catalogStats.services}</div>
              <div className="text-xs text-muted-foreground">Servicios</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{catalogStats.staff}</div>
              <div className="text-xs text-muted-foreground">Personal</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{catalogStats.categories}</div>
              <div className="text-xs text-muted-foreground">Categorías</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{catalogStats.products}</div>
              <div className="text-xs text-muted-foreground">Productos</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{catalogStats.activeBlocks}</div>
              <div className="text-xs text-muted-foreground">Bloqueos</div>
            </div>
          </Card>
        </div>

        {/* Pestañas principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="services" className="flex items-center gap-1 text-xs">
              <Scissors className="h-3 w-3" />
              <span className="hidden sm:inline">Servicios</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-1 text-xs">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-1 text-xs">
              <Tag className="h-3 w-3" />
              <span className="hidden sm:inline">Categorías</span>
            </TabsTrigger>
            <TabsTrigger value="blocks" className="flex items-center gap-1 text-xs">
              <Ban className="h-3 w-3" />
              <span className="hidden sm:inline">Bloqueos</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-1 text-xs">
              <ShoppingBag className="h-3 w-3" />
              <span className="hidden sm:inline">Marketplace</span>
            </TabsTrigger>
          </TabsList>

          {/* Contenido de las pestañas */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-primary" />
                  Gestión de Servicios
                </CardTitle>
                <CardDescription>
                  Crea, edita y organiza los servicios de tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ServicesManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Gestión de Personal
                </CardTitle>
                <CardDescription>
                  Administra tu equipo, horarios y capacidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StaffManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Gestión de Categorías
                </CardTitle>
                <CardDescription>
                  Organiza tus servicios en categorías personalizables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoriesManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ban className="h-5 w-5 text-primary" />
                  Gestión de Bloqueos
                </CardTitle>
                <CardDescription>
                  Administra ausencias y períodos de no disponibilidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BlocksManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Gestión de Marketplace
                </CardTitle>
                <CardDescription>
                  Administra el inventario de productos de tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarketplaceManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CatalogManagement;