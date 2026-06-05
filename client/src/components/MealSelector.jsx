// src/components/MealSelector.jsx
import { motion } from 'framer-motion'
import { MEAL_TYPES } from '../utils/constants'

export default function MealSelector({ selected, onChange }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        padding: '16px',
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
        Choose a Meal
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {MEAL_TYPES.map((meal, i) => {
          const isActive = selected === meal.id
          return (
            <motion.button
              key={meal.id}
              onClick={() => onChange(meal.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'rgba(61,90,62,0.08)' : 'transparent',
                transition: 'background 0.2s ease',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16 }}>{meal.icon}</span>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-forest)' : 'var(--color-ink)',
                    margin: 0,
                  }}
                >
                  {meal.label}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    color: 'var(--color-ink-faint)',
                    margin: 0,
                  }}
                >
                  {meal.desc}
                </p>
              </div>

              {isActive && (
                <motion.div
                  layoutId="meal-indicator"
                  style={{
                    marginLeft: 'auto',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--color-forest)',
                  }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}