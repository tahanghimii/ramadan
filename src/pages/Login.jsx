import { useState, useEffect, useRef } from 'react'
import { loginAdmin, loginUser } from '../sheets'

// ── Star field + 3D moon canvas ──────────────────────────────
function NightSky() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Generate stars
    const stars = Array.from({ length: 200 }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      r:       Math.random() * 1.8 + 0.2,
      opacity: Math.random(),
      speed:   Math.random() * 0.008 + 0.002,
      phase:   Math.random() * Math.PI * 2,
    }))

    // Shooting stars
    const shootingStars = []
    const addShootingStar = () => {
      if (shootingStars.length < 3) {
        shootingStars.push({
          x:       Math.random() * window.innerWidth,
          y:       Math.random() * (window.innerHeight / 2),
          len:     Math.random() * 120 + 60,
          speed:   Math.random() * 8 + 6,
          opacity: 1,
          angle:   Math.PI / 5,
        })
      }
    }
    const shootInterval = setInterval(addShootingStar, 3000)

    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height)
      bg.addColorStop(0, '#020b18')
      bg.addColorStop(0.5, '#041225')
      bg.addColorStop(1, '#064e3b')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Nebula glow
      const nebula = ctx.createRadialGradient(
        canvas.width * 0.7, canvas.height * 0.2, 0,
        canvas.width * 0.7, canvas.height * 0.2, 300
      )
      nebula.addColorStop(0, 'rgba(6, 78, 59, 0.25)')
      nebula.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = nebula
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Twinkling stars
      stars.forEach(s => {
        s.opacity = 0.4 + Math.sin(t * s.speed + s.phase) * 0.6
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, s.opacity)})`
        ctx.fill()

        // Star cross sparkle for bigger stars
        if (s.r > 1.4) {
          ctx.strokeStyle = `rgba(255,255,255,${s.opacity * 0.4})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(s.x - s.r * 3, s.y)
          ctx.lineTo(s.x + s.r * 3, s.y)
          ctx.moveTo(s.x, s.y - s.r * 3)
          ctx.lineTo(s.x, s.y + s.r * 3)
          ctx.stroke()
        }
      })

      // Shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]
        const grad = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y - Math.sin(ss.angle) * ss.len
        )
        grad.addColorStop(0, `rgba(255,255,255,${ss.opacity})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.beginPath()
        ctx.moveTo(ss.x, ss.y)
        ctx.lineTo(
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y - Math.sin(ss.angle) * ss.len
        )
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()
        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y += Math.sin(ss.angle) * ss.speed
        ss.opacity -= 0.012
        if (ss.opacity <= 0) shootingStars.splice(i, 1)
      }

      // ── 3D Moon ──────────────────────────────────────────────
      const mx = canvas.width * 0.78
      const my = canvas.height * 0.18
      const mr = 80

      // Outer glow layers
      ;[120, 100, 90].forEach((r, i) => {
        const glow = ctx.createRadialGradient(mx, my, mr * 0.5, mx, my, r)
        glow.addColorStop(0, `rgba(255, 240, 180, ${0.06 - i * 0.015})`)
        glow.addColorStop(1, 'rgba(255,240,180,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(mx, my, r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Moon base — 3D sphere gradient
      const moonGrad = ctx.createRadialGradient(
        mx - mr * 0.3, my - mr * 0.3, mr * 0.1,
        mx, my, mr
      )
      moonGrad.addColorStop(0,   '#fffde7')
      moonGrad.addColorStop(0.3, '#fff9c4')
      moonGrad.addColorStop(0.7, '#f9e07a')
      moonGrad.addColorStop(1,   '#c8960a')
      ctx.beginPath()
      ctx.arc(mx, my, mr, 0, Math.PI * 2)
      ctx.fillStyle = moonGrad
      ctx.fill()

      // Moon craters
      const craters = [
        { cx: mx + 20, cy: my + 15, r: 12 },
        { cx: mx - 25, cy: my + 30, r: 8  },
        { cx: mx + 35, cy: my - 20, r: 6  },
        { cx: mx - 15, cy: my - 25, r: 5  },
        { cx: mx + 10, cy: my + 40, r: 4  },
      ]
      craters.forEach(c => {
        const cg = ctx.createRadialGradient(c.cx - 2, c.cy - 2, 1, c.cx, c.cy, c.r)
        cg.addColorStop(0, 'rgba(180, 140, 20, 0.4)')
        cg.addColorStop(1, 'rgba(120, 90, 0, 0.15)')
        ctx.beginPath()
        ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2)
        ctx.fillStyle = cg
        ctx.fill()
      })

      // Moon shadow (crescent effect)
      const shadow = ctx.createRadialGradient(
        mx + mr * 0.4, my, mr * 0.2,
        mx + mr * 0.5, my, mr * 1.1
      )
      shadow.addColorStop(0, 'rgba(2, 11, 24, 0)')
      shadow.addColorStop(0.6, 'rgba(2, 11, 24, 0.5)')
      shadow.addColorStop(1, 'rgba(2, 11, 24, 0.85)')
      ctx.beginPath()
      ctx.arc(mx, my, mr, 0, Math.PI * 2)
      ctx.fillStyle = shadow
      ctx.fill()

      // Moon shimmer highlight
      const shine = ctx.createRadialGradient(
        mx - mr * 0.35, my - mr * 0.35, 0,
        mx - mr * 0.2,  my - mr * 0.2,  mr * 0.55
      )
      shine.addColorStop(0, 'rgba(255,255,255,0.35)')
      shine.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.arc(mx, my, mr, 0, Math.PI * 2)
      ctx.fillStyle = shine
      ctx.fill()

      // Floating particles near moon
      for (let i = 0; i < 6; i++) {
        const angle = (t * 0.3 + i * (Math.PI / 3)) % (Math.PI * 2)
        const dist  = mr + 25 + Math.sin(t * 0.5 + i) * 8
        const px    = mx + Math.cos(angle) * dist
        const py    = my + Math.sin(angle) * dist * 0.4
        const pr    = 1.2 + Math.sin(t + i) * 0.6
        ctx.beginPath()
        ctx.arc(px, py, pr, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 240, 150, ${0.4 + Math.sin(t + i) * 0.3})`
        ctx.fill()
      }

      t += 0.04
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(shootInterval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0,
      width: '100%', height: '100%',
      zIndex: 0, display: 'block'
    }} />
  )
}

