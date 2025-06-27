export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  updated_at?: string;
}

export interface Business {
  id: string;
  owner_user_id: string;
  name: string;
  description?: string;
  address?: string;
  contact_phone?: string;
  contact_email?: string;
  logo_url?: string;
  booking_url_slug: string;
  bank_account_details?: string;
  created_at: string;
  updated_at?: string;
}

export interface BusinessInsert {
  name: string;
  description?: string;
  address?: string;
  contact_phone?: string;
  contact_email?: string;
  logo_url?: string;
  booking_url_slug: string;
  bank_account_details?: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  confirmation_message?: string;
  image_url?: string;
  duration_minutes: number;
  price: number;
  accepts_cash?: boolean;
  accepts_transfer?: boolean;
  min_advance_days?: number;
  is_monday_active?: boolean;
  is_tuesday_active?: boolean;
  is_wednesday_active?: boolean;
  is_thursday_active?: boolean;
  is_friday_active?: boolean;
  is_saturday_active?: boolean;
  is_sunday_active?: boolean;
  monday_start?: string;
  monday_end?: string;
  tuesday_start?: string;
  tuesday_end?: string;
  wednesday_start?: string;
  wednesday_end?: string;
  thursday_start?: string;
  thursday_end?: string;
  friday_start?: string;
  friday_end?: string;
  saturday_start?: string;
  saturday_end?: string;
  sunday_start?: string;
  sunday_end?: string;
  created_at: string;
}

export interface ServiceInsert {
  business_id?: string;
  name: string;
  description?: string;
  confirmation_message?: string;
  image_url?: string;
  duration_minutes: number;
  price: number;
  accepts_cash?: boolean;
  accepts_transfer?: boolean;
  min_advance_days?: number;
  is_monday_active?: boolean;
  is_tuesday_active?: boolean;
  is_wednesday_active?: boolean;
  is_thursday_active?: boolean;
  is_friday_active?: boolean;
  is_saturday_active?: boolean;
  is_sunday_active?: boolean;
  monday_start?: string;
  monday_end?: string;
  tuesday_start?: string;
  tuesday_end?: string;
  wednesday_start?: string;
  wednesday_end?: string;
  thursday_start?: string;
  thursday_end?: string;
  friday_start?: string;
  friday_end?: string;
  saturday_start?: string;
  saturday_end?: string;
  sunday_start?: string;
  sunday_end?: string;
}

export interface StaffMember {
  id: string;
  business_id: string;
  full_name: string;
  email?: string;
  photo_url?: string;
  is_active: boolean;
  work_start_time?: string;
  work_end_time?: string;
  works_monday?: boolean;
  works_tuesday?: boolean;
  works_wednesday?: boolean;
  works_thursday?: boolean;
  works_friday?: boolean;
  works_saturday?: boolean;
  works_sunday?: boolean;
  monday_start_time?: string;
  monday_end_time?: string;
  tuesday_start_time?: string;
  tuesday_end_time?: string;
  wednesday_start_time?: string;
  wednesday_end_time?: string;
  thursday_start_time?: string;
  thursday_end_time?: string;
  friday_start_time?: string;
  friday_end_time?: string;
  saturday_start_time?: string;
  saturday_end_time?: string;
  sunday_start_time?: string;
  sunday_end_time?: string;
  created_at: string;
}

export interface StaffMemberInsert {
  business_id?: string;
  full_name: string;
  email?: string;
  photo_url?: string;
  is_active: boolean;
  work_start_time?: string;
  work_end_time?: string;
  works_monday?: boolean;
  works_tuesday?: boolean;
  works_wednesday?: boolean;
  works_thursday?: boolean;
  works_friday?: boolean;
  works_saturday?: boolean;
  works_sunday?: boolean;
  monday_start_time?: string;
  monday_end_time?: string;
  tuesday_start_time?: string;
  tuesday_end_time?: string;
  wednesday_start_time?: string;
  wednesday_end_time?: string;
  thursday_start_time?: string;
  thursday_end_time?: string;
  friday_start_time?: string;
  friday_end_time?: string;
  saturday_start_time?: string;
  saturday_end_time?: string;
  sunday_start_time?: string;
  sunday_end_time?: string;
}

export type AppointmentStatus = 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
export type PaymentValidationStatus = 'pendiente' | 'aprobado' | 'rechazado';

export interface Appointment {
  id: string;
  business_id: string;
  service_id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  status: AppointmentStatus;
  payment_proof_url?: string;
  payment_status?: PaymentValidationStatus;
  created_at: string;
  services?: {
    price: number;
    name: string;
    duration_minutes: number;
  };
  staff_members?: {
    full_name: string;
  };
}

export interface AppointmentInsert {
  business_id: string;
  service_id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  status?: AppointmentStatus;
  payment_proof_url?: string;
  payment_status?: PaymentValidationStatus;
}

export interface TimeBlock {
  id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  reason?: string;
  created_at: string;
}

export interface TimeBlockInsert {
  staff_id: string;
  start_time: string;
  end_time: string;
  reason?: string;
}
