// src/components/Navigation.jsx
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../redux/hooks/useAuth'

// ── Icons ─────────────────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
  </svg>
)
const ChefIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
    <line x1="6" y1="17" x2="18" y2="17"/>
  </svg>
)
const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const NAV_ITEMS = [
  { path: '/',          label: 'Home',           Icon: HomeIcon,  public: true  },
  { path: '/spin',      label: 'Spin the Globe', Icon: GlobeIcon, public: true  },
  { path: '/explore',   label: 'Explore Recipes',Icon: BookIcon,  public: true  },
  { path: '/cookbook',  label: 'My Cookbook',    Icon: ChefIcon,  public: false },
  { path: '/favorites', label: 'Favorites',      Icon: HeartIcon, public: false },
  { path: '/about',     label: 'About',          Icon: InfoIcon,  public: true  },
]

export default function Navigation({ onAuthOpen }) {
  const { user, isLoggedIn, isGuest, logout } = useAuth()
  const location = useLocation()

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <aside
        className="sidebar"
        style={{
          background: 'white',
          borderRight: '1px solid rgba(212,197,169,0.4)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 14px',
          position: 'sticky',
          top: 0,
          height: '100dvh',
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <NavLink
          to="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, padding: '0 4px' }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            🌍
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
              color: 'var(--color-ink)', margin: 0, lineHeight: 1.2 }}>
              Taste the World
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--color-ink-faint)',
              margin: 0, letterSpacing: '0.02em' }}>
              One recipe. One culture.
            </p>
          </div>
        </NavLink>

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {NAV_ITEMS.map(({ path, label, Icon, public: isPublic }) => {
            const isLocked = !isPublic && !isLoggedIn && !isGuest
            const isActive = location.pathname === path

            if (isLocked) {
              return (
                <button
                  key={path}
                  className="nav-item"
                  onClick={onAuthOpen}
                  style={{ opacity: 0.55, position: 'relative' }}
                >
                  <Icon />
                  <span>{label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10 }}>🔒</span>
                </button>
              )
            }

            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                <Icon />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      marginLeft: 'auto', width: 5, height: 5,
                      borderRadius: '50%', background: 'rgba(255,255,255,0.7)',
                    }}
                  />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--color-cream-dark)' }}>
          {isLoggedIn ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 4px', marginBottom: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--color-forest)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 600,
                }}>
                  {user?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                    color: 'var(--color-ink)', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.username}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 10,
                    color: 'var(--color-ink-faint)', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.email}
                  </p>
                </div>
              </div>
              <button className="nav-item" onClick={logout}
                style={{ color: 'var(--color-accent)', width: '100%' }}>
                <LogoutIcon />
                <span>Log out</span>
              </button>
            </>
          ) : isGuest ? (
            <div style={{
              background: 'rgba(61,90,62,0.07)',
              border: '1px solid rgba(61,90,62,0.18)',
              borderRadius: 10, padding: '10px 12px',
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11,
                color: 'var(--color-ink-muted)', margin: '0 0 8px', lineHeight: 1.4 }}>
                👋 Browsing as <strong>Guest</strong><br/>Sign in to save recipes &amp; favourites
              </p>
              <button className="btn-primary" onClick={onAuthOpen}
                style={{ width: '100%', fontSize: 12, padding: '8px 12px' }}>
                <UserIcon />
                Sign In / Register
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={onAuthOpen}
              style={{ width: '100%', fontSize: 13 }}>
              <UserIcon />
              Sign in
            </button>
          )}

          {/* Tagline */}
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 11,
            color: 'var(--color-ink-faint)',
            textAlign: 'center',
            marginTop: 16,
            lineHeight: 1.5,
          }}>
            "Food is a passport<br/>to the heart of a culture."
          </p>
        </div>
      </aside>

      {/* ── Mobile bottom nav ───────────────────────────────────────── */}
      <nav
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderTop: '1px solid rgba(212,197,169,0.4)',
          padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
          zIndex: 40,
        }}
        className="mobile-nav"
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {[
            { path: '/', Icon: HomeIcon, label: 'Home' },
            { path: '/spin', Icon: GlobeIcon, label: 'Spin' },
            { path: '/cookbook', Icon: ChefIcon, label: 'Cookbook' },
            { path: '/favorites', Icon: HeartIcon, label: 'Favorites' },
            { path: '/about', Icon: InfoIcon, label: 'About' },
          ].map(({ path, Icon, label }) => {
            const isActive = location.pathname === path
            return (
              <NavLink
                key={path}
                to={path}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 3, padding: '4px 8px',
                  color: isActive ? 'var(--color-forest)' : 'var(--color-ink-faint)',
                  minWidth: 48 }}
                onClick={(!isLoggedIn && ['/cookbook', '/favorites'].includes(path))
                  ? (e) => { e.preventDefault(); onAuthOpen?.() }
                  : undefined}
              >
                <Icon />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 500 }}>
                  {label}
                </span>
                {isActive && (
                  <motion.div layoutId="mobile-nav-dot"
                    style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-forest)' }}
                  />
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-nav { display: block !important; }
        }
      `}</style>
    </>
  )
}