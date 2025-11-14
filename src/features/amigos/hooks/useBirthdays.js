import { useMemo } from 'react'
import mockUsers from '../../../shared/data/users/mockBirthdays.json'

export const useBirthdays = (monthOffset = 0) => {
  // Normalizar datos de usuario
  const normalize = (u) => {
    const displayName = `${u.nombre} ${u.apellido}`.trim()
    const avatar = u.avatar || '/avatars/default-avatar.png'
    const dob = u.fechaNacimientoUsuario || null
    const id = u.id
    return { ...u, id, displayName, avatar, dob }
  }

  const normalized = useMemo(() => mockUsers.map(normalize), [])

  const today = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return t
  }, [])

  const diffDays = (d1, d2) => Math.floor((d1 - d2) / (24 * 60 * 60 * 1000))

  const withParsed = normalized.map(u => {
    if (!u.dob) return { ...u, date: null }
    const d = new Date(u.dob)
    return { ...u, date: d }
  })

  // Cumpleaños de hoy
  const todays = withParsed.filter(
    u => u.date && u.date.getDate() === today.getDate() && u.date.getMonth() === today.getMonth()
  )

  // Cumpleaños recientes (últimos 2 días)
  const recent = withParsed.filter(u => {
    if (!u.date) return false
    const dThisYear = new Date(today.getFullYear(), u.date.getMonth(), u.date.getDate())
    const diff = diffDays(dThisYear, today)
    return diff >= -2 && diff < 0
  })

  // Próximos cumpleaños del mes seleccionado
  const targetMonth = (today.getMonth() + monthOffset) % 12
  const upcomingAll = withParsed.filter(u => u.date && u.date.getMonth() === targetMonth)

  // Funciones de formato
  const formatDate = (d) => {
    if (!d) return ''
    try {
      const options = { day: 'numeric', month: 'long', year: 'numeric' }
      return d.toLocaleDateString('es-ES', options)
    } catch {
      return d.toISOString().slice(0, 10)
    }
  }

  const calcAge = (d) => {
    if (!d) return ''
    const now = new Date()
    let age = now.getFullYear() - d.getFullYear()
    const m = now.getMonth() - d.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
    return age
  }

  const monthLabel = (offset) => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1)
    return d.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
  }

  return {
    todays,
    recent,
    upcomingAll,
    formatDate,
    calcAge,
    monthLabel
  }
}
