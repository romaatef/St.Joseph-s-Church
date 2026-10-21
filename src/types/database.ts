import type { StageId } from "@/config/stages";

export type UserRole = "admin" | "stage_responsible" | "viewer";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: UserRole;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role: UserRole;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: UserRole;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      stage_responsibilities: {
        Row: {
          user_id: string;
          stage_id: StageId;
          created_at: string;
        };
        Insert: {
          user_id: string;
          stage_id: StageId;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          stage_id?: StageId;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      admin_save_profile: {
        Args: {
          p_user_id: string;
          p_name: string;
          p_role: UserRole;
          p_stage_ids: StageId[];
        };
        Returns: undefined;
      };
      admin_set_profile_active: {
        Args: { p_user_id: string; p_active: boolean };
        Returns: undefined;
      };
      has_stage_access: {
        Args: { requested_stage: string };
        Returns: boolean;
      };
      has_stage_read_access: {
        Args: { requested_stage: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
};
