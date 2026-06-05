// src/utils/constants.js

export const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '☀️', desc: 'Morning dishes' },
  { id: 'lunch',     label: 'Lunch',     icon: '🌤️', desc: 'Midday meals'   },
  { id: 'dinner',    label: 'Dinner',    icon: '🌙', desc: 'Evening feasts' },
]

export const DIFFICULTY_COLORS = {
  easy:   { bg: 'rgba(61,122,74,0.12)', text: '#3D7A4A' },
  medium: { bg: 'rgba(184,134,11,0.12)', text: '#B8860B' },
  hard:   { bg: 'rgba(196,89,58,0.12)', text: '#C4593A' },
}

export const NAV_ITEMS = [
  { path: '/',          label: 'Home',            icon: 'home'    },
  { path: '/spin',      label: 'Spin the Globe',  icon: 'globe'   },
  { path: '/explore',   label: 'Explore Recipes', icon: 'book'    },
  { path: '/cookbook',  label: 'My Cookbook',     icon: 'chef'    },
  { path: '/favorites', label: 'Favorites',       icon: 'heart'   },
  { path: '/about',     label: 'About',           icon: 'info'    },
]

export const TAGLINES = [
  '"Food is a passport to the heart of a culture."',
  '"Every dish tells a story."',
  '"The world on a plate."',
  '"Cook. Explore. Connect."',
]