// ── Login Page ────────────────────────────────────────────────
export default function Login({ onLogin }) {
  const [tab, setTab]       = useState('admin')
  const [form, setForm]     = useState({ username: '', email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = tab === 'admin'
      ? await loginAdmin(form.username, form.password)
      : await loginUser(form.email, form.password)
    if (result.error) { setError(result.error); setLoading(false); return }
    const stored = JSON.parse(sessionStorage.getItem('session'))
    onLogin(stored)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>

      {/* 3D Night Sky Canvas */}
      <NightSky />

      {/* Glassmorphism Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 400,
        margin: '0 20px',
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 24,
        padding: '40px 36px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 52, lineHeight: 1 }}>🌙</div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: 'white',
            margin: '10px 0 4px', letterSpacing: '-0.5px'
          }}>Ramadan</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
            Schedule Manager — Sign in to continue
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex', background: 'rgba(0,0,0,0.3)',
          borderRadius: 10, padding: 4, marginBottom: 24, gap: 4
        }}>
          {['admin', 'user'].map(t => (
            <button key={t} type="button"
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '9px 0', border: 'none', borderRadius: 7,
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
                background: tab === t ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: tab === t ? 'white' : 'rgba(255,255,255,0.45)',
                backdropFilter: tab === t ? 'blur(10px)' : 'none',
              }}>
              {t === 'admin' ? '🔐 Admin' : '👤 Employee'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {tab === 'admin' ? (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
                Username
              </label>
              <input
                type="text"
                placeholder="Admin username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required autoFocus
                style={inputStyle}
              />
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Your work email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required autoFocus
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
              color: '#fca5a5', borderRadius: 8, padding: '10px 14px',
              fontSize: 13, marginBottom: 16
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px',
            background: loading ? 'rgba(5,150,105,0.5)' : 'rgba(5,150,105,0.85)',
            color: 'white', border: '1px solid rgba(5,150,105,0.5)',
            borderRadius: 10, fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(5,150,105,0.3)',
          }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          رمضان كريم ✨
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 8, fontSize: 14, color: 'white',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}