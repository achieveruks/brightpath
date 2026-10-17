import { supabase } from '../lib/supabaseClient'
import type { UserProfile, UserRole } from '../types/navigation'

export function normalizeAuthError(error: unknown): string {
  if (!error) return 'An unknown error occurred'
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please verify your credentials and try again.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Your email address has not been confirmed yet. Please check your inbox or disable email confirmation in Supabase Auth settings.'
  }
  if (message.includes('User already registered')) {
    return 'An account with this email address already exists. Please sign in instead.'
  }
  if (message.includes('Password should be at least')) {
    return 'Password is too short. Please provide at least 6 characters.'
  }
  if (message.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment before trying again.'
  }

  return message
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.warn('Failed to load profile for user:', error.message)
      return null
    }

    if (!data) {
      return null
    }

    return {
      id: data.id,
      full_name: data.full_name,
      role: (data.role as UserRole) || 'counsellor',
    }
  } catch (err) {
    console.warn('Exception loading profile:', err)
    return null
  }
}

export async function createFallbackProfile(
  userId: string,
  fullName: string,
  role: UserRole = 'counsellor',
): Promise<UserProfile> {
  const newProfile = {
    id: userId,
    full_name: fullName,
    role,
  }

  try {
    await supabase.from('profiles').upsert(newProfile, { onConflict: 'id' })
  } catch (err) {
    console.warn('Fallback profile creation notice:', err)
  }

  return newProfile
}
