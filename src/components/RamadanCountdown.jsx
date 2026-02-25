import { useState, useEffect } from 'react'

export default function RamadanCountdown() {
  const [info, setInfo] = useState(null)

  useEffect(() => {
    // Ramadan 2026: February 18 - March 19
    const start = new Date('2026-02-18')
    const end   = new Date('2026-03-19')
    const now   = new Date()

    if (now < start) {
      const days = Math.ceil((start - now) / (1000 * 60 * 60 * 24))
      setInfo({ type: 'before', days })
    } else if (now <= end) {
      const day      = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1
      const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
      setInfo({ type: 'during', day, daysLeft })
    } else {
      setInfo({ type: 'after' })
    }
  }, [])

  if (!info) return null

  return (
    <div className="ramadan-countdown">
      <div className="countdown-left">
        <div className="countdown-moon">🌙</div>
        <div>
          {info.type === 'before' && (
            <>
              <div className="countdown-title">Ramadan starts in</div>
              <div className="countdown-number">{info.days} days</div>
            </>
          )}
          {info.type === 'during' && (
            <>
              <div className="countdown-title">Ramadan Day {info.day} · {info.daysLeft} days remaining</div>
              <div className="countdown-sub">رمضان كريم — Ramadan Kareem</div>
            </>
          )}
          {info.type === 'after' && (
            <>
              <div className="countdown-title">Ramadan 2026 has ended</div>
              <div className="countdown-sub">عيد مبارك — Eid Mubarak 🌟</div>
            </>
          )}
        </div>
      </div>

      {info.type === 'during' && (
        <div className="countdown-progress-wrap">
          <div className="countdown-progress">
            <div
              className="countdown-progress-bar"
              style={{ width: `${(info.day / 30) * 100}%` }}
            />
          </div>
          <div className="countdown-progress-label">Day {info.day} of 30</div>
        </div>
      )}
    </div>
  )
}