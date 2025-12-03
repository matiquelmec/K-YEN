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
      products: {
        Row: {
          id: number
          name: string
          description: string
          price: number
          original_price: number | null
          category: string
          sizes: string[]
          colors: string[]
          images: string[]
          stock: number
          rating: number | null
          reviews_count: number
          is_new: boolean
          is_sale: boolean
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          price: number
          original_price?: number | null
          category: string
          sizes: string[]
          colors: string[]
          images: string[]
          stock?: number
          rating?: number | null
          reviews_count?: number
          is_new?: boolean
          is_sale?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          price?: number
          original_price?: number | null
          category?: string
          sizes?: string[]
          colors?: string[]
          images?: string[]
          stock?: number
          rating?: number | null
          reviews_count?: number
          is_new?: boolean
          is_sale?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: number
          user_id: string
          product_id: number
          quantity: number
          size: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          product_id: number
          quantity: number
          size: string
          color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          product_id?: number
          quantity?: number
          size?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          user_id: string
          order_number: string
          status: string
          total: number
          shipping_address: Json
          items: Json[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          order_number?: string
          status?: string
          total: number
          shipping_address: Json
          items: Json[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          order_number?: string
          status?: string
          total?: number
          shipping_address?: Json
          items?: Json[]
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    }
  }
}