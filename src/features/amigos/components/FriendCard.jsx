import { MessageSquare, MoreHorizontal, Cake } from 'lucide-react'
import styles from '../styles/FriendsPage.module.css'

export const FriendCard = ({ friend }) => (
  <div className={styles.item}>
    <div className={styles.avatarWrap}>
      <img
        src={friend.avatar || `https://i.pravatar.cc/150?u=${friend.id}`}
        alt={friend.name}
        className={styles.avatar}
      />
      {friend.status === 'online' && <span className={styles.onlineBadge} />}
    </div>

    <div className={styles.meta}>
      <div className={styles.nameRow}>
        <div className={styles.name}>{friend.name}</div>
        <div className={styles.birthday}>
          <Cake size={16} />
        </div>
      </div>

      <div className={styles.subtitle}>
        <div className={friend.status === 'online' ? styles.onlineText : styles.offlineText}>
          {friend.status === 'online' ? 'Online' : 'Offline'}
        </div>
        <div className={styles.cityInfo}>Cúcuta · Norte de Santander · Colombia</div>
      </div>
    </div>

    <div className={styles.actions}>
      <button className={styles.iconBtn}><MessageSquare size={18} /></button>
      <div className={styles.menuWrap}>
        <button className={styles.iconBtn}><MoreHorizontal size={18} /></button>
      </div>
    </div>
  </div>
)
