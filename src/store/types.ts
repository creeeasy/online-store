export interface User {
  email: string;
  role: 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage: string | null;
}
