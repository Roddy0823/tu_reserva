
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { useBusiness } from "@/hooks/useBusiness";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { business, isLoading } = useBusiness();
  
  const getBreadcrumbs = () => {
    const pathMap: Record<string, string> = {
      '/dashboard': 'Inicio',
      '/services': 'Gestión de Servicios',
      '/staff': 'Gestión de Personal',
      '/availability': 'Gestión de Disponibilidad',
      '/appointments/today': 'Citas de Hoy',
      '/appointments/completed': 'Citas Completadas',
      '/transfers': 'Transferencias',
      '/subscription': 'Mi Suscripción',
      '/settings': 'Ajustes',
    };
    
    return pathMap[location.pathname] || 'Panel de Administración';
  };

  // Si está cargando, mostrar loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Inicializando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          {/* Header responsivo */}
          {(business || location.pathname === '/dashboard') && (
            <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-2 px-3 sm:px-4 w-full">
                <SidebarTrigger className="-ml-1 h-8 w-8 sm:h-9 sm:w-9" />
                <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
                <Breadcrumb className="flex-1 min-w-0">
                  <BreadcrumbList className="flex items-center gap-1 sm:gap-2">
                    <BreadcrumbItem className="hidden lg:block">
                      <BreadcrumbLink 
                        href="/dashboard"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Panel
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden lg:block" />
                    <BreadcrumbItem className="min-w-0 flex-1">
                      <BreadcrumbPage className="text-sm font-medium text-foreground truncate">
                        {getBreadcrumbs()}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
          )}
          <main className="flex-1 overflow-auto">
            <div className="h-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
