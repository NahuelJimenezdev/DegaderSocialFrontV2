import styles from '../styles/FriendsPage.module.css'
import { FriendCard } from './FriendCard'
import { FriendsEmptyState } from './FriendsEmptyState'
import mockFriends from '../../../shared/data/users/mockFriends.json'

export const FriendsList = () => {
  // Agregar status a los amigos (en producción vendría de la API)
  const friendsWithStatus = mockFriends.map((friend, index) => ({
    ...friend,
    name: `${friend.nombre} ${friend.apellido}`,
    status: index % 2 === 0 ? 'online' : 'offline'
  }))

  return (
    <div className={styles.list}>
      {friendsWithStatus.length > 0
        ? friendsWithStatus.map(friend => (
          <FriendCard key={friend.id} friend={friend} />
        ))
        : <FriendsEmptyState />}
    </div>
  )
}
