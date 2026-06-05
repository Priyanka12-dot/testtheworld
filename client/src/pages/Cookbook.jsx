// src/pages/Cookbook.jsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import useAuth from '../redux/hooks/useAuth'
import { removeSavedRecipe, toggleFavorite } from '../redux/slices/authSlice'
import { getFlagByName } from '../utils/countries'
import { DIFFICULTY_COLORS, MEAL_TYPES } from '../utils/constants'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/api'

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
  </svg>
)
const HeartIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill={filled ? '#C4593A' : 'none'} stroke={filled ? '#C4593A' : 'currentColor'} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

function RecipeDetailModal({ savedRecipe, recipeData, onClose }) {
  const [activeTab, setActiveTab] = useState('steps')

  if (!recipeData) return null

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        style={{
          background: 'white', borderRadius: 20,
          width: '100%', maxWidth: 560,
          maxHeight: '88dvh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Hero */}
        <div style={{ position: 'relative', height: 180, flexShrink: 0 }}>
          {recipeData.image ? (
            <img src={recipeData.image} alt={recipeData.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background:
              'linear-gradient(135deg, #3D5A3E, #2C4030)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
              🍽️
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(30,20,10,0.7) 0%, transparent 55%)' }} />
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12, width: 32, height: 32,
            borderRadius: '50%', background: 'rgba(255,255,255,0.9)',
            border: 'none', cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
          <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600,
              color: 'white', margin: 0 }}>{recipeData.title}</h2>
          </div>
        </div>

        <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {recipeData.readyInMinutes && (
              <span className="pill"><ClockIcon />{recipeData.readyInMinutes} min</span>
            )}
            {recipeData.servings && (
              <span className="pill">👥 {recipeData.servings} servings</span>
            )}
            {recipeData.difficulty && (
              <span className="pill" style={{
                background: DIFFICULTY_COLORS[recipeData.difficulty]?.bg,
                color: DIFFICULTY_COLORS[recipeData.difficulty]?.text,
                textTransform: 'capitalize',
              }}>{recipeData.difficulty}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--color-cream-dark)' }}>
            {['ingredients', 'steps', 'tips'].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)} style={{ textTransform: 'capitalize' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 20px' }}>
          {activeTab === 'ingredients' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recipeData.ingredients?.map((ing, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center',
                  padding: '6px 0', borderBottom: '1px solid var(--color-cream)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--color-forest)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13 }}>
                    {ing.original || `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()}
                  </span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'steps' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recipeData.steps?.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div className="step-badge">{step.number || i + 1}</div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13,
                    color: 'var(--color-ink)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                    {step.instruction}
                  </p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'tips' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recipeData.tips?.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px',
                  background: 'rgba(61,90,62,0.06)', borderRadius: 10,
                  borderLeft: '3px solid var(--color-forest)' }}>
                  <span>💡</span>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13,
                    color: 'var(--color-ink)', margin: 0, lineHeight: 1.6 }}>{tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Cookbook() {
  const dispatch = useDispatch()
  const { user, savedRecipes } = useAuth()
  const [mealFilter, setMealFilter] = useState('all')
  const [selectedRecipe, setSelectedRecipe]   = useState(null)
  const [recipeDetail,   setRecipeDetail]     = useState(null)
  const [loadingDetail,  setLoadingDetail]    = useState(false)
  const [removing, setRemoving] = useState(null)

  const filtered = mealFilter === 'all'
    ? savedRecipes
    : savedRecipes.filter(r => r.mealType === mealFilter)

  const handleView = async (saved) => {
    setSelectedRecipe(saved)
    setLoadingDetail(true)
    try {
      const { data } = await api.get(`/recipes/fetch`, {
        params: { country: saved.country, mealType: saved.mealType }
      })
      setRecipeDetail(data.recipe)
    } catch {
      setRecipeDetail(null)
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleFav = async (saved) => {
    if (saved._id) dispatch(toggleFavorite(saved._id))
  }

  const handleRemove = async (saved) => {
    if (!saved._id) return
    setRemoving(saved._id)
    await dispatch(removeSavedRecipe(saved._id))
    setRemoving(null)
  }

  return (
    <div style={{ padding: '28px 28px 80px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36,
          fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 4px' }}>
          My Cookbook 📖
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-ink-muted)', margin: 0 }}>
          {savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''} saved from around the world
        </p>
      </motion.div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[{ id: 'all', label: 'All Recipes' }, ...MEAL_TYPES].map(m => (
          <button key={m.id} onClick={() => setMealFilter(m.id)}
            style={{
              padding: '7px 16px', borderRadius: 99, border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-body)',
              fontSize: 13, fontWeight: 500,
              background: mealFilter === m.id ? 'var(--color-forest)' : 'white',
              color: mealFilter === m.id ? 'white' : 'var(--color-ink-muted)',
              boxShadow: 'var(--shadow-card)',
              transition: 'all 0.2s ease',
            }}>
            {m.icon && `${m.icon} `}{m.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🍽️</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--color-ink)', margin: '0 0 8px' }}>
            {mealFilter === 'all' ? 'Your cookbook is empty' : `No ${mealFilter} recipes saved`}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-ink-faint)', maxWidth: 300, margin: '0 auto' }}>
            Spin the globe and save recipes to build your personal collection
          </p>
        </motion.div>
      )}

      {/* Recipe grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16,
      }}>
        <AnimatePresence>
          {filtered.map((saved, i) => {
            const flag = getFlagByName(saved.country)
            const meal = MEAL_TYPES.find(m => m.id === saved.mealType)
            return (
              <motion.div key={saved._id || i}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  background: 'white', borderRadius: 16,
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid rgba(212,197,169,0.3)',
                  overflow: 'hidden', cursor: 'pointer',
                }}
                onClick={() => handleView(saved)}
              >
                {/* Image area */}
                <div style={{ height: 130, background:
                  'linear-gradient(135deg, var(--color-forest) 0%, var(--color-forest-dark) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 40, position: 'relative' }}>
                  {saved.image
                    ? <img src={saved.image} alt={saved.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span>🍽️</span>
                  }
                  {/* Fav + remove */}
                  <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 5 }}
                    onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleFav(saved)}
                      style={{ width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: saved.isFavorite ? '#C4593A' : 'var(--color-ink-muted)' }}>
                      <HeartIcon filled={saved.isFavorite} />
                    </button>
                    <button onClick={() => handleRemove(saved)}
                      disabled={removing === saved._id}
                      style={{ width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'var(--color-ink-muted)' }}>
                      {removing === saved._id ? <LoadingSpinner size={12} /> : <TrashIcon />}
                    </button>
                  </div>
                  {saved.isFavorite && (
                    <div style={{ position: 'absolute', top: 8, left: 8 }}>
                      <span className="pill" style={{ background: 'rgba(255,255,255,0.9)',
                        color: '#C4593A', fontSize: 10 }}>⭐ Favourite</span>
                    </div>
                  )}
                </div>

                <div style={{ padding: '12px 14px' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
                    color: 'var(--color-ink)', margin: '0 0 6px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {saved.title}
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="pill" style={{ fontSize: 11 }}>
                      {flag} {saved.country}
                    </span>
                    {meal && (
                      <span className="pill green" style={{ fontSize: 11 }}>
                        {meal.icon} {meal.label}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 11,
                    color: 'var(--color-ink-faint)', margin: '8px 0 0' }}>
                    Saved {new Date(saved.savedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetailModal
            savedRecipe={selectedRecipe}
            recipeData={loadingDetail ? null : recipeDetail}
            onClose={() => { setSelectedRecipe(null); setRecipeDetail(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}