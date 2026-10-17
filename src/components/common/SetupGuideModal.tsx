import React, { useState } from 'react'
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Database,
  Key,
} from 'lucide-react'
import {
  getSupabaseConfigStatus,
  testSupabaseConnection,
  type ConnectionTestResult,
} from '../../lib/supabaseClient'

interface SetupGuideModalProps {
  isOpen: boolean
  onClose: () => void
  onTested?: () => void
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({
  isOpen,
  onClose,
  onTested,
}) => {
  const [copied, setCopied] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null)

  if (!isOpen) return null

  const configStatus = getSupabaseConfigStatus()

  const envTemplate = `# BrightPath CRM — Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-client-anon-key`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(envTemplate)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    const result = await testSupabaseConnection()
    setTestResult(result)
    setIsTesting(false)
    if (onTested) onTested()
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Database size={20} color="var(--color-brand-600)" />
            <h2 className="modal-title">Supabase Connection Diagnostics</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick status callout */}
          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: configStatus.isConfigured ? '#ecfdf5' : '#fffbeb',
              border: `1px solid ${configStatus.isConfigured ? '#a7f3d0' : '#fde68a'}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            {configStatus.isConfigured ? (
              <CheckCircle2 size={18} color="#047857" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
            ) : (
              <AlertTriangle size={18} color="#b45309" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
            )}
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: configStatus.isConfigured ? '#047857' : '#92400e',
                  marginBottom: '0.2rem',
                }}
              >
                {configStatus.isConfigured
                  ? 'Client Environment Configured'
                  : 'Configuration Required'}
              </div>
              <p
                style={{
                  fontSize: '0.825rem',
                  color: configStatus.isConfigured ? '#065f46' : '#78350f',
                  lineHeight: 1.5,
                }}
              >
                {configStatus.isConfigured
                  ? 'Valid project URL and anonymous client key are detected in local environment.'
                  : 'Your project requires a valid Supabase URL and public anonymous key to interact with live records.'}
              </p>
            </div>
          </div>

          {/* Diagnostics checklist */}
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              Connection Parameters
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="diagnostic-step">
                <Database className="diagnostic-icon" color="var(--color-brand-600)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Project URL</span>
                    <span style={{ fontSize: '0.75rem', color: configStatus.urlConfigured ? '#16a34a' : '#d97706', fontWeight: 600 }}>
                      {configStatus.urlConfigured ? 'Valid Format' : 'Not Configured'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.15rem', wordBreak: 'break-all' }}>
                    {configStatus.urlValue}
                  </div>
                </div>
              </div>

              <div className="diagnostic-step">
                <Key className="diagnostic-icon" color="var(--color-brand-600)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Anon Client Key</span>
                    <span style={{ fontSize: '0.75rem', color: configStatus.keyConfigured ? '#16a34a' : '#d97706', fontWeight: 600 }}>
                      {configStatus.keyConfigured ? 'Valid Format' : 'Not Configured'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.15rem' }}>
                    {configStatus.maskedKey}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Box */}
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              Setup in 3 Steps
            </div>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              <li>
                Open your{' '}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--color-brand-600)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  Supabase Dashboard <ExternalLink size={12} />
                </a>{' '}
                &rarr; <strong>Project Settings &rarr; API</strong>.
              </li>
              <li>Copy <strong>Project URL</strong> and <strong>anon public</strong> key.</li>
              <li>Paste them into your root <code>.env</code> file (or Vercel Environment Variables).</li>
            </ol>
          </div>

          {/* Copyable snippet */}
          <div className="code-snippet-box">
            <span>{envTemplate.split('\n')[1]}</span>
            <button type="button" className="copy-btn" onClick={handleCopy}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Test connection result */}
          {testResult && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: testResult.success ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${testResult.success ? '#a7f3d0' : '#fecaca'}`,
                fontSize: '0.85rem',
                color: testResult.success ? '#047857' : '#b91c1c',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {testResult.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleTestConnection}
            disabled={isTesting}
          >
            <RefreshCw size={15} className={isTesting ? 'spinner' : ''} />
            <span>{isTesting ? 'Testing Handshake...' : 'Test Connection'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
