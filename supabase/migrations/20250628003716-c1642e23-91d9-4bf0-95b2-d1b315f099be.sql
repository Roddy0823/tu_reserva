
-- RF-4.1: Implementar Suscripciones en Tiempo Real

-- 1. Habilitar replica identity completa para capturar todos los cambios
ALTER TABLE public.appointments REPLICA IDENTITY FULL;
ALTER TABLE public.time_blocks REPLICA IDENTITY FULL;

-- 2. Agregar las tablas a la publicación de realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.time_blocks;
