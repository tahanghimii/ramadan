const COLORS = [
  '#ef4444','#f97316','#f59e0b','#10b981',
  '#06b6d4','#3b82f6','#8b5cf6','#ec4899',
  '#14b8a6','#0ea5e9','#a78bfa','#fb7185',
]

export function getAvatarColor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

export function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}