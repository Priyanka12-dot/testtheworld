// src/components/ErrorAlert.jsx
import { motion, AnimatePresence } from 'framer-motion'

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
)

export default function ErrorAlert({ message, onDismiss, onRetry }) {
  if (!message) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.97 }}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          padding: '12px 14px',
          background: 'rgba(196,89,58,0.08)',
          border: '1px solid rgba(196,89,58,0.25)',
          borderRadius: 12,
          color: 'var(--color-accent)',
        }}
      >
        <AlertIcon />
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--color-accent)',
          margin: 0,
          flex: 1,
          lineHeight: 1.5,
        }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {onRetry && (
            <button
              onClick={onRetry}
              title="Try again"
              style={{
                border: 'none', cursor: 'pointer',
                color: 'var(--color-accent)', display: 'flex',
                alignItems: 'center', gap: 4,
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                padding: '2px 6px', borderRadius: 6,
                background: 'rgba(196,89,58,0.1)',
              }}
            >
              <RefreshIcon />
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              title="Dismiss"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-accent)', display: 'flex',
                alignItems: 'center',
              }}
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}