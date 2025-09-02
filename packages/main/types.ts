// import type { User as SupabaseUser, AuthError as SupabaseAuthError } from '@supabase/supabase-js';

// Mock User and AuthError for local development without Supabase
export interface User {
  id: string;
  email?: string;
  // Add any other user properties your app uses
}
export interface AuthError {
  message: string;
  name: string;
}


export interface SubNavLink {
  id: number | string;
  text: string;
  href: string;
  icon?: React.ComponentType<any>;
}

export interface NavLink {
  id: number | string;
  text: string;
  href: string;
  icon?: React.ComponentType<any>;
  subLinks?: SubNavLink[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  register: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  loginWithGoogle: () => Promise<{ error: AuthError | null }>;
  loginWithApple: () => Promise<{ error: AuthError | null }>;
  logout: () => Promise<{ error: AuthError | null }>;
}
