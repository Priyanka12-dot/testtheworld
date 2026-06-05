// src/pages/Favorites.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import useAuth from '../redux/hooks/useAuth'
import { toggleFavorite, removeSavedRecipe } from '../redux/slices/authSlice'
import { getFlagByName } from '../utils/countries'
import { MEAL_TYPES } from '../utils/constants'

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#C4593A" stroke="#C4593A" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

export default function Favorites() {
  const dispatch   = useDispatch()
  const { savedRecipes } = useAuth()
  const favorites  = savedRecipes.filter(r => r.isFavorite)

  const handleUnfav = (id) => {
    if (id) dispatch(toggleFavorite(id))
  }

  const handleRemove = (id) => {
    if (id) dispatch(removeSavedRecipe(id))
  }

  return (
    <div style={{ padding: '28px 28px 80px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36,
          fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 4px',
          display: 'flex', alignItems: 'center', gap: 10 }}>
          Favorites <HeartIcon />
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14,
          color: 'var(--color-ink-muted)', margin: 0 }}>
          {favorites.length} recipe{favorites.length !== 1 ? 's' : ''} you love
        </p>
      </motion.div>

      {/* Empty state */}
      {favorites.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>❤️</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24,
            color: 'var(--color-ink)', margin: '0 0 8px' }}>
            No favourites yet
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--color-ink-faint)', maxWidth: 280, margin: '0 auto' }}>
            Save recipes to your cookbook and tap the heart to add them here
          </p>
        </motion.div>
      )}

      {/* Favorites grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}>
        <AnimatePresence>
          {favorites.map((saved, i) => {
            const flag = getFlagByName(saved.country)
            const meal = MEAL_TYPES.find(m => m.id === saved.mealType)
            return (
              <motion.div key={saved._id || i}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, y: -10 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: 'white', borderRadius: 16,
                  boxShadow: 'var(--shadow-card)',
                  border: '1.5px solid rgba(196,89,58,0.15)',
                  overflow: 'hidden',
                }}
              >
                {/* Image */}
                <div style={{ height: 140, position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(135deg, #3D5A3E, #2C4030)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>
                  {saved.image
                    ? <img src={saved.image} alt={saved.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span>🍽️</span>
                  }
                  <div style={{ position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(30,20,10,0.5) 0%, transparent 60%)' }} />

                  {/* Heart badge */}
                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span className="pill" style={{
                      background: 'rgba(255,255,255,0.92)',
                      color: '#C4593A', fontSize: 11,
                    }}>
                      ❤️ Favourite
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 5 }}>
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => handleUnfav(saved._id)}
                      title="Remove from favourites"
                      style={{ width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 13 }}>
                      💔
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemove(saved._id)}
                      title="Remove from cookbook"
                      style={{ width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'var(--color-ink-muted)' }}>
                      <TrashIcon />
                    </motion.button>
                  </div>
                </div>

                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 16,
                    fontWeight: 600, color: 'var(--color-ink)',
                    margin: '0 0 8px', lineHeight: 1.3 }}>
                    {saved.title}
                  </p>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    <span className="pill" style={{ fontSize: 11 }}>
                      {flag} {saved.country}
                    </span>
                    {meal && (
                      <span className="pill green" style={{ fontSize: 11 }}>
                        {meal.icon} {meal.label}
                      </span>
                    )}
                  </div>

                  <div style={{
                    padding: '8px 10px',
                    background: 'rgba(196,89,58,0.06)',
                    borderRadius: 8,
                    borderLeft: '2px solid rgba(196,89,58,0.4)',
                  }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12,
                      color: 'var(--color-ink-faint)', margin: 0, fontStyle: 'italic' }}>
                      Saved {new Date(saved.savedAt).toLocaleDateString('en', {
                        month: 'long', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}