import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { getUserProfile, createFallbackProfile, normalizeAuthError } from '../services/authService'
import type { UserProfile } from '../types/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  isConfigured: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const configured = isSupabaseConfigured()

  const loadProfile = async (currentUser: User) => {
    let p = await getUserProfile(currentUser.id)
    if (!p) {
      // Fallback profile if trigger hasn't fired yet
      const fallbackName =
        (currentUser.user_metadata?.full_name as string) ||
        currentUser.email?.split('@')[0] ||
        'Staff Member'
      p = await createFallbackProfile(currentUser.id, fallbackName, 'counsellor')
    }
    setProfile(p)
  }

  useEffect(() => {
    if (!configured) {
      setIsLoading(false)
      return
    }

    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.user) {
        loadProfile(currentSession.user).finally(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    })

    // 2. Auth state subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession?.user) {
        await loadProfile(newSession.user)
      } else {
        setProfile(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [configured])

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!configured) {
      return { error: 'Supabase credentials are not configured in .env' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: normalizeAuthError(error) }
      }

      if (data.user) {
        await loadProfile(data.user)
      }

      return { error: null }
    } catch (err) {
      return { error: normalizeAuthError(err) }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
  ): Promise<{ error: string | null }> => {
    if (!configured) {
      return { error: 'Supabase credentials are not configured in .env' }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return { error: normalizeAuthError(error) }
      }

      if (data.user) {
        await loadProfile(data.user)
      }

      return { error: null }
    } catch (err) {
      return { error: normalizeAuthError(err) }
    }
  }

  const signOut = async (): Promise<void> => {
    if (configured) {
      try {
        await supabase.auth.signOut()
      } catch (err) {
        console.warn('Sign out error:', err)
      }
    }
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      await loadProfile(user)
    }
  }

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      isLoading,
      isConfigured: configured,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [user, session, profile, isLoading, configured],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
