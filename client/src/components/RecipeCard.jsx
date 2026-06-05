// src/components/RecipeCard.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import useAuth from '../redux/hooks/useAuth'
import { getFlagByName } from '../utils/countries'
import { DIFFICULTY_COLORS } from '../utils/constants'
import LoadingSpinner from './LoadingSpinner'

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const FlameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
)
const BookmarkIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
  </svg>
)
const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#C4593A' : 'none'} stroke={filled ? '#C4593A' : 'currentColor'} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const LeafIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)

export default function RecipeCard({ recipe, loading, onSave }) {
  const { isLoggedIn, savedRecipes, saveRecipe, toggleFav, successMsg } = useAuth()
  const [activeTab, setActiveTab] = useState('steps')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (loading) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          boxShadow: 'var(--shadow-card)',
          border: '1px solid rgba(212,197,169,0.3)',
          minHeight: 520,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 32,
        }}
      >
        <LoadingSpinner size={44} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--color-ink)', marginBottom: 4 }}>
            Exploring the world's kitchens…
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-ink-faint)' }}>
            Finding the perfect recipe for you
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 14, width: `${85 - i * 12}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          boxShadow: 'var(--shadow-card)',
          border: '1px solid rgba(212,197,169,0.3)',
          minHeight: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 32,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 48 }}>🌍</span>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-ink)', fontWeight: 600 }}>
          Your Recipe
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-ink-faint)', maxWidth: 220 }}>
          Spin the globe or select a country and meal type to discover a dish
        </p>
      </div>
    )
  }

  const difficulty = DIFFICULTY_COLORS[recipe.difficulty] || DIFFICULTY_COLORS.medium
  const flag = getFlagByName(recipe.country)

  const isSaved = savedRecipes?.some(r =>
    r.recipeId === recipe._id || r.title === recipe.title
  )
  const savedEntry = savedRecipes?.find(r =>
    r.recipeId === recipe._id || r.title === recipe.title
  )
  const isFav = savedEntry?.isFavorite || false

  const handleSave = async () => {
    if (!isLoggedIn) { onSave?.(); return }
    if (isSaved) return
    setSaving(true)
    await saveRecipe(recipe._id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleFav = async () => {
    if (!isLoggedIn) { onSave?.(); return }
    if (savedEntry?._id) await toggleFav(savedEntry._id)
  }

  const tabs = ['ingredients', 'steps', 'tips']

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'white',
        borderRadius: 20,
        boxShadow: 'var(--shadow-card)',
        border: '1px solid rgba(212,197,169,0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Hero image ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', flexShrink: 0 }}>
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #3D5A3E 0%, #2C4030 50%, #4E7050 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 60,
            }}
          >
            🍽️
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(30,30,20,0.7) 0%, transparent 50%)',
        }} />

        {/* Source badge */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span className="pill" style={{
            background: 'rgba(255,255,255,0.92)',
            fontSize: 11,
            gap: 3,
          }}>
            {recipe.source === 'groq' ? '🤖 AI Generated' : '📖 Spoonacular'}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFav}
            title={isFav ? 'Remove from favourites' : 'Add to favourites'}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isFav ? '#C4593A' : 'var(--color-ink-muted)',
            }}
          >
            <HeartIcon filled={isFav} />
          </motion.button>
        </div>

        {/* Country tag at bottom */}
        <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
          <span className="pill" style={{ background: 'rgba(255,255,255,0.92)', gap: 5, fontSize: 12 }}>
            <span>{flag}</span>
            <span style={{ fontWeight: 500, color: 'var(--color-ink)' }}>{recipe.country}</span>
          </span>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Title & badge */}
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--color-ink-faint)', marginBottom: 4 }}>
            Your Recipe
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600,
            color: 'var(--color-ink)', lineHeight: 1.2, margin: 0 }}>
            {recipe.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {recipe.mealType && (
              <span className="pill green" style={{ textTransform: 'capitalize' }}>
                {recipe.mealType}
              </span>
            )}
            {recipe.difficulty && (
              <span className="pill" style={{
                background: difficulty.bg, color: difficulty.text, textTransform: 'capitalize',
              }}>
                {recipe.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {recipe.description && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-ink-muted)',
            lineHeight: 1.6, margin: 0, display: '-webkit-box',
            WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {recipe.description}
          </p>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {recipe.readyInMinutes && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4,
              color: 'var(--color-ink-muted)', fontSize: 12 }}>
              <ClockIcon />
              <span>{recipe.readyInMinutes} mins</span>
            </div>
          )}
          {recipe.servings && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4,
              color: 'var(--color-ink-muted)', fontSize: 12 }}>
              <UsersIcon />
              <span>{recipe.servings} servings</span>
            </div>
          )}
          {recipe.difficulty && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4,
              color: 'var(--color-ink-muted)', fontSize: 12 }}>
              <FlameIcon />
              <span style={{ textTransform: 'capitalize' }}>{recipe.difficulty}</span>
            </div>
          )}
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <div style={{ borderBottom: '1px solid var(--color-cream-dark)', display: 'flex', gap: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{ textTransform: 'capitalize' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab content ───────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: 260, paddingRight: 4 }}>
          <AnimatePresence mode="wait">
            {activeTab === 'ingredients' && (
              <motion.div key="ingredients"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                {recipe.ingredients?.map((ing, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 0', borderBottom: '1px solid var(--color-cream)',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--color-forest)', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13,
                      color: 'var(--color-ink)', flex: 1 }}>
                      {ing.original || `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'steps' && (
              <motion.div key="steps"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {recipe.steps?.map((step, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
                  >
                    <div className="step-badge" style={{ flexShrink: 0 }}>
                      {step.number || i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13,
                        color: 'var(--color-ink)', lineHeight: 1.6, margin: 0 }}>
                        {step.instruction}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 6,
                      background: 'var(--color-cream)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-ink-faint)' }}>
                      <LeafIcon />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'tips' && (
              <motion.div key="tips"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                {recipe.tips?.length > 0 ? recipe.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px',
                    background: 'rgba(61,90,62,0.06)', borderRadius: 10,
                    borderLeft: '3px solid var(--color-forest)' }}>
                    <span style={{ fontSize: 14 }}>💡</span>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13,
                      color: 'var(--color-ink)', lineHeight: 1.6, margin: 0 }}>
                      {tip}
                    </p>
                  </div>
                )) : (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13,
                    color: 'var(--color-ink-faint)', textAlign: 'center', padding: '20px 0' }}>
                    No tips available for this recipe.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Save button ───────────────────────────────────────────── */}
        <motion.button
          className="btn-primary"
          onClick={handleSave}
          whileTap={{ scale: 0.97 }}
          disabled={saving || isSaved}
          style={{ width: '100%', marginTop: 4, fontSize: 14 }}
        >
          {saving ? (
            <LoadingSpinner size={16} color="white" />
          ) : saved || isSaved ? (
            <><CheckIcon /> Saved to Cookbook</>
          ) : (
            <><BookmarkIcon /> Save to My Cookbook</>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}