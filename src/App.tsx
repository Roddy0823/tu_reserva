
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EnhancedDashboard from "./components/dashboard/EnhancedDashboard";
import AppointmentCenter from "./pages/AppointmentCenter";
import CatalogManagement from "./pages/CatalogManagement";
import ClientCRM from "./pages/ClientCRM";
import Services from "./pages/Services";
import Staff from "./pages/Staff";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Availability from "@/pages/Availability";
import BookingPublic from "@/pages/BookingPublic";
import TodayAppointments from "@/pages/TodayAppointments";
import AllAppointments from "@/pages/AllAppointments";
import CompletedAppointments from "@/pages/CompletedAppointments";
import Transfers from "@/pages/Transfers";
import Subscription from "@/pages/Subscription";
import AdminLayout from "@/components/AdminLayout";

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Index />} />
      <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" replace />} />
      <Route path="/reservas/:businessSlug" element={<BookingPublic />} />
      
      {/* Rutas protegidas con sidebar */}
      <Route path="/dashboard" element={
        user ? (
          <AdminLayout>
            <EnhancedDashboard />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      <Route path="/services" element={
        user ? (
          <AdminLayout>
            <Services />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      <Route path="/staff" element={
        user ? (
          <AdminLayout>
            <Staff />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      <Route path="/availability" element={
        user ? (
          <AdminLayout>
            <Availability />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      <Route path="/appointments" element={
        user ? (
          <AdminLayout>
            <AppointmentCenter />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      <Route path="/catalog" element={
        user ? (
          <AdminLayout>
            <CatalogManagement />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      <Route path="/clients" element={
        user ? (
          <AdminLayout>
            <ClientCRM />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      <Route path="/appointments/today" element={
        user ? (
          <AdminLayout>
            <TodayAppointments />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      <Route path="/appointments/completed" element={
        user ? (
          <AdminLayout>
            <CompletedAppointments />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      <Route path="/transfers" element={
        user ? (
          <AdminLayout>
            <Transfers />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      <Route path="/subscription" element={
        user ? (
          <AdminLayout>
            <Subscription />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      <Route path="/settings" element={
        user ? (
          <AdminLayout>
            <SettingsPage />
          </AdminLayout>
        ) : <Navigate to="/auth" replace />
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
