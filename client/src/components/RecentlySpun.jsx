// src/components/RecentlySpun.jsx
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import useFetchRecipe from '../hooks/useFetchRecipe'
import { getFlagByName } from '../utils/countries'

export default function RecentlySpun({ onSelect }) {
  const { recentlySpun, loadRecentlySpun, selectCountry, selectedMealType, getRecipe } = useFetchRecipe()

  useEffect(() => {
    loadRecentlySpun()
  }, [])

  if (!recentlySpun || recentlySpun.length === 0) return null

  const handleClick = (recipe) => {
    selectCountry(recipe.country)
    getRecipe(recipe.country, selectedMealType)
    onSelect?.(recipe.country)
  }

  // Deduplicate by country
  const unique = recentlySpun.reduce((acc, r) => {
    if (!acc.find(x => x.country === r.country)) acc.push(r)
    return acc
  }, []).slice(0, 6)

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        padding: '14px 16px',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid rgba(212,197,169,0.3)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-faint)',
          marginBottom: 10,
        }}
      >
        Recently Spun
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {unique.map((recipe, i) => {
          const flag = getFlagByName(recipe.country)
          return (
            <motion.button
              key={`${recipe.country}-${i}`}
              onClick={() => handleClick(recipe)}
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              title={recipe.country}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 99,
                background: 'var(--color-cream)',
                border: '1.5px solid var(--color-cream-dark)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--color-ink)',
                whiteSpace: 'nowrap',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-forest)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-cream-dark)'}
            >
              <span style={{ fontSize: 15 }}>{flag}</span>
              <span>{recipe.country}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}