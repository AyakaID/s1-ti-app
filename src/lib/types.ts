export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  discord_id?: string | null;
  is_admin: boolean;
  points: number;
}

export interface Material {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  study_context: string | null;
  semester: number;
  file_url: string;
  file_type: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Riddle {
  id: string;
  question: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
  category: string;
  created_at: string;
}

export interface UserRiddleAttempt {
  id: string;
  user_id: string;
  riddle_id: string;
  attempted_date: string;
  selected_index: number;
  is_correct: boolean;
  points_awarded: number;
  created_at: string;
}

export interface MaterialComment {
  id: string;
  material_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
}

export interface AppNotification {
  id: string;
  user_id?: string | null;
  title: string;
  message: string;
  type: "material" | "riddle" | "comment" | "info";
  link?: string | null;
  is_read: boolean;
  created_at: string;
}