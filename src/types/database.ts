
import { Database } from "@/integrations/supabase/types";

// Tipos derivados de la base de datos
export type Business = Database['public']['Tables']['businesses']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type StaffMember = Database['public']['Tables']['staff_members']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type TimeBlock = Database['public']['Tables']['time_blocks']['Row'];
export type BusinessSettings = Database['public']['Tables']['business_settings']['Row'];
export type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];
export type BusinessSubscription = Database['public']['Tables']['business_subscriptions']['Row'];
export type MonthlyUsage = Database['public']['Tables']['monthly_usage']['Row'];

// Tipos para inserción
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type StaffMemberInsert = Database['public']['Tables']['staff_members']['Insert'];
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
export type TimeBlockInsert = Database['public']['Tables']['time_blocks']['Insert'];
export type BusinessSettingsInsert = Database['public']['Tables']['business_settings']['Insert'];

// Enums
export type AppointmentStatus = Database['public']['Enums']['appointment_status'];
export type PaymentValidationStatus = Database['public']['Enums']['payment_validation_status'];
