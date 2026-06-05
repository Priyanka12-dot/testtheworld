// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Globe from '../components/Globe'
import MealSelector from '../components/MealSelector'
import RecipeCard from '../components/RecipeCard'
import RecentlySpun from '../components/RecentlySpun'
import ErrorAlert from '../components/ErrorAlert'
import LoadingSpinner from '../components/LoadingSpinner'
import ProfileDropdown from '../components/ProfileDropdown'
import useFetchRecipe from '../hooks/useFetchRecipe'
import { COUNTRIES, REGIONS, getFlagByName } from '../utils/countries'

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const PlaneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2c-.5.1-.9.5-.9 1v.1c0 .4.2.8.6 1L5 10l-2 4 4-2 1.5 3.5c.1.4.5.6.9.6h.1c.5 0 .9-.4 1-.9z"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
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

const EXPLORE_IMAGES = [
  { emoji: '🍜', label: 'Noodles',   country: 'Japan'   },
  { emoji: '🥘', label: 'Tagine',    country: 'Morocco' },
  { emoji: '🥟', label: 'Dumplings', country: 'China'   },
]

export default function Home({ onAuthOpen }) {
  const {
    currentRecipe, selectedCountry, selectedMealType,
    isSpinning, loading, error,
    spinGlobe, getRecipe, selectCountry, selectMealType,
    loadRecentlySpun, clearRecipeError,
  } = useFetchRecipe()

  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [regionFilter, setRegionFilter]   = useState('All')

  useEffect(() => { loadRecentlySpun() }, [])

  useEffect(() => {
    const handler = () => setShowCountryDropdown(false)
    if (showCountryDropdown) setTimeout(() => document.addEventListener('click', handler), 50)
    return () => document.removeEventListener('click', handler)
  }, [showCountryDropdown])

  const filteredCountries = COUNTRIES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(countrySearch.toLowerCase())
    const matchRegion = regionFilter === 'All' || c.region === regionFilter
    return matchSearch && matchRegion
  })

  const handleCountrySelect = (country) => {
    selectCountry(country.name)
    setShowCountryDropdown(false)
    setCountrySearch('')
  }

  const handleSpin      = async () => { await spinGlobe() }
  const handleGetRecipe = () => { if (selectedCountry) getRecipe(selectedCountry, selectedMealType) }
  const selectedFlag    = selectedCountry ? getFlagByName(selectedCountry) : null

  return (
    <div style={{ padding: '24px 28px 40px', maxWidth: 1100, margin: '0 auto' }}>

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}>

        {/* Row 1: right-aligned controls */}
        <div style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'flex-end', gap: 10, marginBottom: 20 }}>

          {/* Country selector */}
          <div style={{ position: 'relative', flex: '0 1 300px', minWidth: 200 }}
            onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowCountryDropdown(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 14px', background: 'white',
                border: '1.5px solid var(--color-parchment)',
                borderRadius: 10, cursor: 'pointer', width: '100%',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                color: selectedCountry ? 'var(--color-ink)' : 'var(--color-ink-faint)',
                boxShadow: 'var(--shadow-card)', transition: 'border-color 0.2s ease',
              }}
            >
              <GlobeIcon />
              <span style={{ flex: 1, textAlign: 'left' }}>
                {selectedCountry ? <>{selectedFlag} {selectedCountry}</> : 'Or select a country'}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 11,
                color: 'var(--color-ink-faint)', borderLeft: '1px solid var(--color-cream-dark)',
                paddingLeft: 8, whiteSpace: 'nowrap' }}>
                Select country
              </span>
              <ChevronIcon />
            </button>

            <AnimatePresence>
              {showCountryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    width: 280, background: 'white',
                    borderRadius: 14, boxShadow: 'var(--shadow-modal)',
                    border: '1px solid rgba(212,197,169,0.4)',
                    zIndex: 50, overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-cream-dark)' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 10, top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--color-ink-faint)' }}>
                        <SearchIcon />
                      </div>
                      <input autoFocus value={countrySearch}
                        onChange={e => setCountrySearch(e.target.value)}
                        placeholder="Search countries…"
                        className="input-field" style={{ paddingLeft: 32, fontSize: 13 }} />
                    </div>
                  </div>
                  <div style={{ padding: '8px 12px', display: 'flex', gap: 4, flexWrap: 'wrap',
                    borderBottom: '1px solid var(--color-cream-dark)' }}>
                    {['All', ...REGIONS].map(r => (
                      <button key={r} onClick={() => setRegionFilter(r)} style={{
                        padding: '2px 8px', borderRadius: 99, border: 'none', cursor: 'pointer',
                        fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500,
                        background: regionFilter === r ? 'var(--color-forest)' : 'var(--color-cream-dark)',
                        color: regionFilter === r ? 'white' : 'var(--color-ink-muted)',
                        transition: 'all 0.15s ease',
                      }}>{r}</button>
                    ))}
                  </div>
                  <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                    {filteredCountries.length > 0 ? filteredCountries.map(c => (
                      <button key={c.name} onClick={() => handleCountrySelect(c)} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 14px', width: '100%',
                        background: selectedCountry === c.name ? 'rgba(61,90,62,0.08)' : 'none',
                        border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontSize: 13,
                        color: 'var(--color-ink)', textAlign: 'left',
                        transition: 'background 0.15s ease',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-cream)'}
                        onMouseLeave={e => e.currentTarget.style.background =
                          selectedCountry === c.name ? 'rgba(61,90,62,0.08)' : 'none'}
                      >
                        <span style={{ fontSize: 16 }}>{c.flag}</span>
                        <span>{c.name}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 10,
                          color: 'var(--color-ink-faint)' }}>{c.region}</span>
                      </button>
                    )) : (
                      <p style={{ padding: '16px', textAlign: 'center', fontSize: 13,
                        color: 'var(--color-ink-faint)', fontFamily: 'var(--font-body)' }}>
                        No countries found
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sun icon */}
          <motion.button
            whileHover={{ rotate: 30, scale: 1.1 }} whileTap={{ scale: 0.9 }}
            title="Toggle theme (coming soon)"
            style={{ width: 36, height: 36, borderRadius: '50%',
              background: 'white', border: '1.5px solid var(--color-parchment)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: 'var(--shadow-card)',
              color: 'var(--color-bronze)', flexShrink: 0 }}
          >
            <SunIcon />
          </motion.button>

          {/* Profile dropdown */}
          <ProfileDropdown onAuthOpen={onAuthOpen} />
        </div>

        {/* Row 2: hero text */}
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 5vw, 48px)',
            fontWeight: 700, color: 'var(--color-ink)', margin: 0, lineHeight: 1.1 }}>
            Spin the Globe,
          </h1>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 5vw, 48px)',
            fontWeight: 700, color: 'var(--color-forest)', margin: 0, lineHeight: 1.1 }}>
            Cook the World.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--color-ink-muted)', marginTop: 10, maxWidth: 420 }}>
            Discover authentic recipes from around the world and cook something extraordinary.
          </p>
        </div>
      </motion.div>

      {/* ── Main grid ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 340px)', gap: 20, alignItems: 'start' }}
        className="home-grid">

        {/* ── Left column ──────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Globe + controls */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'white', borderRadius: 20, boxShadow: 'var(--shadow-card)',
              border: '1px solid rgba(212,197,169,0.3)', padding: 24,
              display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24,
              alignItems: 'center', position: 'relative', overflow: 'hidden',
            }} className="globe-card">

            {/* Mountain bg */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
              opacity: 0.04, pointerEvents: 'none' }}>
              <svg viewBox="0 0 600 120" preserveAspectRatio="none" style={{ display: 'block' }}>
                <path d="M0 120 L150 40 L280 90 L400 20 L520 70 L600 30 L600 120 Z"
                  fill="var(--color-forest)" />
              </svg>
            </div>

            {/* Globe */}
            <div style={{ width: 'clamp(180px, 30vw, 280px)' }}>
              <Globe selectedCountry={selectedCountry} isSpinning={isSpinning} />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <motion.button className="btn-primary" onClick={handleSpin}
                  disabled={isSpinning || loading}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ fontSize: 15, padding: '13px 24px', gap: 8 }}>
                  {isSpinning
                    ? <><LoadingSpinner size={16} color="white" /> Spinning…</>
                    : <><GlobeIcon /> Spin the Globe</>}
                </motion.button>

                {selectedCountry && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                    <span style={{ fontSize: 18 }}>{selectedFlag}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 18,
                      fontWeight: 600, color: 'var(--color-ink)' }}>{selectedCountry}</span>
                    <motion.span animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}>
                      <PlaneIcon />
                    </motion.span>
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {selectedCountry && !loading && (
                  <motion.button initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="btn-secondary" onClick={handleGetRecipe}
                    style={{ fontSize: 13, alignSelf: 'flex-start' }}>
                    Get {selectedMealType} recipe →
                  </motion.button>
                )}
              </AnimatePresence>

              {error && (
                <ErrorAlert message={error} onDismiss={clearRecipeError}
                  onRetry={selectedCountry ? handleGetRecipe : undefined} />
              )}
            </div>
          </motion.div>

          {/* Meal selector */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}>
            <MealSelector selected={selectedMealType} onChange={selectMealType} />
          </motion.div>

          {/* Recently spun */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <RecentlySpun />
          </motion.div>

          {/* Explore teaser */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ background: 'white', borderRadius: 20, boxShadow: 'var(--shadow-card)',
              border: '1px solid rgba(212,197,169,0.3)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 14 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 18,
                  fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>
                  Explore. Cook. Share.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12,
                  color: 'var(--color-ink-faint)', margin: '2px 0 0' }}>
                  Save your favourite recipes and build your global cookbook.
                </p>
              </div>
              <button className="btn-secondary" onClick={onAuthOpen}
                style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                Explore Recipes →
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {EXPLORE_IMAGES.map((img, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03, y: -2 }}
                  onClick={() => { selectCountry(img.country); getRecipe(img.country, selectedMealType) }}
                  style={{ aspectRatio: '1', borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--color-forest) 0%, var(--color-forest-dark) 100%)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', gap: 4 }}>
                  <span style={{ fontSize: 28 }}>{img.emoji}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600,
                    color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em',
                    textTransform: 'uppercase' }}>{img.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right column: Recipe card ────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }} style={{ position: 'sticky', top: 24 }}>
          <RecipeCard recipe={currentRecipe} loading={loading} onSave={onAuthOpen} />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .home-grid  { grid-template-columns: 1fr !important; }
          .globe-card { grid-template-columns: 1fr !important; text-align: center; }
        }
      `}</style>
    </div>
  )
}