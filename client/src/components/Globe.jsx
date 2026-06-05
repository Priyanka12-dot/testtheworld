// src/components/Globe.jsx
// Full Three.js 3D globe with earth texture, atmosphere glow,
// starfield, country pins, and spin/float animations.

import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// ── Country lat/lon lookup ─────────────────────────────────────────────────────
const COUNTRY_COORDS = {
  Japan:           { lat: 36.2,   lon: 138.2  },
  China:           { lat: 35.8,   lon: 104.2  },
  India:           { lat: 20.6,   lon: 78.9   },
  Thailand:        { lat: 15.9,   lon: 100.9  },
  Vietnam:         { lat: 14.1,   lon: 108.3  },
  'South Korea':   { lat: 35.9,   lon: 127.8  },
  Indonesia:       { lat: -0.8,   lon: 113.9  },
  Malaysia:        { lat: 4.2,    lon: 108.0  },
  Philippines:     { lat: 12.9,   lon: 121.8  },
  Singapore:       { lat: 1.4,    lon: 103.8  },
  Bangladesh:      { lat: 23.7,   lon: 90.4   },
  Pakistan:        { lat: 30.4,   lon: 69.3   },
  'Sri Lanka':     { lat: 7.9,    lon: 80.8   },
  Nepal:           { lat: 28.4,   lon: 84.1   },
  Myanmar:         { lat: 19.2,   lon: 96.7   },
  Cambodia:        { lat: 12.6,   lon: 104.9  },
  Turkey:          { lat: 38.9,   lon: 35.2   },
  Lebanon:         { lat: 33.9,   lon: 35.9   },
  Iran:            { lat: 32.4,   lon: 53.7   },
  'Saudi Arabia':  { lat: 23.9,   lon: 45.1   },
  Egypt:           { lat: 26.8,   lon: 30.8   },
  Israel:          { lat: 31.0,   lon: 34.9   },
  Iraq:            { lat: 33.2,   lon: 43.7   },
  Jordan:          { lat: 30.6,   lon: 36.2   },
  Morocco:         { lat: 31.8,   lon: -7.1   },
  Ethiopia:        { lat: 9.1,    lon: 40.5   },
  Nigeria:         { lat: 9.1,    lon: 8.7    },
  Ghana:           { lat: 7.9,    lon: -1.0   },
  Kenya:           { lat: -0.0,   lon: 37.9   },
  'South Africa':  { lat: -28.5,  lon: 24.7   },
  Senegal:         { lat: 14.5,   lon: -14.5  },
  Tanzania:        { lat: -6.4,   lon: 34.9   },
  Italy:           { lat: 41.9,   lon: 12.6   },
  France:          { lat: 46.2,   lon: 2.2    },
  Spain:           { lat: 40.5,   lon: -3.7   },
  Greece:          { lat: 39.1,   lon: 21.8   },
  Germany:         { lat: 51.2,   lon: 10.5   },
  Portugal:        { lat: 39.4,   lon: -8.2   },
  'United Kingdom':{ lat: 55.4,   lon: -3.4   },
  Ireland:         { lat: 53.4,   lon: -8.2   },
  Netherlands:     { lat: 52.1,   lon: 5.3    },
  Belgium:         { lat: 50.5,   lon: 4.5    },
  Sweden:          { lat: 60.1,   lon: 18.6   },
  Norway:          { lat: 60.5,   lon: 8.5    },
  Denmark:         { lat: 56.3,   lon: 9.5    },
  Finland:         { lat: 61.9,   lon: 25.7   },
  Poland:          { lat: 51.9,   lon: 19.1   },
  Russia:          { lat: 61.5,   lon: 105.3  },
  Hungary:         { lat: 47.2,   lon: 19.5   },
  Switzerland:     { lat: 46.8,   lon: 8.2    },
  Austria:         { lat: 47.5,   lon: 14.6   },
  Mexico:          { lat: 23.6,   lon: -102.6 },
  Brazil:          { lat: -14.2,  lon: -51.9  },
  Argentina:       { lat: -38.4,  lon: -63.6  },
  Peru:            { lat: -9.2,   lon: -75.0  },
  Colombia:        { lat: 4.6,    lon: -74.3  },
  Cuba:            { lat: 21.5,   lon: -79.5  },
  Jamaica:         { lat: 18.1,   lon: -77.3  },
  Venezuela:       { lat: 6.4,    lon: -66.6  },
  Chile:           { lat: -35.7,  lon: -71.5  },
  Canada:          { lat: 56.1,   lon: -106.3 },
  'United States': { lat: 37.1,   lon: -95.7  },
  Australia:       { lat: -25.3,  lon: 133.8  },
  'New Zealand':   { lat: -40.9,  lon: 174.9  },
}

