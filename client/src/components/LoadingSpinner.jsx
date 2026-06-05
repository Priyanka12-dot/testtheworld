// src/components/LoadingSpinner.jsx
export default function LoadingSpinner({
  size = 24,
  color = 'var(--color-forest)',
  thickness = 2.5,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <circle
        cx="12" cy="12" r="9"
        stroke={color}
        strokeOpacity="0.25"
        strokeWidth={thickness}
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
      />
    </svg>
  )
}