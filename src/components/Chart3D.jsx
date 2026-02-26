import { useEffect, useRef } from 'react'

export default function Chart3D({ users }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    canvas.width  = 600
    canvas.height = 300
    let animId

    const depts = ['Import', 'Export', 'NL', 'Administration']
    const colors = {
      Import:         { top: '#38bdf8', side: '#0369a1', front: '#0ea5e9' },
      Export:         { top: '#fcd34d', side: '#b45309', front: '#f59e0b' },
      NL:             { top: '#67e8f9', side: '#0e7490', front: '#06b6d4' },
      Administration: { top: '#c4b5fd', side: '#6d28d9', front: '#8b5cf6' },
    }

    const data = depts.map(dept => ({
      dept,
      early: users.filter(u => u.department === dept && u.schedule === '8-4').length,
      late:  users.filter(u => u.department === dept && u.schedule === '9-5').length,
      total: users.filter(u => u.department === dept).length,
    }))

    const maxVal  = Math.max(...data.map(d => d.total), 1)
    const BW      = 50
    const BD      = 18
    const BH_MAX  = 180
    const baseY   = 240
    const startX  = 60
    let animProgress = 0

    const draw3DBar = (x, barH, color, label, val) => {
      if (barH <= 0) return
      const y = baseY - barH

      ctx.fillStyle = color.front
      ctx.fillRect(x, y, BW, barH)

      ctx.beginPath()
      ctx.moveTo(x,           y)
      ctx.lineTo(x + BD,      y - BD)
      ctx.lineTo(x + BD + BW, y - BD)
      ctx.lineTo(x + BW,      y)
      ctx.closePath()
      ctx.fillStyle = color.top
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(x + BW,      y)
      ctx.lineTo(x + BW + BD, y - BD)
      ctx.lineTo(x + BW + BD, baseY - BD)
      ctx.lineTo(x + BW,      baseY)
      ctx.closePath()
      ctx.fillStyle = color.side
      ctx.fill()

      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth   = 1
      ctx.strokeRect(x, y, BW, barH)

      if (val > 0) {
        ctx.fillStyle = 'white'
        ctx.font      = 'bold 13px Segoe UI'
        ctx.textAlign = 'center'
        ctx.fillText(val, x + BW / 2, y - BD - 8)
      }

      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.font      = '11px Segoe UI'
      ctx.textAlign = 'center'
      ctx.fillText(label, x + BW / 2, baseY + 16)
    }

    const draw = () => {
      ctx.clearRect(0, 0, 600, 300)

      const bg = ctx.createLinearGradient(0, 0, 0, 300)
      bg.addColorStop(0, '#0f172a')
      bg.addColorStop(1, '#020617')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, 600, 300)

      for (let i = 0; i <= 5; i++) {
        const gy = baseY - (i / 5) * BH_MAX
        ctx.beginPath()
        ctx.moveTo(40, gy)
        ctx.lineTo(580, gy)
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'
        ctx.lineWidth   = 1
        ctx.stroke()
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.font      = '10px Segoe UI'
        ctx.textAlign = 'right'
        ctx.fillText(Math.round((i / 5) * maxVal), 35, gy + 4)
      }

      ctx.beginPath()
      ctx.moveTo(40, baseY)
      ctx.lineTo(580, baseY)
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'
      ctx.lineWidth   = 1.5
      ctx.stroke()

      animProgress = Math.min(animProgress + 0.025, 1)
      const ease   = 1 - Math.pow(1 - animProgress, 3)

      data.forEach((d, i) => {
        const x     = startX + i * 130
        const color = colors[d.dept]

        const earlyH = (d.early / maxVal) * BH_MAX * ease
        draw3DBar(x, earlyH, color, '08:00', d.early)

        const lateColor = {
          top:   color.top   + '99',
          side:  color.side  + '99',
          front: color.front + '99',
        }
        const lateH = (d.late / maxVal) * BH_MAX * ease
        draw3DBar(x + 60, lateH, lateColor, '09:00', d.late)
      })

      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.font      = 'bold 14px Segoe UI'
      ctx.textAlign = 'left'
      ctx.fillText('📊 Schedule Distribution by Department', 40, 24)

      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.font      = '11px Segoe UI'
      ctx.fillText('■ 08:00→16:00', 380, 24)
      ctx.fillText('■ 09:00→17:00 (faded)', 460, 24)

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [users])

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: 300, display: 'block' }} />
    </div>
  )
}