// ── Convert lat/lon to 3D sphere position ─────────────────────────────────────
const latLonToVec3 = (lat, lon, radius) => {
  const phi   = (90 - lat)  * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  )
}

// ── Create a glowing dot sprite for country pin ───────────────────────────────
const createPinSprite = () => {
  const canvas  = document.createElement('canvas')
  canvas.width  = 128
  canvas.height = 128
  const ctx     = canvas.getContext('2d')

  // Outer glow
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0,    'rgba(247,242,232,1)')
  grad.addColorStop(0.15, 'rgba(247,242,232,0.9)')
  grad.addColorStop(0.35, 'rgba(247,242,232,0.4)')
  grad.addColorStop(0.6,  'rgba(247,242,232,0.15)')
  grad.addColorStop(1,    'rgba(247,242,232,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)

  // Inner bright dot
  const inner = ctx.createRadialGradient(64, 64, 0, 64, 64, 14)
  inner.addColorStop(0,   'rgba(255,255,255,1)')
  inner.addColorStop(0.5, 'rgba(247,242,232,1)')
  inner.addColorStop(1,   'rgba(247,242,232,0.6)')
  ctx.fillStyle = inner
  ctx.beginPath()
  ctx.arc(64, 64, 14, 0, Math.PI * 2)
  ctx.fill()

  const tex = new THREE.CanvasTexture(canvas)
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(0.18, 0.18, 0.18)
  return sprite
}

// ── Create a pulsing ring sprite ──────────────────────────────────────────────
const createRingSprite = () => {
  const canvas  = document.createElement('canvas')
  canvas.width  = 128
  canvas.height = 128
  const ctx     = canvas.getContext('2d')

  ctx.strokeStyle = 'rgba(247,242,232,0.85)'
  ctx.lineWidth   = 5
  ctx.beginPath()
  ctx.arc(64, 64, 46, 0, Math.PI * 2)
  ctx.stroke()

  const tex = new THREE.CanvasTexture(canvas)
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(0.22, 0.22, 0.22)
  return sprite
}

