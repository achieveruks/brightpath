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
      profiles: {
        Row: {
          id: string
          full_name: string
          role: 'admin' | 'manager' | 'counsellor'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          role?: 'admin' | 'manager' | 'counsellor'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: 'admin' | 'manager' | 'counsellor'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          full_name: string
          email: string | null
          phone: string
          course_interest: string
          source: string
          status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
          loss_reason: string | null
          assigned_to: string | null
          created_by: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email?: string | null
          phone: string
          course_interest: string
          source: string
          status?: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
          loss_reason?: string | null
          assigned_to?: string | null
          created_by: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string | null
          phone?: string
          course_interest?: string
          source?: string
          status?: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
          loss_reason?: string | null
          assigned_to?: string | null
          created_by?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'leads_assigned_to_fkey'
            columns: ['assigned_to']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'leads_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      follow_ups: {
        Row: {
          id: string
          lead_id: string
          assigned_to: string
          due_at: string
          note: string
          status: 'pending' | 'completed' | 'cancelled'
          completed_at: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          assigned_to: string
          due_at: string
          note: string
          status?: 'pending' | 'completed' | 'cancelled'
          completed_at?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          assigned_to?: string
          due_at?: string
          note?: string
          status?: 'pending' | 'completed' | 'cancelled'
          completed_at?: string | null
          created_by?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'follow_ups_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'follow_ups_assigned_to_fkey'
            columns: ['assigned_to']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      activities: {
        Row: {
          id: string
          lead_id: string
          actor_id: string
          activity_type: string
          description: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          actor_id: string
          activity_type: string
          description: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          actor_id?: string
          activity_type?: string
          description?: string
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'activities_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_actor_id_fkey'
            columns: ['actor_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
