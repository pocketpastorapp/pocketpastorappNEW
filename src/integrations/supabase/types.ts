export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bible_bookmarks: {
        Row: {
          bible_id: string
          chapter_id: string
          color: string
          created_at: string
          id: string
          reference: string
          user_id: string
        }
        Insert: {
          bible_id: string
          chapter_id: string
          color?: string
          created_at?: string
          id?: string
          reference: string
          user_id: string
        }
        Update: {
          bible_id?: string
          chapter_id?: string
          color?: string
          created_at?: string
          id?: string
          reference?: string
          user_id?: string
        }
        Relationships: []
      }
      bible_recommendations: {
        Row: {
          bible_reference: string
          created_at: string
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          reason: string
          topic: string
          updated_at: string
          user_id: string
          verse_text: string
        }
        Insert: {
          bible_reference: string
          created_at?: string
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          reason: string
          topic: string
          updated_at?: string
          user_id: string
          verse_text: string
        }
        Update: {
          bible_reference?: string
          created_at?: string
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          reason?: string
          topic?: string
          updated_at?: string
          user_id?: string
          verse_text?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          id: string
          is_favorite: boolean | null
          sender: string
          session_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          content: string
          id?: string
          is_favorite?: boolean | null
          sender: string
          session_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          is_favorite?: boolean | null
          sender?: string
          session_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_topics: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          session_id: string | null
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          session_id?: string | null
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          session_id?: string | null
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cluster_verses: {
        Row: {
          cluster_id: string
          created_at: string
          id: string
          verse_number: string
          verse_reference: string
          verse_text: string
        }
        Insert: {
          cluster_id: string
          created_at?: string
          id?: string
          verse_number: string
          verse_reference: string
          verse_text: string
        }
        Update: {
          cluster_id?: string
          created_at?: string
          id?: string
          verse_number?: string
          verse_reference?: string
          verse_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "cluster_verses_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "verse_clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_verses: {
        Row: {
          bible_id: string
          chapter_id: string
          created_at: string
          id: string
          reference: string
          user_id: string
          verse_number: string
          verse_text: string
        }
        Insert: {
          bible_id: string
          chapter_id: string
          created_at?: string
          id?: string
          reference: string
          user_id: string
          verse_number: string
          verse_text: string
        }
        Update: {
          bible_id?: string
          chapter_id?: string
          created_at?: string
          id?: string
          reference?: string
          user_id?: string
          verse_number?: string
          verse_text?: string
        }
        Relationships: []
      }
      gift_code_redemptions: {
        Row: {
          credits_awarded: number
          gift_code: string
          id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          credits_awarded: number
          gift_code: string
          id?: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          credits_awarded?: number
          gift_code?: string
          id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          disclaimer_accepted: boolean
          email: string
          gender: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          disclaimer_accepted?: boolean
          email: string
          gender?: string | null
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          disclaimer_accepted?: boolean
          email?: string
          gender?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount_usd: number
          checkout_session_id: string | null
          created_at: string
          credits_purchased: number
          id: string
          status: string
          user_id: string
        }
        Insert: {
          amount_usd: number
          checkout_session_id?: string | null
          created_at?: string
          credits_purchased: number
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          amount_usd?: number
          checkout_session_id?: string | null
          created_at?: string
          credits_purchased?: number
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      recommendation_interactions: {
        Row: {
          action: string
          created_at: string
          id: string
          recommendation_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          recommendation_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          recommendation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_recommendation_interactions_recommendation_id"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "bible_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      topic_studies_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          current_step: number | null
          id: string
          started_at: string
          topic_id: string
          topic_name: string
          total_steps: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          current_step?: number | null
          id?: string
          started_at?: string
          topic_id: string
          topic_name: string
          total_steps: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          current_step?: number | null
          id?: string
          started_at?: string
          topic_id?: string
          topic_name?: string
          total_steps?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          free_credits: number
          has_unlimited_credits: boolean
          id: string
          last_free_credit_date: string
          total_credits: number
          user_id: string
        }
        Insert: {
          free_credits?: number
          has_unlimited_credits?: boolean
          id?: string
          last_free_credit_date?: string
          total_credits?: number
          user_id: string
        }
        Update: {
          free_credits?: number
          has_unlimited_credits?: boolean
          id?: string
          last_free_credit_date?: string
          total_credits?: number
          user_id?: string
        }
        Relationships: []
      }
      user_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          bubble_colors: Json | null
          created_at: string
          current_session_id: string | null
          home_page_settings: Json | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bubble_colors?: Json | null
          created_at?: string
          current_session_id?: string | null
          home_page_settings?: Json | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bubble_colors?: Json | null
          created_at?: string
          current_session_id?: string | null
          home_page_settings?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verse_clusters: {
        Row: {
          bible_id: string
          chapter_id: string
          cluster_name: string | null
          created_at: string
          id: string
          reference: string
          sort_order: number | null
          user_id: string
        }
        Insert: {
          bible_id: string
          chapter_id: string
          cluster_name?: string | null
          created_at?: string
          id?: string
          reference: string
          sort_order?: number | null
          user_id: string
        }
        Update: {
          bible_id?: string
          chapter_id?: string
          cluster_name?: string | null
          created_at?: string
          id?: string
          reference?: string
          sort_order?: number | null
          user_id?: string
        }
        Relationships: []
      }
      verse_highlights: {
        Row: {
          bible_id: string
          chapter_id: string
          created_at: string
          highlight_type: string
          id: string
          updated_at: string
          user_id: string
          verse_number: string
        }
        Insert: {
          bible_id: string
          chapter_id: string
          created_at?: string
          highlight_type?: string
          id?: string
          updated_at?: string
          user_id: string
          verse_number: string
        }
        Update: {
          bible_id?: string
          chapter_id?: string
          created_at?: string
          highlight_type?: string
          id?: string
          updated_at?: string
          user_id?: string
          verse_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_old_chat_sessions: {
        Args: { p_days?: number }
        Returns: {
          deleted_count: number
        }[]
      }
      delete_session_messages: {
        Args: { p_session_id: string; p_user_id: string }
        Returns: {
          deleted_count: number
        }[]
      }
      delete_user_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_cluster_ids: {
        Args: Record<PropertyKey, never>
        Returns: {
          cluster_id: string
        }[]
      }
      log_security_event: {
        Args: { details?: Json; event_type: string }
        Returns: undefined
      }
      safe_update_profile: {
        Args: { profile_avatar_url?: string; profile_name?: string }
        Returns: undefined
      }
      set_user_unlimited_credits: {
        Args: { user_email: string }
        Returns: undefined
      }
      validate_credit_operation: {
        Args: {
          credit_change: number
          operation_type: string
          user_id_param: string
        }
        Returns: boolean
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
    Enums: {},
  },
} as const