// ── Main Globe component ──────────────────────────────────────────────────────
export default function Globe({ selectedCountry, isSpinning }) {
  const mountRef    = useRef(null)
  const sceneRef    = useRef({})   // holds all Three.js objects
  const frameRef    = useRef(null)
  const spinRef     = useRef({ speed: 0.0018, target: 0.0018, boosting: false })
  const ringRef     = useRef({ scale: 0.22, growing: true, opacity: 1 })
  const floatRef    = useRef({ t: 0 })

  // ── Boot Three.js scene ────────────────────────────────────────────────────
  useEffect(() => {
    const el     = mountRef.current
    const W      = el.clientWidth
    const H      = el.clientHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // Scene & Camera
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.z = 2.8

    // ── Lighting ────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xfff4e0, 1.4)
    sun.position.set(5, 3, 5)
    scene.add(sun)

    const fill = new THREE.DirectionalLight(0xb0c8ff, 0.25)
    fill.position.set(-4, -1, -3)
    scene.add(fill)

    // ── Earth sphere ─────────────────────────────────────────────────────────
    const loader   = new THREE.TextureLoader()
    const earthGeo = new THREE.SphereGeometry(1, 64, 64)

    const earthMat = new THREE.MeshPhongMaterial({
      map:       loader.load('/earth.jpg'),
      specular:  new THREE.Color(0x1a3a5c),
      shininess: 18,
    })
    const earth = new THREE.Mesh(earthGeo, earthMat)
    scene.add(earth)

    // ── Atmosphere glow ───────────────────────────────────────────────────────
    const atmGeo = new THREE.SphereGeometry(1.06, 64, 64)
    const atmMat = new THREE.MeshPhongMaterial({
      color:       0x4488cc,
      transparent: true,
      opacity:     0.08,
      side:        THREE.FrontSide,
      depthWrite:  false,
    })
    const atmosphere = new THREE.Mesh(atmGeo, atmMat)
    scene.add(atmosphere)

    // Outer halo ring (additive)
    const haloGeo = new THREE.SphereGeometry(1.12, 64, 64)
    const haloMat = new THREE.MeshBasicMaterial({
      color:       0x3399ff,
      transparent: true,
      opacity:     0.04,
      side:        THREE.BackSide,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    })
    const halo = new THREE.Mesh(haloGeo, haloMat)
    scene.add(halo)

    // ── Starfield ─────────────────────────────────────────────────────────────
    const starCount  = 1800
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 8 + Math.random() * 4
      starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPositions[i * 3 + 2] = r * Math.cos(phi)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMat  = new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.65 })
    const stars    = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // ── Pin group (pin + ring sprites) ────────────────────────────────────────
    const pinGroup = new THREE.Group()
    pinGroup.visible = false
    scene.add(pinGroup)

    const pinSprite  = createPinSprite()
    const ringSprite = createRingSprite()
    pinGroup.add(pinSprite)
    pinGroup.add(ringSprite)

    // ── Store everything ──────────────────────────────────────────────────────
    sceneRef.current = {
      renderer, scene, camera, earth, atmosphere, halo,
      stars, pinGroup, pinSprite, ringSprite, loader,
    }

    // ── Animate ───────────────────────────────────────────────────────────────
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      const s = spinRef.current

      // Smooth speed interpolation
      s.speed += (s.target - s.speed) * 0.06

      // Float up/down
      floatRef.current.t += 0.012
      const floatY = Math.sin(floatRef.current.t) * 0.04

      earth.rotation.y     += s.speed
      atmosphere.rotation.y = earth.rotation.y
      halo.rotation.y       = earth.rotation.y

      earth.position.y     = floatY
      atmosphere.position.y = floatY
      halo.position.y       = floatY

      // Pin follows earth rotation
      if (pinGroup.visible && pinGroup.userData.baseLon !== undefined) {
        const lon  = pinGroup.userData.baseLon
        const lat  = pinGroup.userData.baseLat
        const pos  = latLonToVec3(lat, lon, 1.04)

        // Rotate pin around Y by same amount as earth
        const totalRot = earth.rotation.y
        const sinR = Math.sin(totalRot)
        const cosR = Math.cos(totalRot)
        const rx = pos.x * cosR + pos.z * sinR
        const rz = -pos.x * sinR + pos.z * cosR

        pinGroup.position.set(rx, pos.y + floatY, rz)
        pinGroup.position.normalize().multiplyScalar(1.04)
        pinGroup.position.y += floatY

        // Pulse ring
        const r = ringRef.current
        r.scale   += r.growing ? 0.006 : -0.004
        r.opacity -= 0.012
        if (r.scale > 0.42 || r.opacity <= 0) {
          r.scale   = 0.18
          r.opacity = 0.9
          r.growing = true
        }
        ringSprite.scale.set(r.scale, r.scale, r.scale)
        ringSprite.material.opacity = Math.max(0, r.opacity)
      }

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize handler ────────────────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frameRef.current)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)

      // Dispose geometries & materials
      earthGeo.dispose(); earthMat.dispose()
      atmGeo.dispose();   atmMat.dispose()
      haloGeo.dispose();  haloMat.dispose()
      starGeo.dispose();  starMat.dispose()
    }
  }, [])

  // ── React to isSpinning prop ───────────────────────────────────────────────
  useEffect(() => {
    if (isSpinning) {
      // Blast to fast, then coast back to normal
      spinRef.current.target   = 0.06
      spinRef.current.boosting = true
      const timeout = setTimeout(() => {
        spinRef.current.target   = 0.0018
        spinRef.current.boosting = false
      }, 2200)
      return () => clearTimeout(timeout)
    }
  }, [isSpinning])

  // ── React to selectedCountry prop ─────────────────────────────────────────
  useEffect(() => {
    const { pinGroup } = sceneRef.current
    if (!pinGroup) return

    if (!selectedCountry || !COUNTRY_COORDS[selectedCountry]) {
      pinGroup.visible = false
      return
    }

    const { lat, lon } = COUNTRY_COORDS[selectedCountry]
    pinGroup.userData.baseLat = lat
    pinGroup.userData.baseLon = lon
    pinGroup.visible = true

    // Reset ring pulse
    ringRef.current = { scale: 0.18, growing: true, opacity: 0.9 }

    // Slowly rotate earth to face the country
    const { earth } = sceneRef.current
    if (earth) {
      const targetRotY = -((lon + 180) * Math.PI / 180) + Math.PI
      const current    = earth.rotation.y % (Math.PI * 2)
      const diff       = targetRotY - current
      const normalised = ((diff + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      const rotSteps   = 60
      let   step       = 0
      const rotInterval = setInterval(() => {
        if (step++ >= rotSteps) { clearInterval(rotInterval); return }
        earth.rotation.y += normalised / rotSteps
      }, 16)
    }
  }, [selectedCountry])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
      userSelect: 'none', gap: 0 }}>

