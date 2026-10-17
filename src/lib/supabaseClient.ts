import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const rawUrl = importMetaEnv('VITE_SUPABASE_URL')
const rawAnonKey = importMetaEnv('VITE_SUPABASE_ANON_KEY')

function importMetaEnv(key: string): string {
  try {
    return (import.meta.env[key] || '').trim()
  } catch {
    return ''
  }
}

export interface SupabaseConfigStatus {
  isConfigured: boolean
  urlConfigured: boolean
  keyConfigured: boolean
  isPlaceholder: boolean
  urlValue: string
  maskedKey: string
  validationError?: string
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const isUrlEmpty = !rawUrl
  const isKeyEmpty = !rawAnonKey
  const isUrlPlaceholder =
    rawUrl.includes('your-project-id') || rawUrl.includes('example.com')
  const isKeyPlaceholder =
    rawAnonKey.includes('your-public-client') ||
    rawAnonKey.includes('placeholder')

  const isPlaceholder = isUrlPlaceholder || isKeyPlaceholder
  const isConfigured = !isUrlEmpty && !isKeyEmpty && !isPlaceholder

  let validationError: string | undefined
  if (isUrlEmpty) {
    validationError = 'VITE_SUPABASE_URL is missing'
  } else if (isUrlPlaceholder) {
    validationError = 'VITE_SUPABASE_URL is still set to placeholder'
  } else if (isKeyEmpty) {
    validationError = 'VITE_SUPABASE_ANON_KEY is missing'
  } else if (isKeyPlaceholder) {
    validationError = 'VITE_SUPABASE_ANON_KEY is still set to placeholder'
  } else if (!rawUrl.startsWith('https://')) {
    validationError = 'VITE_SUPABASE_URL must begin with https://'
  }

  const maskedKey = rawAnonKey
    ? `${rawAnonKey.slice(0, 10)}...${rawAnonKey.slice(-6)}`
    : 'Not configured'

  return {
    isConfigured,
    urlConfigured: !isUrlEmpty && !isUrlPlaceholder,
    keyConfigured: !isKeyEmpty && !isKeyPlaceholder,
    isPlaceholder,
    urlValue: rawUrl || 'Not configured',
    maskedKey,
    validationError,
  }
}

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfigStatus().isConfigured
}

// Fallback safe client initialization to prevent app crash when environment is pending
const fallbackUrl = 'https://placeholder-project.supabase.co'
const fallbackKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_key_not_usable'

export const supabase = createClient<Database>(
  isSupabaseConfigured() ? rawUrl : fallbackUrl,
  isSupabaseConfigured() ? rawAnonKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)

export interface ConnectionTestResult {
  success: boolean
  message: string
  latencyMs?: number
}

/**
 * Performs a lightweight health check against the configured Supabase instance.
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const status = getSupabaseConfigStatus()
  if (!status.isConfigured) {
    return {
      success: false,
      message: status.validationError || 'Supabase credentials are not fully configured.',
    }
  }

  const startTime = performance.now()
  try {
    // Attempt to read current auth session or a public endpoint
    const { error } = await supabase.auth.getSession()
    const latencyMs = Math.round(performance.now() - startTime)

    if (error) {
      return {
        success: false,
        message: `Supabase auth ping error: ${error.message}`,
        latencyMs,
      }
    }

    return {
      success: true,
      message: `Successfully connected to Supabase (${latencyMs}ms)`,
      latencyMs,
    }
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - startTime)
    const errMessage = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      message: `Connection failed: ${errMessage}`,
      latencyMs,
    }
  }
}
