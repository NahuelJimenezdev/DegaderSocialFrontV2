import { Search } from 'lucide-react'
import styles from '../styles/FriendsPage.module.css'

export const FriendsSearch = () => (
  <div className={styles.searchRow}>
    <Search className={styles.searchIcon} size={18} />
    <input
      className={styles.searchInput}
      type="text"
      placeholder="Buscar por nombre..."
      disabled
    />
  </div>
)