{/* Three.js canvas mount */}
      <div
        ref={mountRef}
        style={{
          width:  '100%',
          height: 'clamp(220px, 35vw, 320px)',
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 35% 35%, #1a2744 0%, #060d1f 70%, #020408 100%)',
          boxShadow: '0 0 60px rgba(30,60,120,0.35), 0 20px 60px rgba(0,0,0,0.4)',
          cursor: 'grab',
          position: 'relative',
        }}
      />

      {/* Bronze stand */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -8 }}>
        {/* Neck */}
        <div style={{
          width: 12, height: 28,
          background: 'linear-gradient(to right, #6B4A10, #C49A30, #A07820, #6B4A10)',
          borderRadius: '0 0 3px 3px',
        }} />
        {/* Base disc top */}
        <div style={{
          width: 64, height: 12,
          background: 'linear-gradient(to bottom, #C49A30, #8B6914)',
          borderRadius: '50%',
          boxShadow: '0 3px 8px rgba(0,0,0,0.35)',
          transform: 'perspective(40px) rotateX(20deg)',
        }} />
        {/* Base disc bottom */}
        <div style={{
          width: 72, height: 8,
          background: 'linear-gradient(to bottom, #8B6914, #5C4210)',
          borderRadius: '50%',
          marginTop: -3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }} />
        {/* Shadow under stand */}
        <div style={{
          width: 80, height: 8,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
          marginTop: 2,
        }} />
      </div>

      {/* Country label */}
      {selectedCountry && (
        <motion.div
          key={selectedCountry}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 6,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 12px',
            background: 'rgba(30,30,20,0.82)',
            borderRadius: 99,
            backdropFilter: 'blur(6px)',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%',
            background: '#F7F2E8', boxShadow: '0 0 6px rgba(247,242,232,0.8)',
            display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12,
            fontWeight: 600, color: '#F7F2E8', letterSpacing: '0.04em' }}>
            {selectedCountry}
          </span>
        </motion.div>
      )}
    </div>
  )
}