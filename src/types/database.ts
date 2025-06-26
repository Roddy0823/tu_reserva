
import { Database } from "@/integrations/supabase/types";

// Tipos derivados de la base de datos
export type Business = Database['public']['Tables']['businesses']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type StaffMember = Database['public']['Tables']['staff_members']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type TimeBlock = Database['public']['Tables']['time_blocks']['Row'];

// Tipos para inserción
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type StaffMemberInsert = Database['public']['Tables']['staff_members']['Insert'];
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
export type TimeBlockInsert = Database['public']['Tables']['time_blocks']['Insert'];

// Enums
export type AppointmentStatus = Database['public']['Enums']['appointment_status'];
export type PaymentValidationStatus = Database['public']['Enums']['payment_validation_status'];
