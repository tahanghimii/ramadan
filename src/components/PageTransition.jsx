import { useEffect, useState } from 'react'

export default function PageTransition({ view, children }) {
  const [displayed, setDisplayed] = useState(children)
  const [animate, setAnimate]     = useState(false)

  useEffect(() => {
    setAnimate(false)
    const t = setTimeout(() => {
      setDisplayed(children)
      setAnimate(true)
    }, 120)
    return () => clearTimeout(t)
  }, [view])

  return (
    <div className={`page-transition ${animate ? 'page-in' : 'page-out'}`}>
      {displayed}
    </div>
  )
}