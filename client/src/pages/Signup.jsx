// src/pages/Signup.jsx
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

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
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

// ── Password strength checker ──────────────────────────────────────────────────
const getStrength = (pw) => {
  let score = 0
  if (pw.length >= 6)                     score++
  if (pw.length >= 10)                    score++
  if (/[A-Z]/.test(pw))                   score++
  if (/[0-9]/.test(pw))                   score++
  if (/[^A-Za-z0-9]/.test(pw))           score++
  return score
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
const STRENGTH_COLORS = ['', '#C4593A', '#E8A838', '#B8860B', '#3D7A4A', '#2C5F35']

// ── Floating food decorations ──────────────────────────────────────────────────
const FOOD_ITEMS = [
  { emoji: '🍜', x: '8%',  y: '12%', delay: 0,    dur: 3.2 },
  { emoji: '🥘', x: '88%', y: '8%',  delay: 0.5,  dur: 2.8 },
  { emoji: '🌮', x: '5%',  y: '62%', delay: 1.0,  dur: 3.5 },
  { emoji: '🍣', x: '91%', y: '55%', delay: 0.3,  dur: 3.0 },
  { emoji: '🥗', x: '12%', y: '85%', delay: 0.8,  dur: 2.6 },
  { emoji: '🍛', x: '84%', y: '80%', delay: 1.2,  dur: 3.3 },
  { emoji: '🥙', x: '50%', y: '5%',  delay: 0.6,  dur: 2.9 },
  { emoji: '🍱', x: '92%', y: '30%', delay: 1.5,  dur: 3.1 },
]

// ── Perks list ─────────────────────────────────────────────────────────────────
const PERKS = [
  'Spin the globe & discover 60+ cuisines',
  'Save unlimited recipes to your cookbook',
  'Mark your all-time favourites',
  'AI-powered fallback for rare dishes',
]

export default function Signup() {
  const navigate = useNavigate()
  const { register, loading, error, isLoggedIn, hasAccess, clearError } = useAuth()

  const [form, setForm]       = useState({ username: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw]   = useState(false)
  const [showCf, setShowCf]   = useState(false)
  const [localErr, setLocalErr] = useState('')
  const [agreed, setAgreed]   = useState(false)

  // Already logged in → go home
  useEffect(() => {
    if (hasAccess) navigate('/', { replace: true })
  }, [isLoggedIn, navigate])

  useEffect(() => {
    clearError()
    return () => clearError()
  }, [])

  const pwStrength  = getStrength(form.password)
  const pwsMatch    = form.password && form.confirm && form.password === form.confirm
  const displayErr  = localErr || error

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setLocalErr('')
    clearError()
  }

  const validate = () => {
    if (!form.username.trim())     return 'Username is required.'
    if (form.username.length < 3)  return 'Username must be at least 3 characters.'
    if (!/^[a-zA-Z0-9_]+$/.test(form.username))
                                   return 'Username can only contain letters, numbers and underscores.'
    if (!form.email.trim())        return 'Email is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email address.'
    if (!form.password)            return 'Password is required.'
    if (form.password.length < 6)  return 'Password must be at least 6 characters.'
    if (form.password !== form.confirm) return 'Passwords do not match.'
    if (!agreed)                   return 'Please agree to the terms to continue.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setLocalErr(err); return }
    await register({ username: form.username, email: form.email, password: form.password })
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--color-cream)',
    }}
      className="signup-grid"
    >
      {/* ── Left panel — branding ──────────────────────────────────────── */}
      <div style={{
        background: 'var(--color-forest)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 52px',
        overflow: 'hidden',
      }}
        className="signup-left"
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80,  right: -80,  width: 280, height: 280,
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220,
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: '40%', right: -40, width: 160, height: 160,
          borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        {/* Floating food */}
        {FOOD_ITEMS.slice(0, 4).map((f, i) => (
          <motion.div key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: f.dur, delay: f.delay, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: f.x, top: f.y,
              fontSize: 28, opacity: 0.18, pointerEvents: 'none' }}
          >
            {f.emoji}
          </motion.div>
        ))}

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex',
          alignItems: 'center', gap: 10, marginBottom: 52 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            🌍
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
              color: 'white', margin: 0, lineHeight: 1.2 }}>Taste the World</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 10,
              color: 'rgba(255,255,255,0.6)', margin: 0 }}>One recipe. One culture.</p>
          </div>
        </Link>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,42px)',
            fontWeight: 700, color: 'white', margin: '0 0 14px', lineHeight: 1.15 }}>
            Your culinary<br/>passport awaits.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'rgba(255,255,255,0.75)', margin: '0 0 36px', lineHeight: 1.7 }}>
            Join thousands of home cooks exploring authentic flavours from every corner of the globe.
          </p>
        </motion.div>

        {/* Perks */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PERKS.map((perk, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div style={{ width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: 'white' }}>
                <CheckIcon />
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13,
                color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
                {perk}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom quote */}
        <div style={{ marginTop: 'auto', paddingTop: 40 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 15,
            fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            "Food is a passport to the heart of a culture."
          </p>
        </div>
      </div>

      {/* ── Right panel — form ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 28px',
        overflowY: 'auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: 440 }}
        >
          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30,
              fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 6px' }}>
              Create your account
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'var(--color-ink-faint)', margin: 0 }}>
              Already have one?{' '}
              <Link to="/login" style={{ color: 'var(--color-forest)',
                fontWeight: 600, textDecoration: 'none' }}>
                Sign in →
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
                style={{ background: 'rgba(196,89,58,0.08)',
                  border: '1px solid rgba(196,89,58,0.3)',
                  borderRadius: 10, padding: '10px 14px', marginBottom: 18,
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  color: 'var(--color-accent)' }}
              >
                ⚠️ {displayErr}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Username */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                color: 'var(--color-ink-muted)', display: 'block', marginBottom: 5 }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--color-ink-faint)',
                  pointerEvents: 'none' }}>
                  <UserIcon />
                </div>
                <input name="username" type="text" value={form.username}
                  onChange={handleChange} placeholder="your_username"
                  className="input-field" autoComplete="username"
                  style={{ paddingLeft: 36 }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                color: 'var(--color-ink-muted)', display: 'block', marginBottom: 5 }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--color-ink-faint)',
                  pointerEvents: 'none' }}>
                  <MailIcon />
                </div>
                <input name="email" type="email" value={form.email}
                  onChange={handleChange} placeholder="you@example.com"
                  className="input-field" autoComplete="email"
                  style={{ paddingLeft: 36 }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                color: 'var(--color-ink-muted)', display: 'block', marginBottom: 5 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--color-ink-faint)',
                  pointerEvents: 'none' }}>
                  <LockIcon />
                </div>
                <input name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="input-field" autoComplete="new-password"
                  style={{ paddingLeft: 36, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: 'var(--color-ink-faint)', display: 'flex' }}>
                  <EyeIcon open={showPw} />
                </button>
              </div>

              {/* Strength bar */}
              {form.password && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} style={{
                        flex: 1, height: 3, borderRadius: 99,
                        background: n <= pwStrength
                          ? STRENGTH_COLORS[pwStrength]
                          : 'var(--color-cream-dark)',
                        transition: 'background 0.3s ease',
                      }} />
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 11,
                    color: STRENGTH_COLORS[pwStrength], margin: 0, fontWeight: 500 }}>
                    {STRENGTH_LABELS[pwStrength]}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                color: 'var(--color-ink-muted)', display: 'block', marginBottom: 5 }}>
                Confirm password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--color-ink-faint)',
                  pointerEvents: 'none' }}>
                  <LockIcon />
                </div>
                <input name="confirm" type={showCf ? 'text' : 'password'}
                  value={form.confirm} onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="input-field" autoComplete="new-password"
                  style={{
                    paddingLeft: 36, paddingRight: 40,
                    borderColor: form.confirm
                      ? (pwsMatch ? 'rgba(61,122,74,0.6)' : 'rgba(196,89,58,0.5)')
                      : undefined,
                  }} />
                <button type="button" onClick={() => setShowCf(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: 'var(--color-ink-faint)', display: 'flex' }}>
                  <EyeIcon open={showCf} />
                </button>
                {form.confirm && (
                  <div style={{ position: 'absolute', right: 38, top: '50%',
                    transform: 'translateY(-50%)', fontSize: 13 }}>
                    {pwsMatch ? '✅' : '❌'}
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
              cursor: 'pointer', userSelect: 'none' }}>
              <div
                onClick={() => setAgreed(v => !v)}
                style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${agreed ? 'var(--color-forest)' : 'var(--color-parchment)'}`,
                  background: agreed ? 'var(--color-forest)' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 1, transition: 'all 0.15s ease',
                  color: 'white', cursor: 'pointer',
                }}
              >
                {agreed && <CheckIcon />}
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12,
                color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
                I agree to the{' '}
                <span style={{ color: 'var(--color-forest)', fontWeight: 600 }}>Terms of Service</span>
                {' '}and{' '}
                <span style={{ color: 'var(--color-forest)', fontWeight: 600 }}>Privacy Policy</span>
              </span>
            </label>

            {/* Submit */}
            <motion.button
              type="submit"
              className="btn-primary"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', padding: '13px 0', fontSize: 15, marginTop: 4 }}
            >
              {loading
                ? <><LoadingSpinner size={16} color="white" /> Creating account…</>
                : '🌍 Start Your Journey'}
            </motion.button>
          </form>

          {/* Social proof */}
          <div style={{ marginTop: 24, padding: '14px 16px',
            background: 'white', borderRadius: 12,
            border: '1px solid rgba(212,197,169,0.3)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {['🇯🇵', '🇲🇦', '🇮🇹', '🇹🇭'].map((f, i) => (
                <span key={i} style={{ fontSize: 18,
                  marginLeft: i > 0 ? -4 : 0 }}>{f}</span>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12,
              color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.4 }}>
              Join home cooks exploring <strong style={{ color: 'var(--color-forest)' }}>60+ cuisines</strong> worldwide
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .signup-grid { grid-template-columns: 1fr !important; }
          .signup-left { display: none !important; }
        }
      `}</style>
    </div>
  )
}