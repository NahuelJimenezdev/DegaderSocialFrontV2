import { getUserAvatar } from '../../../shared/utils/avatarUtils'
import ProgressiveImage from '../../../shared/components/ProgressiveImage/ProgressiveImage'
import styles from '../styles/Birthday.module.css'
import { Gift } from 'lucide-react'

const BirthdayCard = ({ user, formatDate, calcAge, onProfileClick, onMessageClick, onCardSend }) => {
  const avatarUrl = getUserAvatar(user)

  return (
    <article
      key={user.id}
      className={styles.item}
      onClick={() => onProfileClick(user.id)}
      role="button"
      tabIndex={0}
    >
      <ProgressiveImage
        src={avatarUrl}
        medium={user?.social?.fotoPerfilObj?.medium}
        large={user?.social?.fotoPerfilObj?.large}
        blurHash={user?.social?.fotoPerfilObj?.blurHash}
        alt={user.displayName}
        className={styles.avatar}
        style={{ clipPath: 'circle(50%)' }}
      />
      <div className={styles.info}>
        <div className={styles.name}>{user.displayName}</div>
        <div className={styles.date}>
          {formatDate(user.date)} · {calcAge(user.date)} años
        </div>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.msgBtn}
          onClick={(e) => {
            e.stopPropagation()
            onMessageClick(user.id)
          }}
        >
          Enviar mensaje
        </button>
        <button
          className={`${styles.msgBtn} bg-indigo-600 hover:bg-indigo-700 text-white border-none flex items-center justify-center gap-2`}
          onClick={(e) => {
            e.stopPropagation()
            onCardSend(user)
          }}
        >
          <Gift size={16} />
          Enviar Tarjeta
        </button>
      </div>
    </article>
  )
}

export default BirthdayCard


