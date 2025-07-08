export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          business_id: string
          client_email: string
          client_name: string
          client_phone: string | null
          created_at: string
          end_time: string
          id: string
          payment_proof_url: string | null
          payment_status:
            | Database["public"]["Enums"]["payment_validation_status"]
            | null
          service_id: string
          staff_id: string
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
        }
        Insert: {
          business_id: string
          client_email: string
          client_name: string
          client_phone?: string | null
          created_at?: string
          end_time: string
          id?: string
          payment_proof_url?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_validation_status"]
            | null
          service_id: string
          staff_id: string
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
        }
        Update: {
          business_id?: string
          client_email?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string
          end_time?: string
          id?: string
          payment_proof_url?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_validation_status"]
            | null
          service_id?: string
          staff_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      business_settings: {
        Row: {
          allow_same_day_booking: boolean
          auto_confirm_bookings: boolean
          browser_notifications: boolean
          business_id: string
          cancellation_hours: number
          cancellation_policy: string
          cancellation_policy_text: string | null
          created_at: string
          email_booking_cancelled: boolean
          email_booking_confirmed: boolean
          email_daily_summary: boolean
          email_new_booking: boolean
          email_payment_received: boolean
          email_weekly_report: boolean
          id: string
          max_advance_days: number
          min_advance_hours: number
          require_confirmation: boolean
          sms_booking_reminder: boolean
          sms_new_booking: boolean
          sound_notifications: boolean
          updated_at: string
        }
        Insert: {
          allow_same_day_booking?: boolean
          auto_confirm_bookings?: boolean
          browser_notifications?: boolean
          business_id: string
          cancellation_hours?: number
          cancellation_policy?: string
          cancellation_policy_text?: string | null
          created_at?: string
          email_booking_cancelled?: boolean
          email_booking_confirmed?: boolean
          email_daily_summary?: boolean
          email_new_booking?: boolean
          email_payment_received?: boolean
          email_weekly_report?: boolean
          id?: string
          max_advance_days?: number
          min_advance_hours?: number
          require_confirmation?: boolean
          sms_booking_reminder?: boolean
          sms_new_booking?: boolean
          sound_notifications?: boolean
          updated_at?: string
        }
        Update: {
          allow_same_day_booking?: boolean
          auto_confirm_bookings?: boolean
          browser_notifications?: boolean
          business_id?: string
          cancellation_hours?: number
          cancellation_policy?: string
          cancellation_policy_text?: string | null
          created_at?: string
          email_booking_cancelled?: boolean
          email_booking_confirmed?: boolean
          email_daily_summary?: boolean
          email_new_booking?: boolean
          email_payment_received?: boolean
          email_weekly_report?: boolean
          id?: string
          max_advance_days?: number
          min_advance_hours?: number
          require_confirmation?: boolean
          sms_booking_reminder?: boolean
          sms_new_booking?: boolean
          sound_notifications?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_subscriptions: {
        Row: {
          business_id: string
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_subscriptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          bank_account_details: string | null
          booking_url_slug: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          owner_user_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bank_account_details?: string | null
          booking_url_slug: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_user_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bank_account_details?: string | null
          booking_url_slug?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_user_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      google_calendar_events: {
        Row: {
          appointment_id: string
          business_id: string
          created_at: string
          google_event_id: string
          id: string
          updated_at: string
        }
        Insert: {
          appointment_id: string
          business_id: string
          created_at?: string
          google_event_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          business_id?: string
          created_at?: string
          google_event_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_calendar_events_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "google_calendar_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_usage: {
        Row: {
          business_id: string
          completed_bookings: number
          created_at: string
          id: string
          month: number
          updated_at: string
          year: number
        }
        Insert: {
          business_id: string
          completed_bookings?: number
          created_at?: string
          id?: string
          month: number
          updated_at?: string
          year: number
        }
        Update: {
          business_id?: string
          completed_bookings?: number
          created_at?: string
          id?: string
          month?: number
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_usage_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          accepts_cash: boolean | null
          accepts_transfer: boolean | null
          business_id: string
          confirmation_message: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          friday_end: string | null
          friday_start: string | null
          id: string
          image_url: string | null
          is_friday_active: boolean | null
          is_monday_active: boolean | null
          is_saturday_active: boolean | null
          is_sunday_active: boolean | null
          is_thursday_active: boolean | null
          is_tuesday_active: boolean | null
          is_wednesday_active: boolean | null
          min_advance_days: number | null
          monday_end: string | null
          monday_start: string | null
          name: string
          price: number
          saturday_end: string | null
          saturday_start: string | null
          sunday_end: string | null
          sunday_start: string | null
          thursday_end: string | null
          thursday_start: string | null
          tuesday_end: string | null
          tuesday_start: string | null
          wednesday_end: string | null
          wednesday_start: string | null
        }
        Insert: {
          accepts_cash?: boolean | null
          accepts_transfer?: boolean | null
          business_id: string
          confirmation_message?: string | null
          created_at?: string
          description?: string | null
          duration_minutes: number
          friday_end?: string | null
          friday_start?: string | null
          id?: string
          image_url?: string | null
          is_friday_active?: boolean | null
          is_monday_active?: boolean | null
          is_saturday_active?: boolean | null
          is_sunday_active?: boolean | null
          is_thursday_active?: boolean | null
          is_tuesday_active?: boolean | null
          is_wednesday_active?: boolean | null
          min_advance_days?: number | null
          monday_end?: string | null
          monday_start?: string | null
          name: string
          price: number
          saturday_end?: string | null
          saturday_start?: string | null
          sunday_end?: string | null
          sunday_start?: string | null
          thursday_end?: string | null
          thursday_start?: string | null
          tuesday_end?: string | null
          tuesday_start?: string | null
          wednesday_end?: string | null
          wednesday_start?: string | null
        }
        Update: {
          accepts_cash?: boolean | null
          accepts_transfer?: boolean | null
          business_id?: string
          confirmation_message?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          friday_end?: string | null
          friday_start?: string | null
          id?: string
          image_url?: string | null
          is_friday_active?: boolean | null
          is_monday_active?: boolean | null
          is_saturday_active?: boolean | null
          is_sunday_active?: boolean | null
          is_thursday_active?: boolean | null
          is_tuesday_active?: boolean | null
          is_wednesday_active?: boolean | null
          min_advance_days?: number | null
          monday_end?: string | null
          monday_start?: string | null
          name?: string
          price?: number
          saturday_end?: string | null
          saturday_start?: string | null
          sunday_end?: string | null
          sunday_start?: string | null
          thursday_end?: string | null
          thursday_start?: string | null
          tuesday_end?: string | null
          tuesday_start?: string | null
          wednesday_end?: string | null
          wednesday_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_members: {
        Row: {
          business_id: string
          created_at: string
          email: string | null
          friday_end_time: string | null
          friday_start_time: string | null
          full_name: string
          id: string
          is_active: boolean
          monday_end_time: string | null
          monday_start_time: string | null
          photo_url: string | null
          saturday_end_time: string | null
          saturday_start_time: string | null
          sunday_end_time: string | null
          sunday_start_time: string | null
          thursday_end_time: string | null
          thursday_start_time: string | null
          tuesday_end_time: string | null
          tuesday_start_time: string | null
          wednesday_end_time: string | null
          wednesday_start_time: string | null
          work_end_time: string | null
          work_start_time: string | null
          works_friday: boolean | null
          works_monday: boolean | null
          works_saturday: boolean | null
          works_sunday: boolean | null
          works_thursday: boolean | null
          works_tuesday: boolean | null
          works_wednesday: boolean | null
        }
        Insert: {
          business_id: string
          created_at?: string
          email?: string | null
          friday_end_time?: string | null
          friday_start_time?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          monday_end_time?: string | null
          monday_start_time?: string | null
          photo_url?: string | null
          saturday_end_time?: string | null
          saturday_start_time?: string | null
          sunday_end_time?: string | null
          sunday_start_time?: string | null
          thursday_end_time?: string | null
          thursday_start_time?: string | null
          tuesday_end_time?: string | null
          tuesday_start_time?: string | null
          wednesday_end_time?: string | null
          wednesday_start_time?: string | null
          work_end_time?: string | null
          work_start_time?: string | null
          works_friday?: boolean | null
          works_monday?: boolean | null
          works_saturday?: boolean | null
          works_sunday?: boolean | null
          works_thursday?: boolean | null
          works_tuesday?: boolean | null
          works_wednesday?: boolean | null
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string | null
          friday_end_time?: string | null
          friday_start_time?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          monday_end_time?: string | null
          monday_start_time?: string | null
          photo_url?: string | null
          saturday_end_time?: string | null
          saturday_start_time?: string | null
          sunday_end_time?: string | null
          sunday_start_time?: string | null
          thursday_end_time?: string | null
          thursday_start_time?: string | null
          tuesday_end_time?: string | null
          tuesday_start_time?: string | null
          wednesday_end_time?: string | null
          wednesday_start_time?: string | null
          work_end_time?: string | null
          work_start_time?: string | null
          works_friday?: boolean | null
          works_monday?: boolean | null
          works_saturday?: boolean | null
          works_sunday?: boolean | null
          works_thursday?: boolean | null
          works_tuesday?: boolean | null
          works_wednesday?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_services: {
        Row: {
          service_id: string
          staff_id: string
        }
        Insert: {
          service_id: string
          staff_id: string
        }
        Update: {
          service_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_services_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          max_bookings_per_month: number | null
          name: string
          price_cop: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_bookings_per_month?: number | null
          name: string
          price_cop?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_bookings_per_month?: number | null
          name?: string
          price_cop?: number
        }
        Relationships: []
      }
      time_blocks: {
        Row: {
          created_at: string
          end_time: string
          id: string
          reason: string | null
          staff_id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          reason?: string | null
          staff_id: string
          start_time: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          reason?: string | null
          staff_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_blocks_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      user_google_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          google_email: string
          id: string
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          google_email: string
          id?: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          google_email?: string
          id?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_accept_booking: {
        Args: { business_uuid: string }
        Returns: boolean
      }
      cleanup_broken_payment_proof_urls: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_appointment_safely: {
        Args: {
          p_client_name: string
          p_client_email: string
          p_client_phone: string
          p_service_id: string
          p_staff_id: string
          p_start_time: string
          p_end_time: string
          p_business_id: string
        }
        Returns: Json
      }
      get_my_business_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      appointment_status:
        | "pendiente"
        | "confirmado"
        | "cancelado"
        | "completado"
      payment_validation_status: "pendiente" | "aprobado" | "rechazado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "pendiente",
        "confirmado",
        "cancelado",
        "completado",
      ],
      payment_validation_status: ["pendiente", "aprobado", "rechazado"],
    },
  },
} as const
