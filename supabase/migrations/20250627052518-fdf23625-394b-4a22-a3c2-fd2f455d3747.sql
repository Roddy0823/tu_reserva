
-- Agregar campos de horario de trabajo y días laborales a la tabla staff_members
ALTER TABLE public.staff_members 
ADD COLUMN work_start_time TIME DEFAULT '08:00:00',
ADD COLUMN work_end_time TIME DEFAULT '18:00:00',
ADD COLUMN works_monday BOOLEAN DEFAULT true,
ADD COLUMN works_tuesday BOOLEAN DEFAULT true,
ADD COLUMN works_wednesday BOOLEAN DEFAULT true,
ADD COLUMN works_thursday BOOLEAN DEFAULT true,
ADD COLUMN works_friday BOOLEAN DEFAULT true,
ADD COLUMN works_saturday BOOLEAN DEFAULT false,
ADD COLUMN works_sunday BOOLEAN DEFAULT false;

-- Actualizar registros existentes con valores por defecto
UPDATE public.staff_members 
SET 
  work_start_time = '08:00:00', 
  work_end_time = '18:00:00',
  works_monday = true,
  works_tuesday = true,
  works_wednesday = true,
  works_thursday = true,
  works_friday = true,
  works_saturday = false,
  works_sunday = false
WHERE work_start_time IS NULL;
