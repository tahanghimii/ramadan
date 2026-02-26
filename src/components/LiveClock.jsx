import { useState, useEffect } from 'react'

export default function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = n => String(n).padStart(2, '0')

  const hours   = pad(time.getHours())
  const minutes = pad(time.getMinutes())
  const seconds = pad(time.getSeconds())

  const day  = time.toLocaleDateString('en-GB', { weekday: 'long' })
  const date = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div className="live-clock">
      <div className="clock-time">
        <span className="clock-hm">{hours}:{minutes}</span>
        <span className="clock-seconds">{seconds}</span>
      </div>
      <div className="clock-date">
        <span className="clock-day">{day}</span>
        <span className="clock-full">{date}</span>
      </div>
    </div>
  )
}