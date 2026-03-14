export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}