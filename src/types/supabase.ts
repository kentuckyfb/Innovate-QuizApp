// src/types/supabase.ts
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
      quiz_users: {
        Row: {
          id: string
          name: string
          phone: string
          quiz_type: string | null
          personality_result: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          quiz_type?: string | null
          personality_result?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          quiz_type?: string | null
          personality_result?: string | null
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          question_number: number
          question_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_number: number
          question_text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_number?: number
          question_text?: string
          created_at?: string
          updated_at?: string
        }
      }
      options: {
        Row: {
          id: string
          question_id: string
          option_text: string
          option_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          option_text: string
          option_number: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          option_text?: string
          option_number?: string
          created_at?: string
          updated_at?: string
        }
      }
      personalities: {
        Row: {
          id: string
          name: string
          title: string
          description: string
          traits: Json
          icon: string
          image_path: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          description: string
          traits: Json
          icon: string
          image_path: string
          color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          description?: string
          traits?: Json
          icon?: string
          image_path?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      personality_weights: {
        Row: {
          id: string
          option_id: string
          personality_id: string
          weight: number
          created_at: string
        }
        Insert: {
          id?: string
          option_id: string
          personality_id: string
          weight: number
          created_at?: string
        }
        Update: {
          id?: string
          option_id?: string
          personality_id?: string
          weight?: number
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          name: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          value?: Json
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}