import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isAuthChecking: boolean;
  authError: string | null;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkAdminStatus: (userId: string) => Promise<boolean>;
  demoLoginAsAdmin: () => void; // Provided if database credentials are in setup/demo phase
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if user.id exists in admin_users table
  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      // If Supabase not yet configured, demo admin flag is preserved
      return false;
    }

    try {
      // Rule: Compare auth.user.id with admin_users.user_id using maybeSingle()
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error querying admin_users:', error);
        // Do not immediately sign out or clear session due to temporary network/policy error
        return false;
      }

      return Boolean(data && data.user_id === userId);
    } catch (err) {
      console.error('Failed to verify admin status:', err);
      return false;
    }
  }, []);

  // Initial session check
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      setIsAuthChecking(true);
      setAuthError(null);

      if (!isSupabaseConfigured) {
        // Supabase not configured with real URL yet
        setIsAuthChecking(false);
        return;
      }

      try {
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) {
          console.warn('Session retrieval error:', sessionErr);
        }

        if (sessionData?.session) {
          if (!isMounted) return;
          setSession(sessionData.session);
          
          const { data: userData, error: userErr } = await supabase.auth.getUser();
          if (userErr || !userData.user) {
            setUser(null);
            setIsAdmin(false);
          } else {
            setUser(userData.user);
            const authorized = await checkAdminStatus(userData.user.id);
            if (isMounted) {
              setIsAdmin(authorized);
              if (!authorized) {
                setAuthError('You are signed in, but you are not authorized as an admin.');
              }
            }
          }
        } else {
          if (isMounted) {
            setUser(null);
            setSession(null);
            setIsAdmin(false);
          }
        }
      } catch (err: unknown) {
        console.error('Auth initialization error:', err);
      } finally {
        if (isMounted) {
          // Rule: Always stop the loading state in a finally block
          setIsAuthChecking(false);
        }
      }
    }

    initAuth();

    // Listen to Supabase auth state changes
    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          if (!isMounted) return;
          
          setSession(currentSession);
          if (currentSession?.user) {
            setUser(currentSession.user);
            // Verify admin rights for current user
            const authorized = await checkAdminStatus(currentSession.user.id);
            if (isMounted) {
              setIsAdmin(authorized);
              if (!authorized) {
                setAuthError('You are signed in, but you are not authorized as an admin.');
              } else {
                setAuthError(null);
              }
            }
          } else {
            setUser(null);
            setIsAdmin(false);
          }
          setIsAuthChecking(false);
        }
      );

      return () => {
        isMounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [checkAdminStatus]);

  // Sign In using Supabase Auth
  const signIn = async (email: string, password: string) => {
    setIsAuthChecking(true);
    setAuthError(null);

    if (!isSupabaseConfigured) {
      setIsAuthChecking(false);
      const errMsg = 'Supabase credentials are not yet configured in .env. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      setAuthError(errMsg);
      return { success: false, error: errMsg };
    }

    try {
      // 1. Sign in with password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        const errMsg = 'No user returned from login.';
        setAuthError(errMsg);
        return { success: false, error: errMsg };
      }

      setUser(data.user);
      setSession(data.session);

      // 2. Query admin_users where user_id equals user.id using maybeSingle()
      const isUserAdmin = await checkAdminStatus(data.user.id);
      setIsAdmin(isUserAdmin);

      if (!isUserAdmin) {
        // User authenticated but not in admin_users
        const unauthMsg = 'You are signed in, but you are not authorized as an admin.';
        setAuthError(unauthMsg);
        return { success: false, error: unauthMsg };
      }

      setAuthError(null);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsAuthChecking(false);
    }
  };

  // Sign Out (manual only - do not sign out automatically)
  const signOut = async () => {
    setIsAuthChecking(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setAuthError(null);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsAuthChecking(false);
    }
  };

  // Demo fallback for preview testing when live credentials are being pasted
  const demoLoginAsAdmin = () => {
    const demoUser = {
      id: 'demo-admin-uuid-00000000',
      email: 'planner@etoilestudio.com',
      app_metadata: {},
      user_metadata: { name: 'Étoile Lead Planner' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;

    setUser(demoUser);
    setIsAdmin(true);
    setAuthError(null);
    setIsAuthChecking(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isAuthChecking,
        authError,
        isConfigured: isSupabaseConfigured,
        signIn,
        signOut,
        checkAdminStatus,
        demoLoginAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
