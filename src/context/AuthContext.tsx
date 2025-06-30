import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error };
      }

      // Check if the user has been marked as deleted
      if (data.user?.user_metadata?.deleted === true) {
        // Sign them out immediately
        await supabase.auth.signOut();
        return { data: null, error: new Error('This account has been deleted') };
      }

      return { data: data.session, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to sign in') 
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data: data.session, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Simple account deletion using the complete_delete_user SQL function
  const deleteAccount = async () => {
    try {
      // Check if user is logged in
      if (!user || !user.id) {
        return { error: new Error('No user is logged in') };
      }

      console.log('Starting account deletion for user:', user.id);
      
      // Call the simplified SQL function
      console.log('Calling complete_delete_user function...');
      const { data, error } = await supabase.rpc('complete_delete_user');
      
      if (error) {
        console.error('Error deleting account:', error);
        return { error: new Error(`Failed to delete account: ${error.message}`) };
      }
      
      console.log('Account deletion successful:', data);
      
      // Sign out after deletion
      console.log('Signing out user...');
      await signOut();
      
      // Return success
      return { error: null };
    } catch (error) {
      console.error('Error in account deletion:', error);
      return { error: error instanceof Error ? error : new Error('Failed to delete account') };
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 