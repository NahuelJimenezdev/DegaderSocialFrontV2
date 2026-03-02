import ProgressiveImage from '../../../shared/components/ProgressiveImage/ProgressiveImage'

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
      </div>
    </article>
  )
}

export default BirthdayCard


