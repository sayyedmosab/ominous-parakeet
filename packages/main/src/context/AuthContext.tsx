import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';

interface User {
  id: string;
  email: string;
}

interface AuthError {
  name: string;
  message: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  register: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<{ error: AuthError | null }>;
  loginWithGoogle: () => Promise<{ error: AuthError | null }>;
  loginWithApple: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ? { id: session.user.id, email: session.user.email || '' } : null);
      } catch (e) {
        console.error('Failed to initialize auth session', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email || '' } : null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: { name: 'AuthError', message: error.message } };
      }

      return { error: null };
    } catch (error) {
      return { error: { name: 'AuthError', message: 'An unexpected error occurred during login.' } };
    }
  };

  const register = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            consent_given: false // Add consent field for registration
          }
        }
      });

      if (error) {
        return { error: { name: 'AuthError', message: error.message } };
      }

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        // User registered but needs to confirm email
        return { error: null }; // This is expected for email verification flow
      }

      return { error: null };
    } catch (error) {
      return { error: { name: 'AuthError', message: 'An unexpected error occurred during registration.' } };
    }
  };

  const loginWithGoogle = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        return { error: { name: 'AuthError', message: error.message } };
      }

      return { error: null };
    } catch (error) {
      return { error: { name: 'AuthError', message: 'An unexpected error occurred during Google login.' } };
    }
  };

  const loginWithApple = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'name email'
        }
      });

      if (error) {
        return { error: { name: 'AuthError', message: error.message } };
      }

      return { error: null };
    } catch (error) {
      return { error: { name: 'AuthError', message: 'An unexpected error occurred during Apple login.' } };
    }
  };

  const logout = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: { name: 'AuthError', message: error.message } };
      }
      return { error: null };
    } catch (error) {
      return { error: { name: 'AuthError', message: 'An unexpected error occurred during logout.' } };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle, loginWithApple }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
