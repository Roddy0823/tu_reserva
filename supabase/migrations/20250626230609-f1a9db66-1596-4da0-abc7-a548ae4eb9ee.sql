
-- Modificar la tabla services para soportar múltiples métodos de pago
ALTER TABLE public.services 
DROP CONSTRAINT IF EXISTS services_payment_method_check,
ADD COLUMN accepts_cash BOOLEAN DEFAULT true,
ADD COLUMN accepts_transfer BOOLEAN DEFAULT false;

-- Migrar datos existentes
UPDATE public.services 
SET accepts_cash = (payment_method = 'presencial' OR payment_method IS NULL),
    accepts_transfer = (payment_method = 'transferencia');

-- Eliminar la columna payment_method antigua
ALTER TABLE public.services DROP COLUMN payment_method;
