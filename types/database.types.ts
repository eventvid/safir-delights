export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type OrderStatusType = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type UserRoleType = 'user' | 'admin'

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          image_url: string | null
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          image_url?: string | null
          stock?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          image_url?: string | null
          stock?: number
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      product_categories: {
        Row: {
          product_id: string
          category_id: string
        }
        Insert: {
          product_id: string
          category_id: string
        }
        Update: {
          product_id?: string
          category_id?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
        }
        Update: {
          quantity?: number
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_price: number
          status: OrderStatusType
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_price: number
          status?: OrderStatusType
          created_at?: string
        }
        Update: {
          status?: OrderStatusType
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          quantity?: number
          price?: number
        }
      }
      roles: {
        Row: {
          user_id: string
          role: UserRoleType
          created_at: string
        }
        Insert: {
          user_id: string
          role?: UserRoleType
          created_at?: string
        }
        Update: {
          role?: UserRoleType
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
