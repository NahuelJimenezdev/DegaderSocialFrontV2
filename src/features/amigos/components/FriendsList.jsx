import styles from '../styles/FriendsPage.module.css'
import { FriendCard } from './FriendCard'
import { FriendsEmptyState } from './FriendsEmptyState'

export const FriendsList = () => {
  // Mockup: muestra 3 cards fijas
  const mockFriends = [
    { id: 1, name: 'Carolina Matiz', status: 'online' },
    { id: 2, name: 'Carlos Muñoz', status: 'offline' },
    { id: 3, name: 'Deangel "El Feo"', status: 'online' },
  ]

  return (
    <div className={styles.list}>
      {mockFriends.length > 0
        ? mockFriends.map(friend => (
          <FriendCard key={friend.id} friend={friend} />
        ))
        : <FriendsEmptyState />}
    </div>
  )
}
