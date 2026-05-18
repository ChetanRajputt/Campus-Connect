'use client';

// context/AuthContext.tsx
// यह context authentication state को manage करता है
// This context manages authentication state for the entire app

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // User profile doesn't exist, create one
        console.log('User profile not found, creating new one...');
        
        // Get email from auth user
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser?.user?.email) {
          const { error: insertError } = await supabase.from('users').insert({
            id: userId,
            email: authUser.user.email,
            full_name: authUser.user.user_metadata?.full_name || 'User',
            bio: '',
            avatar_url: null,
            roll_number: '',
            college: '',
            department: '',
            is_admin: false,
          });

          if (insertError) {
            console.error('Error creating user profile:', insertError);
            return;
          }

          // Fetch the newly created profile
          const { data: newUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

          if (fetchError) throw fetchError;
          setUser(newUser);
          setIsAdmin(newUser?.is_admin || false);
        }
      } else if (error) {
        throw error;
      } else {
        setUser(data);
        setIsAdmin(data?.is_admin || false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Step 1: Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned from signup');
      }

      // Supabase returns a fake user object with an empty identities array if the user already exists
      // and email enumeration protection is enabled.
      if (data.user.identities && data.user.identities.length === 0) {
        throw new Error('User already registered');
      }

      // Step 2: Wait a moment for auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Create user profile in users table
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        bio: '',
        avatar_url: null,
        roll_number: '',
        college: '',
        department: '',
        is_admin: false,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Failed to create user profile: ${profileError.message}`);
      }

      // Step 4: Fetch and set user data
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (fetchError) throw fetchError;
      setUser(userData);
      setIsAdmin(userData?.is_admin || false);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
