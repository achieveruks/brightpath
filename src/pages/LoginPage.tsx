import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, Lock, Mail, User, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signUp, user } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If already logged in, redirect to dashboard or intended route
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name for the staff profile.')
      return
    }

    setIsSubmitting(true)

    if (mode === 'signin') {
      const res = await signIn(email.trim(), password)
      if (res.error) {
        setErrorMsg(res.error)
        setIsSubmitting(false)
      } else {
        navigate(from, { replace: true })
      }
    } else {
      const res = await signUp(email.trim(), password, fullName.trim())
      if (res.error) {
        setErrorMsg(res.error)
        setIsSubmitting(false)
      } else {
        navigate(from, { replace: true })
      }
    }
  }

  const fillDemo = (demoEmail: string, demoName: string) => {
    setEmail(demoEmail)
    setPassword('BrightPath123!')
    if (mode === 'signup') {
      setFullName(demoName)
    }
    setErrorMsg(null)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0f1d',
        backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 60%)',
        padding: '1.5rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.25rem',
          backgroundColor: '#0f172a',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          animation: 'modalIn 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              marginBottom: '0.85rem',
            }}
          >
            <GraduationCap size={26} />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
            BrightPath CRM
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Staff Admissions Portal &amp; Lead Management
          </p>
        </div>

        {/* Mode Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setErrorMsg(null)
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: mode === 'signin' ? '#ffffff' : '#94a3b8',
              backgroundColor: mode === 'signin' ? '#2563eb' : 'transparent',
              transition: 'all var(--transition-fast)',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setErrorMsg(null)
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: mode === 'signup' ? '#ffffff' : '#94a3b8',
              backgroundColor: mode === 'signup' ? '#2563eb' : 'transparent',
              transition: 'all var(--transition-fast)',
            }}
          >
            New Staff Signup
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              color: '#fca5a5',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
            role="alert"
          >
            <AlertCircle size={16} style={{ marginTop: '0.15rem', flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="full-name-input"
                style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}
              >
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                />
                <input
                  id="full-name-input"
                  type="text"
                  className="form-input"
                  style={{
                    paddingLeft: '2.4rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                  }}
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email-input"
              style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
              />
              <input
                id="email-input"
                type="email"
                autoComplete="email"
                className="form-input"
                style={{
                  paddingLeft: '2.4rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                }}
                placeholder="staff@brightpath.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password-input"
              style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
              />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="form-input"
                style={{
                  paddingLeft: '2.4rem',
                  paddingRight: '2.4rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                }}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.925rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                <span>{mode === 'signin' ? 'Authenticating...' : 'Creating Profile...'}</span>
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{mode === 'signin' ? 'Sign In to Portal' : 'Create Staff Account'}</span>
                <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        {/* Quick Demo Helper */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            <Sparkles size={12} color="#60a5fa" />
            <span>Fast Setup: Fill Credentials</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="copy-btn"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => fillDemo('counsellor@brightpath.edu', 'Priya Sharma')}
            >
              Counsellor
            </button>
            <button
              type="button"
              className="copy-btn"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => fillDemo('admin@brightpath.edu', 'Admissions Director')}
            >
              Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
