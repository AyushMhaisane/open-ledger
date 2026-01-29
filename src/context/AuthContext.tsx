import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Define the shape of our Profile (from DB)
type Profile = {
  id: string;
  role: 'owner' | 'tenant' | 'admin';
  full_name: string | null;
};

// Define what data we share with the app
type AuthContextType = {
  user: User | null;       // The raw Supabase Auth user
  profile: Profile | null; // The custom data (Role, Name)
  loading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isTenant: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on load
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Auth Check Error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 2. Listen for login/logout events (Magic Link clicks trigger this)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Only fetch profile if we don't have it yet or user changed
        if (!profile || profile.id !== session.user.id) {
          await fetchProfile(session.user.id);
        }
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Helper: Fetch Role from 'profiles' table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    isOwner: profile?.role === 'owner',
    isTenant: profile?.role === 'tenant',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom Hook to use this easily in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};