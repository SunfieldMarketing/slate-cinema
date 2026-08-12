import React from 'react'

/*
  Admin login-screen + nav wordmark — Phase 5 of the migration playbook.
  Genuinely new design work (no "original admin design" to preserve),
  unlike everything on the public site.
*/
export function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <img
        src="/images/logo-mark.webp"
        alt="Slate Cinema"
        style={{ width: '2rem', height: '2rem', objectFit: 'contain' }}
      />
      <span
        style={{
          fontWeight: 700,
          letterSpacing: '0.15em',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          color: 'var(--theme-text)',
        }}
      >
        Slate Cinema
      </span>
    </div>
  )
}
