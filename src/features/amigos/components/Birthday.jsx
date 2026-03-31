import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBirthdays } from '../hooks/useBirthdays'
import BirthdaySection from './BirthdaySection'
import styles from '../styles/Birthday.module.css'
import BirthdayPostModal from './BirthdayPostModal'
import { useAuth } from '../../../context/AuthContext'

export default function Birthday() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { todays, recent, upcomingAll, formatDate, calcAge, monthLabel } = useBirthdays(monthOffset)

  const handleProfile = (id) => navigate(`/perfil/${id}`)
  const handleMessage = (id) => navigate(`/mensajes/user:${id}`)
  const handleCardSend = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  // Controles de navegación de mes
  const monthControls = (
    <>
      <button className={styles.ctrlBtn} onClick={() => setMonthOffset(m => m - 1)}>
        ‹
      </button>
      <div className={styles.monthLabel}>{monthLabel(monthOffset)}</div>
      <button className={styles.ctrlBtn} onClick={() => setMonthOffset(m => m + 1)}>
        ›
      </button>
    </>
  )

  return (
    <div className={styles.container}>
      {/* Cumpleaños de hoy */}
      {todays.length > 0 && (
        <BirthdaySection
          title="Cumpleaños de hoy"
          users={todays}
          formatDate={formatDate}
          calcAge={calcAge}
          onProfileClick={handleProfile}
          onMessageClick={handleMessage}
          onCardSend={handleCardSend}
        />
      )}

      {/* Cumpleaños recientes */}
      {recent.length > 0 && (
        <BirthdaySection
          title="Cumpleaños recientes"
          users={recent}
          formatDate={formatDate}
          calcAge={calcAge}
          onProfileClick={handleProfile}
          onMessageClick={handleMessage}
          onCardSend={handleCardSend}
        />
      )}

      {/* Próximos cumpleaños */}
      <BirthdaySection
        title="Próximos cumpleaños"
        users={upcomingAll}
        formatDate={formatDate}
        calcAge={calcAge}
        onProfileClick={handleProfile}
        onMessageClick={handleMessage}
        onCardSend={handleCardSend}
        emptyMessage="No hay próximos cumpleaños en este mes"
        headerControls={monthControls}
      />

      <BirthdayPostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetUser={selectedUser}
        currentUser={currentUser}
      />
    </div>
  )
}


