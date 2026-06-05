// src/pages/About.jsx
import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '🌍', title: 'Spin the Globe', desc: 'Click spin to land on a random country from over 60 destinations worldwide and discover its culinary traditions.' },
  { icon: '🍽️', title: 'Authentic Recipes', desc: 'Every recipe is sourced from Spoonacular\'s vast database of real, traditional dishes — not tourist adaptations.' },
  { icon: '🤖', title: 'AI-Powered Fallback', desc: 'When no recipe is found, Groq AI generates a culturally authentic recipe using LLaMA 3, trained on culinary knowledge.' },
  { icon: '📖', title: 'Personal Cookbook', desc: 'Save recipes you love to your personal cookbook and mark favourites to create your own culinary passport.' },
  { icon: '🔍', title: 'Browse by Region', desc: 'Choose any country from Asia, Europe, Africa, the Americas, and more via the country selector.' },
  { icon: '⚡', title: 'Smart Caching', desc: 'Recipes are cached for 7 days to ensure fast loading and to minimise API usage.' },
]

const TEAM = [
  { name: 'Built with ❤️', role: 'A hackathon project exploring food and culture through technology.' },
]

const STACK = [
  { name: 'React + Vite', color: '#61DAFB',  bg: 'rgba(97,218,251,0.1)' },
  { name: 'Redux Toolkit', color: '#764ABC', bg: 'rgba(118,74,188,0.1)' },
  { name: 'Tailwind CSS v4', color: '#38BDF8',bg: 'rgba(56,189,248,0.1)' },
  { name: 'Framer Motion', color: '#E45E9D', bg: 'rgba(228,94,157,0.1)' },
  { name: 'Node.js + Express', color: '#4EA94B', bg: 'rgba(78,169,75,0.1)' },
  { name: 'MongoDB Atlas', color: '#47A248', bg: 'rgba(71,162,72,0.1)' },
  { name: 'Groq AI (LLaMA 3)', color: '#FF6B35', bg: 'rgba(255,107,53,0.1)' },
  { name: 'Spoonacular API', color: '#F5A623', bg: 'rgba(245,166,35,0.1)' },
  { name: 'JWT Auth', color: '#9B59B6', bg: 'rgba(155,89,182,0.1)' },
  { name: 'Render Hosting', color: '#46E3B7', bg: 'rgba(70,227,183,0.1)' },
  { name: 'Three.js', color: '#E45E9D', bg: 'rgba(228,94,157,0.1)' },
]

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

export default function About() {
  return (
    <div style={{ padding: '28px 28px 80px', maxWidth: 860, margin: '0 auto' }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <motion.div {...fadeUp} style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🌍</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,6vw,52px)',
          fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 12px', lineHeight: 1.1 }}>
          Taste the World
        </h1>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 18,
          fontStyle: 'italic', color: 'var(--color-forest)', margin: '0 0 16px' }}>
          "One recipe. One culture."
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15,
          color: 'var(--color-ink-muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          A culinary passport that takes you around the globe — one dish at a time.
          Discover authentic, traditional recipes from over 60 countries and learn
          about the cultures that created them.
        </p>
      </motion.div>

      {/* ── Mission ───────────────────────────────────────────────── */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }}
        style={{
          background: 'var(--color-forest)',
          borderRadius: 20,
          padding: '28px 32px',
          marginBottom: 36,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.08,
          fontSize: 120, pointerEvents: 'none', lineHeight: 1 }}>🍜</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24,
          fontWeight: 600, color: 'white', margin: '0 0 10px' }}>
          Our Mission
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14,
          color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0, maxWidth: 600 }}>
          Food is one of humanity's most powerful bridges between cultures. We believe
          that cooking a country's traditional dish is one of the most authentic ways
          to understand and appreciate a culture. Taste the World makes that journey
          accessible, fun, and delicious — from your own kitchen.
        </p>
      </motion.div>

      {/* ── Features ──────────────────────────────────────────────── */}
      <motion.div {...fadeUp} transition={{ delay: 0.15 }} style={{ marginBottom: 36 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26,
          fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 18px' }}>
          How It Works
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 14,
        }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              style={{
                background: 'white', borderRadius: 14,
                padding: '18px 16px',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid rgba(212,197,169,0.3)',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16,
                fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 6px' }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13,
                color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Tech Stack ────────────────────────────────────────────── */}
      <motion.div {...fadeUp} transition={{ delay: 0.2 }} style={{ marginBottom: 36 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26,
          fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 16px' }}>
          Tech Stack
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STACK.map((s, i) => (
            <motion.span key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 99,
                background: s.bg,
                border: `1px solid ${s.color}30`,
                fontFamily: 'var(--font-body)', fontSize: 12,
                fontWeight: 600, color: s.color,
              }}
            >
              {s.name}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* ── Quote ─────────────────────────────────────────────────── */}
      <motion.div {...fadeUp} transition={{ delay: 0.25 }}
        style={{
          background: 'white', borderRadius: 16,
          padding: '24px 28px',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid rgba(212,197,169,0.3)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20,
          fontStyle: 'italic', color: 'var(--color-ink)', margin: '0 0 10px',
          lineHeight: 1.5 }}>
          "Food is a passport to the heart of a culture."
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12,
          color: 'var(--color-ink-faint)', margin: 0 }}>
          — The Taste the World Manifesto
        </p>

        <div style={{ display: 'flex', justifyContent: 'center',
          gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          {['🇯🇵', '🇲🇦', '🇮🇹', '🇹🇭', '🇲🇽', '🇮🇳', '🇫🇷', '🇧🇷'].map((flag, i) => (
            <motion.span key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.25 }}
              style={{ fontSize: 22 }}>
              {flag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}