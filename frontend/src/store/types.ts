export interface User {
  email: string;
  username: string ;
  role: 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage: string | null;
}
