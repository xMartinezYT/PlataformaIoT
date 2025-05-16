export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      devices: {
        Row: {
          id: string
          name: string
          serial_number: string
          model: string | null
          manufacturer: string | null
          description: string | null
          status: string
          location: string | null
          latitude: number | null
          longitude: number | null
          firmware_version: string | null
          last_maintenance: string | null
          last_reading_at: string | null
          created_at: string
          updated_at: string
          user_id: string
          category_id: string | null
        }
        Insert: {
          id?: string
          name: string
          serial_number: string
          model?: string | null
          manufacturer?: string | null
          description?: string | null
          status?: string
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          firmware_version?: string | null
          last_maintenance?: string | null
          last_reading_at?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
          category_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          serial_number?: string
          model?: string | null
          manufacturer?: string | null
          description?: string | null
          status?: string
          location?: string | null
          latitude?: number | null
          longitude?: number | null
          firmware_version?: string | null
          last_maintenance?: string | null
          last_reading_at?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
          category_id?: string | null
        }
      }
      device_readings: {
        Row: {
          id: string
          device_id: string
          type: string
          value: number
          unit: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          device_id: string
          type: string
          value: number
          unit?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          device_id?: string
          type?: string
          value?: number
          unit?: string | null
          timestamp?: string
        }
      }
      device_alerts: {
        Row: {
          id: string
          device_id: string
          title: string
          message: string
          severity: string
          status: string
          timestamp: string
          resolved_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          device_id: string
          title: string
          message: string
          severity?: string
          status?: string
          timestamp?: string
          resolved_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          device_id?: string
          title?: string
          message?: string
          severity?: string
          status?: string
          timestamp?: string
          resolved_at?: string | null
          user_id?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          status: string
          link: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          status?: string
          link?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          status?: string
          link?: string | null
          read_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Device = Database["public"]["Tables"]["devices"]["Row"]
