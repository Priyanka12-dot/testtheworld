// src/components/ProfileDropdown.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import useAuth from '../redux/hooks/useAuth'

// ── Icons ──────────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
  </svg>
)
const HeartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

export default function ProfileDropdown({ onAuthOpen }) {
  const { user, isLoggedIn, logout, savedRecipes } = useAuth()
  const [open, setOpen] = useState(false)
  const ref             = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const favCount = savedRecipes?.filter(r => r.isFavorite).length || 0
  const initial  = user?.username?.[0]?.toUpperCase() || '?'

  const handleLogout = () => {
    setOpen(false)
    logout()
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* ── Avatar button ──────────────────────────────────────────── */}
      <motion.button
        onClick={() => isLoggedIn ? setOpen(v => !v) : onAuthOpen?.()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isLoggedIn ? user?.username : 'Sign in'}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: open
            ? '2px solid var(--color-forest)'
            : '2px solid var(--color-parchment)',
          background: isLoggedIn ? 'var(--color-forest)' : 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: open
            ? '0 0 0 3px rgba(61,90,62,0.18)'
            : 'var(--shadow-card)',
          color: isLoggedIn ? 'white' : 'var(--color-ink-muted)',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 700,
          position: 'relative',
        }}
      >
        {isLoggedIn ? initial : <UserIcon />}

        {/* Online dot */}
        {isLoggedIn && (
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 9, height: 9, borderRadius: '50%',
            background: '#3D7A4A',
            border: '2px solid white',
          }} />
        )}
      </motion.button>

      {/* ── Dropdown panel ─────────────────────────────────────────── */}
      <AnimatePresence>
        {open && isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: -6 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{   opacity: 0, scale: 0.93, y: -6  }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: 256,
              background: 'white',
              borderRadius: 16,
              boxShadow: '0 8px 40px rgba(30,30,20,0.18), 0 0 0 1px rgba(212,197,169,0.35)',
              overflow: 'hidden',
              zIndex: 100,
            }}
          >
            {/* ── User info header ─────────────────────────────────── */}
            <div style={{
              padding: '16px 16px 12px',
              background: 'linear-gradient(135deg, var(--color-forest) 0%, var(--color-forest-dark) 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Decorative circle */}
              <div style={{ position: 'absolute', top: -20, right: -20,
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 18, fontWeight: 700, color: 'white',
                  flexShrink: 0,
                }}>
                  {initial}
                </div>

                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                    color: 'white', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {user?.username}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 11,
                    color: 'rgba(255,255,255,0.65)', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div style={{
                display: 'flex', gap: 0, marginTop: 12,
                background: 'rgba(0,0,0,0.15)', borderRadius: 8, overflow: 'hidden',
              }}>
                {[
                  { label: 'Saved',     value: savedRecipes?.length || 0 },
                  { label: 'Favorites', value: favCount                   },
                ].map((s, i) => (
                  <div key={i} style={{
                    flex: 1, padding: '6px 0', textAlign: 'center',
                    borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                  }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
                      color: 'white', margin: 0 }}>{s.value}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 9,
                      color: 'rgba(255,255,255,0.55)', margin: 0,
                      textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Nav links ─────────────────────────────────────────── */}
            <div style={{ padding: '8px 8px' }}>
              {[
                { to: '/',          icon: <GlobeIcon />, label: 'Spin the Globe'  },
                { to: '/cookbook',  icon: <BookIcon />,  label: 'My Cookbook'     },
                { to: '/favorites', icon: <HeartIcon />, label: 'Favorites'       },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  style={{ textDecoration: 'none' }}
                >
                  <motion.div
                    whileHover={{ x: 3, backgroundColor: 'var(--color-cream)' }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 10px', borderRadius: 8,
                      color: 'var(--color-ink-muted)',
                      fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <span style={{ color: 'var(--color-forest)', display: 'flex' }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* ── Divider ───────────────────────────────────────────── */}
            <div style={{ height: 1, background: 'var(--color-cream-dark)', margin: '0 8px' }} />

            {/* ── Member since ──────────────────────────────────────── */}
            <div style={{ padding: '8px 18px 4px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10,
                color: 'var(--color-ink-faint)', margin: 0 }}>
                Member since {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' })
                  : 'today'}
              </p>
            </div>

            {/* ── Logout ────────────────────────────────────────────── */}
            <div style={{ padding: '4px 8px 8px' }}>
              <motion.button
                onClick={handleLogout}
                whileHover={{ x: 3, backgroundColor: 'rgba(196,89,58,0.07)' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 8, width: '100%',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-accent)',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                  transition: 'background 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <LogoutIcon />
                Log out
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}