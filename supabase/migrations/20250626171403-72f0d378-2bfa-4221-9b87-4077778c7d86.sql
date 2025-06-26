
-- Crear ENUMs para estados de citas y validación de pagos
CREATE TYPE public.appointment_status AS ENUM (
  'pendiente', -- El turno fue agendado por el cliente pero no confirmado.
  'confirmado', -- El pago fue aprobado por el admin.
  'cancelado'  -- El turno fue cancelado.
);

CREATE TYPE public.payment_validation_status AS ENUM (
  'pendiente', -- El comprobante fue subido pero no revisado.
  'aprobado',  -- El admin aprobó el comprobante.
  'rechazado'  -- El admin rechazó el comprobante.
);

-- Tabla para almacenar los datos de cada negocio (PYME).
-- Cada negocio está vinculado a un usuario de Supabase Auth.
CREATE TABLE public.businesses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  booking_url_slug text NOT NULL UNIQUE,
  bank_account_details text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.businesses IS 'Almacena los perfiles de los negocios registrados.';
COMMENT ON COLUMN public.businesses.owner_user_id IS 'Vincula el negocio con el usuario que lo creó.';
COMMENT ON COLUMN public.businesses.booking_url_slug IS 'URL única para la página de reservas (ej. "mi-salon-de-belleza").';

-- Tabla para los servicios que ofrece cada negocio.
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.services IS 'Servicios ofrecidos por cada negocio (RF-04).';

-- Tabla para los miembros del personal de cada negocio.
CREATE TABLE public.staff_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.staff_members IS 'Personal que trabaja en el negocio (RF-05).';

-- Tabla de asociación para vincular qué personal puede realizar qué servicios (Muchos a Muchos).
CREATE TABLE public.staff_services (
  staff_id uuid NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  PRIMARY KEY (staff_id, service_id)
);

COMMENT ON TABLE public.staff_services IS 'Asocia personal con los servicios que pueden realizar (RF-05.3).';

-- Tabla para los turnos/citas agendadas por los clientes.
CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  status public.appointment_status NOT NULL DEFAULT 'pendiente',
  payment_proof_url text,
  payment_status public.payment_validation_status DEFAULT 'pendiente',
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.appointments IS 'El corazón del sistema: los turnos agendados (RF-07).';
COMMENT ON COLUMN public.appointments.payment_proof_url IS 'URL del comprobante subido a Supabase Storage (RF-08.2).';

-- Tabla para los bloqueos de tiempo del personal (vacaciones, citas, etc.).
CREATE TABLE public.time_blocks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id uuid NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.time_blocks IS 'Bloqueos en la agenda del personal para indicar no disponibilidad (RF-06).';

-- Función auxiliar para obtener el business_id del usuario autenticado.
CREATE OR REPLACE FUNCTION public.get_my_business_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id
  FROM public.businesses
  WHERE owner_user_id = auth.uid();
$$;

-- Habilitar RLS y crear políticas para 'businesses'
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los dueños pueden ver y gestionar su propio negocio"
  ON public.businesses FOR ALL
  USING (owner_user_id = auth.uid());

-- RLS para 'services'
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los dueños pueden gestionar los servicios de su negocio"
  ON public.services FOR ALL
  USING (business_id = public.get_my_business_id());

CREATE POLICY "Cualquier persona puede ver los servicios (para la página de reserva)"
  ON public.services FOR SELECT
  USING (true);

-- RLS para 'staff_members'
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los dueños pueden gestionar el personal de su negocio"
  ON public.staff_members FOR ALL
  USING (business_id = public.get_my_business_id());

CREATE POLICY "Cualquier persona puede ver el personal (para la página de reserva)"
  ON public.staff_members FOR SELECT
  USING (true);

-- RLS para 'staff_services'
ALTER TABLE public.staff_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los dueños pueden gestionar las asociaciones de su negocio"
  ON public.staff_services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.staff_members sm
      WHERE sm.id = staff_id AND sm.business_id = public.get_my_business_id()
    )
  );

CREATE POLICY "Cualquier persona puede ver las asociaciones (para la página de reserva)"
  ON public.staff_services FOR SELECT
  USING (true);

-- RLS para 'appointments'
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los dueños pueden gestionar los turnos de su negocio"
  ON public.appointments FOR ALL
  USING (business_id = public.get_my_business_id());

CREATE POLICY "Los clientes pueden crear nuevos turnos"
  ON public.appointments FOR INSERT
  WITH CHECK (true);

-- RLS para 'time_blocks'
ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los dueños pueden gestionar los bloqueos de su personal"
  ON public.time_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.staff_members sm
      WHERE sm.id = staff_id AND sm.business_id = public.get_my_business_id()
    )
  );

CREATE POLICY "Cualquier persona puede ver los bloqueos (para calcular disponibilidad)"
  ON public.time_blocks FOR SELECT
  USING (true);

-- Crear bucket para comprobantes de pago
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_proofs', 'payment_proofs', true);

-- Política de inserción para que los clientes puedan subir comprobantes
CREATE POLICY "Los clientes pueden subir comprobantes de pago"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment_proofs');

-- Política de lectura para que los dueños puedan ver los comprobantes
CREATE POLICY "Los dueños pueden ver comprobantes de su negocio"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment_proofs');
