import styles from '../styles/Birthday.module.css'
import { getUserAvatar } from '../../../shared/utils/avatarUtils'

const BirthdayCard = ({ user, formatDate, calcAge, onProfileClick, onMessageClick }) => {
  const avatarUrl = getUserAvatar(user)

  return (
    <article
      key={user.id}
      className={styles.item}
      onClick={() => onProfileClick(user.id)}
      role="button"
      tabIndex={0}
    >
      <img
        src={avatarUrl}
        alt={user.displayName}
        className={styles.avatar}
        onError={e => { e.currentTarget.src = '/avatars/default-avatar.png' }}
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
      </div>
    </article>
  )
}

export default BirthdayCard


