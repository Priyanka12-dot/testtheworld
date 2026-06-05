// src/components/AuthModal.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../redux/hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const EyeIcon = ({ open }) => open ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, loading, error, isLoggedIn, clearError } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [localError, setLocalError] = useState('')

  // Close on successful login
  useEffect(() => {
    if (isLoggedIn && isOpen) onClose()
  }, [isLoggedIn, isOpen, onClose])

  // Clear errors when switching modes
  useEffect(() => {
    clearError()
    setLocalError('')
    setForm({ username: '', email: '', password: '' })
  }, [mode])

  // Trap focus & close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setLocalError('')
    clearError()
  }

  const validate = () => {
    if (mode === 'register') {
      if (!form.username.trim()) return 'Username is required.'
      if (form.username.length < 3)  return 'Username must be at least 3 characters.'
    }
    if (!form.email.trim())    return 'Email is required.'
    if (!form.password)        return 'Password is required.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErr = validate()
    if (validationErr) { setLocalError(validationErr); return }

    const action = mode === 'login'
      ? login({ email: form.email, password: form.password })
      : register({ username: form.username, email: form.email, password: form.password })

    await action
  }

  const displayError = localError || error

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            style={{
              background: 'white',
              borderRadius: 20,
              padding: 32,
              width: '100%',
              maxWidth: 420,
              boxShadow: 'var(--shadow-modal)',
              position: 'relative',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--color-cream)', border: 'none',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-ink-muted)',
              }}
            >
              <CloseIcon />
            </button>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌍</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26,
                fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 4px' }}>
                {mode === 'login' ? 'Welcome back' : 'Join the journey'}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13,
                color: 'var(--color-ink-faint)', margin: 0 }}>
                {mode === 'login'
                  ? 'Sign in to save recipes and build your cookbook'
                  : 'Create an account to start cooking the world'}
              </p>
            </div>

            {/* Tab switch */}
            <div style={{ display: 'flex', background: 'var(--color-cream)',
              borderRadius: 10, padding: 3, marginBottom: 20 }}>
              {['login', 'register'].map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  flex: 1, padding: '8px 0',
                  borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                  background: mode === m ? 'white' : 'transparent',
                  color: mode === m ? 'var(--color-ink)' : 'var(--color-ink-faint)',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize',
                }}>
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {/* Error */}
            <AnimatePresence>
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: 'rgba(196,89,58,0.08)',
                    border: '1px solid rgba(196,89,58,0.25)',
                    borderRadius: 8, padding: '10px 12px', marginBottom: 16,
                    fontFamily: 'var(--font-body)', fontSize: 13,
                    color: 'var(--color-accent)',
                  }}
                >
                  ⚠️ {displayError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <AnimatePresence>
                {mode === 'register' && (
                  <motion.div
                    key="username"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label style={{ fontFamily: 'var(--font-body)', fontSize: 12,
                      fontWeight: 600, color: 'var(--color-ink-muted)',
                      display: 'block', marginBottom: 4 }}>
                      Username
                    </label>
                    <input
                      name="username"
                      type="text"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="your_username"
                      className="input-field"
                      autoComplete="username"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: 12,
                  fontWeight: 600, color: 'var(--color-ink-muted)',
                  display: 'block', marginBottom: 4 }}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field"
                  autoComplete="email"
                />
              </div>

              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: 12,
                  fontWeight: 600, color: 'var(--color-ink-muted)',
                  display: 'block', marginBottom: 4 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="input-field"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--color-ink-faint)', display: 'flex',
                    }}
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: 4, padding: '13px 0' }}
              >
                {loading
                  ? <><LoadingSpinner size={16} color="white" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                  : mode === 'login' ? 'Sign In' : 'Create Account'
                }
              </button>
            </form>

            {/* Switch mode link */}
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)',
              fontSize: 13, color: 'var(--color-ink-faint)', marginTop: 16, marginBottom: 0 }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                style={{ background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-forest)', fontWeight: 600, fontSize: 13,
                  fontFamily: 'var(--font-body)', padding: 0 }}>
                {mode === 'login' ? 'Register' : 'Sign in'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}