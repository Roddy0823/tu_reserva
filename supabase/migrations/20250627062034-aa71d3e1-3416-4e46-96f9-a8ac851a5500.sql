
-- Agregar campos de horario específico para cada día de la semana
ALTER TABLE public.staff_members 
ADD COLUMN monday_start_time TIME,
ADD COLUMN monday_end_time TIME,
ADD COLUMN tuesday_start_time TIME,
ADD COLUMN tuesday_end_time TIME,
ADD COLUMN wednesday_start_time TIME,
ADD COLUMN wednesday_end_time TIME,
ADD COLUMN thursday_start_time TIME,
ADD COLUMN thursday_end_time TIME,
ADD COLUMN friday_start_time TIME,
ADD COLUMN friday_end_time TIME,
ADD COLUMN saturday_start_time TIME,
ADD COLUMN saturday_end_time TIME,
ADD COLUMN sunday_start_time TIME,
ADD COLUMN sunday_end_time TIME;

-- Actualizar registros existentes copiando los horarios generales a cada día
UPDATE public.staff_members 
SET 
  monday_start_time = work_start_time,
  monday_end_time = work_end_time,
  tuesday_start_time = work_start_time,
  tuesday_end_time = work_end_time,
  wednesday_start_time = work_start_time,
  wednesday_end_time = work_end_time,
  thursday_start_time = work_start_time,
  thursday_end_time = work_end_time,
  friday_start_time = work_start_time,
  friday_end_time = work_end_time,
  saturday_start_time = work_start_time,
  saturday_end_time = work_end_time,
  sunday_start_time = work_start_time,
  sunday_end_time = work_end_time
WHERE monday_start_time IS NULL;
