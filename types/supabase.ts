export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          tour_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          appointment_date: string
          appointment_time: string
          passengers: number
          special_requests: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          tour_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          appointment_date: string
          appointment_time: string
          passengers: number
          special_requests?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          tour_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          appointment_date?: string
          appointment_time?: string
          passengers?: number
          special_requests?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          }
        ]
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          tour_id: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          tour_id?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          tour_id?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          }
        ]
      }
      tours: {
        Row: {
          id: string
          name: string
          description: string
          short_description: string | null
          price: number
          duration: number
          category: string
          image_url: string | null
          is_featured: boolean | null
          is_promotion: boolean | null
          promotion_price: number | null
          created_at: string | null
          updated_at: string | null
          slug: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          short_description?: string | null
          price: number
          duration: number
          category: string
          image_url?: string | null
          is_featured?: boolean | null
          is_promotion?: boolean | null
          promotion_price?: number | null
          created_at?: string | null
          updated_at?: string | null
          slug?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          short_description?: string | null
          price?: number
          duration?: number
          category?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_promotion?: boolean | null
          slug?: string | null
          promotion_price?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transfers: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          transfer_date: string
          transfer_time: string
          airport: string
          flight_number: string | null
          hotel_address: string | null
          passengers: number
          special_requests: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          customer_phone: string
          transfer_date: string
          transfer_time: string
          airport: string
          flight_number?: string | null
          hotel_address?: string | null
          passengers: number
          special_requests?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          transfer_date?: string
          transfer_time?: string
          airport?: string
          flight_number?: string | null
          hotel_address?: string | null
          passengers?: number
          special_requests?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}