import { useEffect } from 'react'

export default function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT'    ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.tagName === 'SELECT') return
      const key = e.key.toLowerCase()
      if (shortcuts[key]) {
        e.preventDefault()
        shortcuts[key]()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts])
}