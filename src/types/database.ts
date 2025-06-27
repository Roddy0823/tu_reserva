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
  booking_url_slug: string;
  bank_account_details?: string;
  created_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  image_url?: string;
  duration_minutes: number;
  price: number;
  created_at: string;
}

export interface ServiceInsert {
  business_id?: string;
  name: string;
  description?: string;
  image_url?: string;
  duration_minutes: number;
  price: number;
}

export interface StaffMember {
  id: string;
  business_id: string;
  full_name: string;
  email?: string;
  photo_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface StaffMemberInsert {
  business_id?: string;
  full_name: string;
  email?: string;
  photo_url?: string;
  is_active: boolean;
}

export type AppointmentStatus = 'pendiente' | 'confirmado' | 'cancelado';
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
  };
  staff_members?: {
    full_name: string;
  };
}

export interface TimeBlock {
  id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  reason?: string;
  created_at: string;
}
