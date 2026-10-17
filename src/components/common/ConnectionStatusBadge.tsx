import React, { useState } from 'react'
import { getSupabaseConfigStatus } from '../../lib/supabaseClient'
import { SetupGuideModal } from './SetupGuideModal'

export const ConnectionStatusBadge: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [configState, setConfigState] = useState(() => getSupabaseConfigStatus())

  const refreshStatus = () => {
    setConfigState(getSupabaseConfigStatus())
  }

  const isConnected = configState.isConfigured

  return (
    <>
      <button
        type="button"
        className={`conn-badge ${isConnected ? 'connected' : 'pending'}`}
        onClick={() => setModalOpen(true)}
        title="Click to view Supabase connection diagnostics"
        aria-label={`Database status: ${isConnected ? 'Connected' : 'Setup Required'}`}
      >
        <span className="conn-dot" />
        <span>{isConnected ? 'Supabase Connected' : 'Setup Supabase'}</span>
      </button>

      <SetupGuideModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onTested={refreshStatus}
      />
    </>
  )
}
