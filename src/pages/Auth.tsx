
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigate } from 'react-router-dom';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirigir si ya está autenticado
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    await signIn(email, password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    await signUp(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex min-h-screen">
        {/* Left side - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4">
                <Calendar className="h-7 w-7 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold">Tu Reserva</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Gestiona tu negocio de manera inteligente
            </h2>
            
            <p className="text-xl mb-8 text-blue-100">
              La plataforma todo-en-uno para administrar reservas, clientes y servicios de tu negocio.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Reservas Online</h3>
                  <p className="text-blue-100">Permite a tus clientes reservar 24/7</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Gestión de Clientes</h3>
                  <p className="text-blue-100">Mantén un registro completo de tus clientes</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Horarios Flexibles</h3>
                  <p className="text-blue-100">Configura tu disponibilidad fácilmente</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Seguimiento Completo</h3>
                  <p className="text-blue-100">Analiza el rendimiento de tu negocio</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Authentication Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Tu Reserva</h1>
              </div>
              <p className="text-gray-600">Gestiona tu negocio de manera inteligente</p>
            </div>

            <Card className="card-elevated shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6 bg-gradient-to-b from-background-subtle to-background rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Bienvenido de vuelta
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Inicia sesión para acceder a tu panel de control
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger 
                      value="signin" 
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Iniciar Sesión
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Crear Cuenta
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-gray-700 font-medium">
                          Correo Electrónico
                        </Label>
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                          placeholder="tu@email.com"
                          required
                          className="input-enhanced h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-foreground font-medium">
                          Contraseña
                        </Label>
                        <Input
                          id="signin-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          required
                          className="input-enhanced h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="btn-interactive w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Iniciando...
                          </>
                        ) : (
                          "Iniciar Sesión"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-gray-700 font-medium">
                          Correo Electrónico
                        </Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="tu@email.com"
                          required
                          className="input-enhanced h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-foreground font-medium">
                          Contraseña
                        </Label>
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="input-enhanced h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center bg-muted/30 rounded-lg p-3">
                        Al crear una cuenta, aceptas nuestros términos de servicio y política de privacidad.
                      </p>
                      <Button 
                        type="submit" 
                        className="btn-interactive w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Creando cuenta...
                          </>
                        ) : (
                          "Crear Cuenta"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                ¿Necesitas ayuda? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contáctanos</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
