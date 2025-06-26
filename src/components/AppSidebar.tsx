
import { 
  Home, 
  Package, 
  CalendarDays, 
  Calendar, 
  CheckCircle,
  CreditCard, 
  Crown, 
  Settings 
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
import { useBusiness } from "@/hooks/useBusiness";

const menuItems = [
  {
    title: "Inicio",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Gestión de Servicios",
    url: "/services",
    icon: Package,
  },
  {
    title: "Gestión de Disponibilidad",
    url: "/availability",
    icon: CalendarDays,
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
  const { business } = useBusiness();

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
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          © 2024 ReservaFácil
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
