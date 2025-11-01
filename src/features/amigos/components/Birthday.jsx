import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Birthday.module.css'

// 🎂 Mock data temporal (modo diseño)
const mockUsers = [
  {
    id: '1',
    nombre: 'Lucía',
    apellido: 'Fernández',
    avatar: 'https://i.pravatar.cc/50?img=1',
    fechaNacimientoUsuario: '1995-10-31',
  },
  {
    id: '2',
    nombre: 'Carlos',
    apellido: 'Muñoz',
    avatar: 'https://i.pravatar.cc/50?img=2',
    fechaNacimientoUsuario: '1990-10-29',
  },
  {
    id: '3',
    nombre: 'Daniela',
    apellido: 'Ruiz',
    avatar: 'https://i.pravatar.cc/50?img=3',
    fechaNacimientoUsuario: '1998-11-15',
  },
  {
    id: '4',
    nombre: 'Joel',
    apellido: 'Benítez',
    avatar: 'https://i.pravatar.cc/300?img=4',
    fechaNacimientoUsuario: '1993-12-02',
  },
  {
    id: '5',
    nombre: 'Fabián',
    apellido: 'Gómez',
    avatar: 'https://i.pravatar.cc/301?img=5',
    fechaNacimientoUsuario: '1991-10-30',
  },
]

export default function Birthday() {
  const navigate = useNavigate()
  const [monthOffset, setMonthOffset] = useState(0)

  const normalize = (u) => {
    const displayName = `${u.nombre} ${u.apellido}`.trim()
    const avatar = u.avatar || '/avatars/default-avatar.png'
    const dob = u.fechaNacimientoUsuario || null
    const id = u.id
    return { ...u, id, displayName, avatar, dob }
  }

  const normalized = useMemo(() => mockUsers.map(normalize), [])
  const today = useMemo(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t }, [])
  const diffDays = (d1, d2) => Math.floor((d1 - d2) / (24 * 60 * 60 * 1000))

  const withParsed = normalized.map(u => {
    if (!u.dob) return { ...u, date: null }
    const d = new Date(u.dob)
    return { ...u, date: d }
  })

  const todays = withParsed.filter(u => u.date && u.date.getDate() === today.getDate() && u.date.getMonth() === today.getMonth())

  const recent = withParsed.filter(u => {
    if (!u.date) return false
    const dThisYear = new Date(today.getFullYear(), u.date.getMonth(), u.date.getDate())
    const diff = diffDays(dThisYear, today)
    return diff >= -2 && diff < 0
  })

  const targetMonth = (today.getMonth() + monthOffset) % 12
  const upcomingAll = withParsed.filter(u => u.date && u.date.getMonth() === targetMonth)

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

  const handleProfile = (id) => navigate(`/perfil/${id}`)
  const handleMessage = (id) => navigate(`/mensajes/user:${id}`)
  const monthLabel = (offset) => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1)
    return d.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
  }

  return (
    <div className={styles.container}>
      {todays.length > 0 && (
        <section className={styles.card} aria-label="Cumpleaños de hoy">
          <h4 className={styles.cardTitle}>Cumpleaños de hoy</h4>
          <div className={styles.list}>
            {todays.map(u => (
              <article key={u.id} className={styles.item} onClick={() => handleProfile(u.id)} role="button" tabIndex={0}>
                <img src={u.avatar} alt={u.displayName} className={styles.avatar}
                  onError={e => { e.currentTarget.src = '/avatars/default-avatar.png' }} />
                <div className={styles.info}>
                  <div className={styles.name}>{u.displayName}</div>
                  <div className={styles.date}>{formatDate(u.date)} · {calcAge(u.date)} años</div>
                </div>
                <div className={styles.actions}>
                  <button className={styles.msgBtn} onClick={(e) => { e.stopPropagation(); handleMessage(u.id) }}>
                    Enviar mensaje
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className={styles.card} aria-label="Cumpleaños recientes">
          <h4 className={styles.cardTitle}>Cumpleaños recientes</h4>
          <div className={styles.list}>
            {recent.map(u => (
              <article key={u.id} className={styles.item} onClick={() => handleProfile(u.id)} role="button" tabIndex={0}>
                <img src={u.avatar} alt={u.displayName} className={styles.avatar}
                  onError={e => { e.currentTarget.src = '/avatars/default-avatar.png' }} />
                <div className={styles.info}>
                  <div className={styles.name}>{u.displayName}</div>
                  <div className={styles.date}>{formatDate(u.date)} · {calcAge(u.date)} años</div>
                </div>
                <div className={styles.actions}>
                  <button className={styles.msgBtn} onClick={(e) => { e.stopPropagation(); handleMessage(u.id) }}>
                    Enviar mensaje
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className={styles.card} aria-label="Próximos cumpleaños">
        <div className={styles.cardHeader}>
          <h4 className={styles.cardTitle}>Próximos cumpleaños</h4>
          <div className={styles.controls}>
            <button className={styles.ctrlBtn} onClick={() => setMonthOffset(m => m - 1)}>‹</button>
            <div className={styles.monthLabel}>{monthLabel(monthOffset)}</div>
            <button className={styles.ctrlBtn} onClick={() => setMonthOffset(m => m + 1)}>›</button>
          </div>
        </div>

        <div className={styles.list}>
          {upcomingAll.length === 0 ? (
            <div className={styles.empty}>No hay próximos cumpleaños en este mes</div>
          ) : (
            upcomingAll.map(u => (
              <article key={u.id} className={styles.item} onClick={() => handleProfile(u.id)} role="button" tabIndex={0}>
                <img src={u.avatar} alt={u.displayName} className={styles.avatar}
                  onError={e => { e.currentTarget.src = '/avatars/default-avatar.png' }} />
                <div className={styles.info}>
                  <div className={styles.name}>{u.displayName}</div>
                  <div className={styles.date}>{formatDate(u.date)} · {calcAge(u.date)} años</div>
                </div>
                <div className={styles.actions}>
                  <button className={styles.msgBtn} onClick={(e) => { e.stopPropagation(); handleMessage(u.id) }}>
                    Enviar mensaje
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
