import { useMemo, useState, useEffect } from 'react'
import { logger } from '../../../shared/utils/logger';
import friendshipService from '../../../api/friendshipService'

export const useBirthdays = (monthOffset = 0) => {
  const [friends, setFriends] = useState([])

  // Obtener amigos del backend
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await friendshipService.getFriends()
        const friendsList = response.data || response || []
        setFriends(friendsList)
      } catch (error) {
        logger.error('Error al obtener amigos para cumpleaños:', error)
        setFriends([])
      }
    }
    fetchFriends()
  }, [])

  // Normalizar datos de usuario (UserV2 -> formato compatible)
  const normalize = (u) => {
    const displayName = `${u.nombres?.primero || ''} ${u.apellidos?.primero || ''}`.trim() || 'Usuario'
    const avatar = u.social?.fotoPerfil || '/avatars/default-avatar.png'
    const dob = u.personal?.fechaNacimiento || null
    const id = u._id
    return { ...u, id, displayName, avatar, dob }
  }

  const normalized = useMemo(() => friends.map(normalize), [friends])

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

  // Cumpleaños de hoy (usando UTC para coincidir con el backend)
  const todays = withParsed.filter(
    u => u.date && u.date.getUTCDate() === today.getDate() && u.date.getUTCMonth() === today.getMonth()
  )

  // Cumpleaños recientes (últimos 2 días, pero NO hoy)
  const recent = withParsed.filter(u => {
    if (!u.date) return false
    // Usar UTC para consistencia
    const dThisYear = new Date(Date.UTC(today.getFullYear(), u.date.getUTCMonth(), u.date.getUTCDate()))
    const diff = diffDays(today, dThisYear)
    return diff > 0 && diff <= 2
  })

  // Próximos cumpleaños del mes seleccionado (usando UTC)
  const targetMonth = (today.getMonth() + monthOffset) % 12
  const upcomingAll = withParsed.filter(u => {
    if (!u.date || u.date.getUTCMonth() !== targetMonth) return false

    // Si es el mes actual (monthOffset === 0), excluir hoy y pasados
    if (monthOffset === 0) {
      const dThisYear = new Date(Date.UTC(today.getFullYear(), u.date.getUTCMonth(), u.date.getUTCDate()))
      const diff = diffDays(dThisYear, today)
      // Solo mostrar cumpleaños futuros (diff < 0 significa que el cumpleaños ya pasó)
      return diff < 0
    }

    // Para otros meses, mostrar todos
    return true
  })

  // Funciones de formato (usando UTC para evitar problemas de zona horaria)
  const formatDate = (d) => {
    if (!d) return ''
    try {
      const options = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }
      return d.toLocaleDateString('es-ES', options)
    } catch {
      return d.toISOString().slice(0, 10)
    }
  }

  const calcAge = (d) => {
    if (!d) return ''
    const now = new Date()
    const birthYear = d.getUTCFullYear()
    const birthMonth = d.getUTCMonth()
    const birthDay = d.getUTCDate()

    // Calcular edad base
    let age = now.getFullYear() - birthYear

    // Ajustar si aún no ha cumplido años este año
    const hasHadBirthdayThisYear =
      now.getMonth() > birthMonth ||
      (now.getMonth() === birthMonth && now.getDate() >= birthDay)

    if (!hasHadBirthdayThisYear) {
      age--
    }

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



