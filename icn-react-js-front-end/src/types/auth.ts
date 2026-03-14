export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  completed: boolean;
  creator_name: string;
  edited_by?: string | null;
}

export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}