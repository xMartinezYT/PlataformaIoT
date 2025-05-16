export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          action: string
          details: string | null
          id: string
          timestamp: string
          userId: string
        }
        Insert: {
          action: string
          details?: string | null
          id?: string
          timestamp?: string
          userId: string
        }
        Update: {
          action?: string
          details?: string | null
          id?: string
          timestamp?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          action: string
          condition: string
          createdAt: string
          description: string | null
          deviceId: string
          id: string
          name: string
          status: string
          updatedAt: string
        }
        Insert: {
          action: string
          condition: string
          createdAt?: string
          description?: string | null
          deviceId: string
          id?: string
          name: string
          status?: string
          updatedAt?: string
        }
        Update: {
          action?: string
          condition?: string
          createdAt?: string
          description?: string | null
          deviceId?: string
          id?: string
          name?: string
          status?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_deviceId_fkey"
            columns: ["deviceId"]
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          createdAt: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updatedAt: string
        }
        Insert: {
          color?: string | null
          createdAt?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updatedAt?: string
        }
        Update: {
          color?: string | null
          createdAt?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      device_alerts: {
        Row: {
          deviceId: string
          id: string
          message: string
          severity: string
          status: string
          timestamp: string
          title: string
          userId: string
          resolvedAt: string | null
        }
        Insert: {
          deviceId: string
          id?: string
          message: string
          severity?: string
          status?: string
          timestamp?: string
          title: string
          userId: string
          resolvedAt?: string | null
        }
        Update: {
          deviceId?: string
          id?: string
          message?: string
          severity?: string
          status?: string
          timestamp?: string
          title?: string
          userId?: string
          resolvedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_alerts_deviceId_fkey"
            columns: ["deviceId"]
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_alerts_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      device_readings: {
        Row: {
          deviceId: string
          id: string
          timestamp: string
          type: string
          unit: string | null
          value: number
        }
        Insert: {
          deviceId: string
          id?: string
          timestamp?: string
          type: string
          unit?: string | null
          value: number
        }
        Update: {
          deviceId?: string
          id?: string
          timestamp?: string
          type?: string
          unit?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "device_readings_deviceId_fkey"
            columns: ["deviceId"]
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          categoryId: string | null
          createdAt: string
          description: string | null
          firmware_version: string | null
          id: string
          lastMaintenance: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          manufacturer: string | null
          model: string | null
          name: string
          serialNumber: string
          status: string
          updatedAt: string
          userId: string
          last_command: string | null
          last_command_time: string | null
          last_command_parameters: Json | null
          last_reading_at: string | null
        }
        Insert: {
          categoryId?: string | null
          createdAt?: string
          description?: string | null
          firmware_version?: string | null
          id?: string
          lastMaintenance?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          manufacturer?: string | null
          model?: string | null
          name: string
          serialNumber: string
          status: string
          updatedAt?: string
          userId: string
          last_command?: string | null
          last_command_time?: string | null
          last_command_parameters?: Json | null
          last_reading_at?: string | null
        }
        Update: {
          categoryId?: string | null
          createdAt?: string
          description?: string | null
          firmware_version?: string | null
          id?: string
          lastMaintenance?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          serialNumber?: string
          status?: string
          updatedAt?: string
          userId?: string
          last_command?: string | null
          last_command_time?: string | null
          last_command_parameters?: Json | null
          last_reading_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_categoryId_fkey"
            columns: ["categoryId"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          alertCritical: boolean
          alertHigh: boolean
          createdAt: string
          deviceStatus: boolean
          id: string
          maintenance: boolean
          security: boolean
          updatedAt: string
          userId: string
        }
        Insert: {
          alertCritical?: boolean
          alertHigh?: boolean
          createdAt?: string
          deviceStatus?: boolean
          id?: string
          maintenance?: boolean
          security?: boolean
          updatedAt?: string
          userId: string
        }
        Update: {
          alertCritical?: boolean
          alertHigh?: boolean
          createdAt?: string
          deviceStatus?: boolean
          id?: string
          maintenance?: boolean
          security?: boolean
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          createdAt: string
          id: string
          link: string | null
          message: string
          readAt: string | null
          status: string
          title: string
          type: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          link?: string | null
          message: string
          readAt?: string | null
          status?: string
          title: string
          type: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          link?: string | null
          message?: string
          readAt?: string | null
          status?: string
          title?: string
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          createdAt: string
          endpoint: string
          id: string
          p256dh: string
          updatedAt: string
          userId: string
        }
        Insert: {
          auth: string
          createdAt?: string
          endpoint: string
          id?: string
          p256dh: string
          updatedAt?: string
          userId: string
        }
        Update: {
          auth?: string
          createdAt?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          email: string | null
          email_confirmed_at: string | null
          id: string
          inserted_at: string
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          email_confirmed_at?: string | null
          id: string
          inserted_at?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          email_confirmed_at?: string | null
          id?: string
          inserted_at?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
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
      alert_severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"
      alert_status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "IGNORED"
      device_status: "ONLINE" | "OFFLINE" | "MAINTENANCE" | "ERROR" | "INACTIVE"
      notification_status: "UNREAD" | "READ"
      notification_type: "ALERT" | "MAINTENANCE" | "SYSTEM" | "DEVICE_STATUS" | "SECURITY"
      role: "ADMIN" | "MANAGER" | "TECHNICIAN" | "USER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Device = Database["public"]["Tables"]["devices"]["Row"]
