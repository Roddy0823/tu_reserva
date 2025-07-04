
import { 
  Home, 
  Package, 
  CalendarDays, 
  Calendar,
  CalendarCheck,
  CheckCircle,
  CreditCard, 
  Crown, 
  Settings,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useBusiness } from "@/hooks/useBusiness";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Inicio",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Servicios",
    url: "/services",
    icon: Package,
  },
  {
    title: "Gestión de Disponibilidad",
    url: "/availability",
    icon: CalendarDays,
  },
  {
    title: "Gestión de Citas",
    url: "/appointments",
    icon: CalendarCheck,
  },
  {
    title: "Citas de Hoy",
    url: "/appointments/today",
    icon: Calendar,
  },
  {
    title: "Citas Completadas",
    url: "/appointments/completed",
    icon: CheckCircle,
  },
  {
    title: "Transferencias",
    url: "/transfers",
    icon: CreditCard,
  },
  {
    title: "Mi Suscripción",
    url: "/subscription",
    icon: Crown,
  },
  {
    title: "Ajustes",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { business, isLoading } = useBusiness();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    }
  };

  // Determinar si la navegación debe estar deshabilitada
  const isNavigationDisabled = !business && !isLoading;

  // Función para determinar si un elemento del menú está activo
  const isItemActive = (url: string) => {
    return location.pathname === url;
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">ReservaFácil</h2>
            {business?.name && (
              <p className="text-xs text-muted-foreground">{business.name}</p>
            )}
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isNavigationDisabled ? "Configuración Requerida" : "Navegación Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {isNavigationDisabled ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                <p className="mb-2">Configura tu negocio para acceder a todas las funciones</p>
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isItemActive(item.url)}
                      disabled={isLoading}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 space-y-4">
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
        <div className="text-xs text-muted-foreground">
          © 2024 ReservaFácil
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
