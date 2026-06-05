// src/pages/Login.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../redux/hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'

// ── Icons ──────────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) =>
  open ? (
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

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

// ── Destination cards for right panel ─────────────────────────────────────────
const DESTINATIONS = [
  { flag: '🇯🇵', name: 'Japan',   dish: 'Ramen'         },
  { flag: '🇲🇦', name: 'Morocco', dish: 'Tagine'        },
  { flag: '🇮🇹', name: 'Italy',   dish: 'Carbonara'     },
  { flag: '🇮🇳', name: 'India',   dish: 'Butter Chicken'},
  { flag: '🇲🇽', name: 'Mexico',  dish: 'Mole Poblano'  },
]

const FOODS = [
  { emoji: '🍜', x: '6%',  y: '15%', delay: 0,    dur: 3.4 },
  { emoji: '🥘', x: '90%', y: '10%', delay: 0.6,  dur: 2.9 },
  { emoji: '🍣', x: '4%',  y: '70%', delay: 1.1,  dur: 3.2 },
  { emoji: '🌮', x: '92%', y: '65%', delay: 0.3,  dur: 2.7 },
  { emoji: '🍛', x: '48%', y: '4%',  delay: 0.8,  dur: 3.0 },
  { emoji: '🥗', x: '88%', y: '85%', delay: 1.4,  dur: 3.5 },
]

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, error, isLoggedIn, isGuest, hasAccess, continueAsGuest, clearError } = useAuth()

  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPw, setShowPw]     = useState(false)
  const [localErr, setLocalErr] = useState('')
  const [focused, setFocused]   = useState('')

  // Already has access (logged in or guest) → redirect to home
  useEffect(() => {
    if (hasAccess) navigate('/', { replace: true })
  }, [hasAccess, navigate])

  useEffect(() => {
    clearError()
    return () => clearError()
  }, [])

  const displayErr = localErr || error

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setLocalErr('')
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim())  { setLocalErr('Email is required.');    return }
    if (!form.password)      { setLocalErr('Password is required.'); return }
    await login({ email: form.email, password: form.password })
  }

  const handleGuestAccess = () => {
    continueAsGuest()
    navigate('/', { replace: true })
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--color-cream)',
      }}
      className="login-grid"
    >
      {/* ── Left panel — form ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 28px',
        position: 'relative',
        overflowY: 'auto',
      }}>
        {/* Subtle floating food bg */}
        {FOODS.slice(0, 2).map((f, i) => (
          <motion.div key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: f.dur, delay: f.delay, ease: 'easeInOut' }}
            style={{ position: 'fixed', left: f.x, top: f.y,
              fontSize: 22, opacity: 0.07, pointerEvents: 'none', zIndex: 0 }}
          >
            {f.emoji}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
        >
          {/* Logo */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--color-forest)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
            }}>
              🌍
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
                color: 'var(--color-ink)', margin: 0, lineHeight: 1.2 }}>Taste the World</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10,
                color: 'var(--color-ink-faint)', margin: 0 }}>One recipe. One culture.</p>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32,
              fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 6px' }}>
              Welcome back
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'var(--color-ink-faint)', margin: 0 }}>
              New here?{' '}
              <Link to="/signup" style={{ color: 'var(--color-forest)',
                fontWeight: 600, textDecoration: 'none' }}>
                Create a free account →
              </Link>
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {displayErr && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: 'rgba(196,89,58,0.08)',
                  border: '1px solid rgba(196,89,58,0.3)',
                  borderRadius: 10, padding: '10px 14px', marginBottom: 18,
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  color: 'var(--color-accent)',
                }}
              >
                ⚠️ {displayErr}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                color: 'var(--color-ink-muted)', display: 'block', marginBottom: 5 }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  color: focused === 'email' ? 'var(--color-forest)' : 'var(--color-ink-faint)',
                  pointerEvents: 'none', transition: 'color 0.2s',
                }}>
                  <MailIcon />
                </div>
                <input
                  name="email" type="email" value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  placeholder="you@example.com"
                  className="input-field"
                  autoComplete="email"
                  style={{ paddingLeft: 36 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 5 }}>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: 12,
                  fontWeight: 600, color: 'var(--color-ink-muted)' }}>
                  Password
                </label>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11,
                  color: 'var(--color-forest)', fontWeight: 500, cursor: 'pointer' }}>
                  Forgot password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  color: focused === 'password' ? 'var(--color-forest)' : 'var(--color-ink-faint)',
                  pointerEvents: 'none', transition: 'color 0.2s',
                }}>
                  <LockIcon />
                </div>
                <input
                  name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="Your password"
                  className="input-field"
                  autoComplete="current-password"
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: 'var(--color-ink-faint)', display: 'flex',
                  }}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="btn-primary"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', padding: '13px 0', fontSize: 15, marginTop: 4 }}
            >
              {loading ? (
                <><LoadingSpinner size={16} color="white" /> Signing in…</>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8 }}>
                  Sign In <ArrowIcon />
                </span>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-cream-dark)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11,
              color: 'var(--color-ink-faint)', flexShrink: 0, letterSpacing: '0.05em' }}>
              OR
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-cream-dark)' }} />
          </div>

          {/* ── Continue as Guest ────────────────────────────────────── */}
          <motion.button
            onClick={handleGuestAccess}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '12px 0',
              background: 'white',
              borderRadius: 10,
              border: '1.5px solid var(--color-parchment)',
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
              color: 'var(--color-ink)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-card)',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: 18 }}>🌍</span>
            Continue as Guest
          </motion.button>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11,
            color: 'var(--color-ink-faint)', textAlign: 'center',
            margin: '8px 0 0', lineHeight: 1.5 }}>
            Browse recipes freely — sign in to save them
          </p>

          {/* Sign up link */}
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)',
            fontSize: 12, color: 'var(--color-ink-faint)', marginTop: 20, marginBottom: 0 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--color-forest)',
              fontWeight: 600, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── Right panel — visual ───────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--color-forest)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 52px',
          overflow: 'hidden',
        }}
        className="login-right"
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -100, left: -100, width: 320, height: 320,
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 260, height: 260,
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        {/* Floating food */}
        {FOODS.slice(2).map((f, i) => (
          <motion.div key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: f.dur, delay: f.delay, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: f.x, top: f.y,
              fontSize: 26, opacity: 0.15, pointerEvents: 'none' }}
          >
            {f.emoji}
          </motion.div>
        ))}

        {/* Content */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3vw,40px)',
            fontWeight: 700, color: 'white', margin: '0 0 10px', lineHeight: 1.15,
          }}>
            Where will you<br />cook next?
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'rgba(255,255,255,0.7)', margin: '0 0 36px', lineHeight: 1.7, maxWidth: 340,
          }}>
            Your cookbook and favourites are waiting. Sign in to pick up where you left off.
          </p>
        </motion.div>

        {/* Destination cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 340 }}>
          {DESTINATIONS.map((d, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ fontSize: 24 }}>{d.flag}</span>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                  color: 'white', margin: 0 }}>{d.name}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 11,
                  color: 'rgba(255,255,255,0.55)', margin: 0 }}>{d.dish}</p>
              </div>
              <div style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%',
                background: 'rgba(255,255,255,0.3)' }} />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: 28, marginTop: 36 }}>
          {[
            { n: '60+',  label: 'Countries' },
            { n: '∞',    label: 'Recipes'   },
            { n: '100%', label: 'Authentic' },
          ].map((s, i) => (
            <div key={i}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 26,
                fontWeight: 700, color: 'white', margin: 0 }}>{s.n}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11,
                color: 'rgba(255,255,255,0.5)', margin: 0,
                textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Quote */}
        <div style={{ marginTop: 'auto', paddingTop: 36 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 14,
            fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            "Food is a passport to the heart of a culture."
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-grid  { grid-template-columns: 1fr !important; }
          .login-right { display: none !important; }
        }
      `}</style>
    </div>
  )
}