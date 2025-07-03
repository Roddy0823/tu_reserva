-- Crear tabla para almacenar tokens de Google Calendar
CREATE TABLE public.user_google_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  google_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.user_google_tokens ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean sus propios tokens
CREATE POLICY "Users can view their own Google tokens" 
  ON public.user_google_tokens 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Política para que los usuarios puedan crear sus tokens
CREATE POLICY "Users can create their own Google tokens" 
  ON public.user_google_tokens 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Política para que los usuarios puedan actualizar sus tokens
CREATE POLICY "Users can update their own Google tokens" 
  ON public.user_google_tokens 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Política para que los usuarios puedan eliminar sus tokens
CREATE POLICY "Users can delete their own Google tokens" 
  ON public.user_google_tokens 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Trigger para actualizar updated_at
CREATE TRIGGER update_user_google_tokens_updated_at
  BEFORE UPDATE ON public.user_google_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Crear tabla para eventos sincronizados con Google Calendar
CREATE TABLE public.google_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  google_event_id TEXT NOT NULL,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(appointment_id),
  UNIQUE(google_event_id)
);

-- Habilitar RLS
ALTER TABLE public.google_calendar_events ENABLE ROW LEVEL SECURITY;

-- Política para que los dueños puedan ver los eventos de sus negocios
CREATE POLICY "Business owners can view their Google Calendar events" 
  ON public.google_calendar_events 
  FOR SELECT 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Política para que los dueños puedan crear eventos para sus negocios
CREATE POLICY "Business owners can create Google Calendar events" 
  ON public.google_calendar_events 
  FOR INSERT 
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Política para que los dueños puedan actualizar eventos de sus negocios
CREATE POLICY "Business owners can update their Google Calendar events" 
  ON public.google_calendar_events 
  FOR UPDATE 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Política para que los dueños puedan eliminar eventos de sus negocios
CREATE POLICY "Business owners can delete their Google Calendar events" 
  ON public.google_calendar_events 
  FOR DELETE 
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_user_id = auth.uid()));

-- Trigger para actualizar updated_at
CREATE TRIGGER update_google_calendar_events_updated_at
  BEFORE UPDATE ON public.google_calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();