import styles from '../styles/Birthday.module.css'
import BirthdayCard from './BirthdayCard'

const BirthdaySection = ({
  title,
  users,
  formatDate,
  calcAge,
  onProfileClick,
  onMessageClick,
  emptyMessage,
  headerControls
}) => {
  return (
    <section className={styles.card} aria-label={title}>
      <div className={styles.cardHeader}>
        <h4 className={styles.cardTitle}>{title}</h4>
        {headerControls && <div className={styles.controls}>{headerControls}</div>}
      </div>

      <div className={styles.list}>
        {users.length === 0 ? (
          emptyMessage && <div className={styles.empty}>{emptyMessage}</div>
        ) : (
          users.map(user => (
            <BirthdayCard
              key={user.id}
              user={user}
              formatDate={formatDate}
              calcAge={calcAge}
              onProfileClick={onProfileClick}
              onMessageClick={onMessageClick}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default BirthdaySection


