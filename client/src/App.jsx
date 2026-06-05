// src/App.jsx
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Provider } from 'react-redux'
import store from './redux/store'

import Navigation from './components/Navigation'
import AuthModal  from './components/AuthModal'
import Home       from './pages/Home'
import Login      from './pages/Login'
import Signup     from './pages/Signup'
import Cookbook   from './pages/Cookbook'
import Favorites  from './pages/Favorites'
import About      from './pages/About'

import useAuth from './redux/hooks/useAuth'
import { fetchCurrentUser } from './redux/slices/authSlice'
import { useDispatch } from 'react-redux'

// ── Pages that show the sidebar ───────────────────────────────────────────────
const SIDEBAR_ROUTES = ['/', '/spin', '/explore', '/cookbook', '/favorites', '/about']

// ── Guard: requires login/guest access, else → /login ────────────────────────
function RequireAccess({ children }) {
  const { hasAccess } = useAuth()
  if (!hasAccess) return <Navigate to="/login" replace />
  return children
}

// ── Guard: requires full login (not guest) ────────────────────────────────────
function RequireAuth({ children, onAuthOpen }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) {
    onAuthOpen()
    return <Navigate to="/" replace />
  }
  return children
}

// ── Guard: already has access → skip login/signup screens ────────────────────
function RedirectIfAccess({ children }) {
  const { hasAccess } = useAuth()
  if (hasAccess) return <Navigate to="/" replace />
  return children
}

// ── Page transition ───────────────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 8  },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18 } },
}

function AppContent() {
  const [authOpen, setAuthOpen] = useState(false)
  const { hasAccess, token }    = useAuth()
  const dispatch                = useDispatch()
  const location                = useLocation()

  const showSidebar = SIDEBAR_ROUTES.includes(location.pathname)

  
  useEffect(() => {
    if (token) dispatch(fetchCurrentUser())
  }, [])

  return (
    <div className="main-layout">
      {/* Sidebar — only on main app pages */}
      {showSidebar && <Navigation onAuthOpen={() => setAuthOpen(true)} />}

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ minHeight: '100dvh' }}
          >
            <Routes location={location} key={location.pathname}>

              {/* ── Auth pages: redirect away if already logged in/guest ── */}
              <Route path="/login"
                element={
                  <RedirectIfAccess>
                    <Login />
                  </RedirectIfAccess>
                }
              />
              <Route path="/signup"
                element={
                  <RedirectIfAccess>
                    <Signup />
                  </RedirectIfAccess>
                }
              />

              {/* ── Main app pages: require login OR guest access ───────── */}
              <Route path="/"
                element={
                  <RequireAccess>
                    <Home onAuthOpen={() => setAuthOpen(true)} />
                  </RequireAccess>
                }
              />
              <Route path="/spin"
                element={
                  <RequireAccess>
                    <Home onAuthOpen={() => setAuthOpen(true)} />
                  </RequireAccess>
                }
              />
              <Route path="/explore"
                element={
                  <RequireAccess>
                    <Home onAuthOpen={() => setAuthOpen(true)} />
                  </RequireAccess>
                }
              />
              <Route path="/about"
                element={
                  <RequireAccess>
                    <About />
                  </RequireAccess>
                }
              />

              {/* ── Protected pages: require full account ───────────────── */}
              <Route path="/cookbook"
                element={
                  <RequireAuth onAuthOpen={() => setAuthOpen(true)}>
                    <Cookbook />
                  </RequireAuth>
                }
              />
              <Route path="/favorites"
                element={
                  <RequireAuth onAuthOpen={() => setAuthOpen(true)}>
                    <Favorites />
                  </RequireAuth>
                }
              />

              {/* ── Fallback ─────────────────────────────────────────────── */}
              <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Inline auth modal (triggered from inside the app) */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}