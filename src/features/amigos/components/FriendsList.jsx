import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
import styles from '../styles/FriendsPage.module.css'
import { FriendCard } from './FriendCard'
import { FriendsEmptyState } from './FriendsEmptyState'
import friendshipService from '../../../api/friendshipService'
import { useOnlineUsers } from '../../../contexts/OnlineUsersContext'

export const FriendsList = () => {
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const onlineUsers = useOnlineUsers() // Usar contexto global

  const fetchFriends = async () => {
    try {
      const response = await friendshipService.getFriends()
      console.log('📥 Respuesta completa de amigos:', response)

      // friendshipService ya devuelve response.data, que contiene { success: true, message: "...", data: [...] }
      const friendsList = response.data || response || []
      console.log('👥 Lista de amigos procesada:', friendsList)

      // Log detallado de cada amigo para debugging
      friendsList.forEach((friend, index) => {
        console.log(`👤 Amigo ${index + 1}:`, {
          nombre: `${friend?.nombres?.primero} ${friend?.apellidos?.primero}`,
          fechaNacimiento: friend?.personal?.fechaNacimiento,
          ubicacion: friend?.personal?.ubicacion,
          personal: friend?.personal
        });
      })

      // Ordenar: primero fijados (no bloqueados), luego favoritos (no bloqueados), luego el resto alfabéticamente
      const sortedFriends = [...friendsList].sort((a, b) => {
        // 1. Pinned (si no estÃ¡ bloqueado)
        const isPinnedA = a.isPinned && !a.isBlocked;
        const isPinnedB = b.isPinned && !b.isBlocked;
        if (isPinnedA && !isPinnedB) return -1;
        if (!isPinnedA && isPinnedB) return 1;

        // 2. Favorites (si no estÃ¡ bloqueado)
        const isFavA = a.isFavorite && !a.isBlocked;
        const isFavB = b.isFavorite && !b.isBlocked;
        if (isFavA && !isFavB) return -1;
        if (!isFavA && isFavB) return 1;

        // 3. AlfabÃ©tico por nombre completo
        const nameA = `${a.nombres?.primero} ${a.apellidos?.primero}`.toLowerCase();
        const nameB = `${b.nombres?.primero} ${b.apellidos?.primero}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });

      setFriends(Array.isArray(sortedFriends) ? sortedFriends : [])
    } catch (err) {
      console.error('❌ Error al obtener amigos:', err)
      console.error('❌ Detalles del error:', err.response?.data || err.message)
      setError('Error al cargar amigos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFriends()
  }, [])

  if (loading) return <div className="flex justify-center p-8"><Loader className="animate-spin text-primary" /></div>
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>

  if (friends.length === 0) {
    return <FriendsEmptyState />
  }

  return (
    <div className={styles.list}>
      {friends.map((friend) => (
        <FriendCard
          key={friend._id}
          friend={friend}
          onlineUsers={onlineUsers}
          onUpdate={fetchFriends}
        />
      ))}
    </div>
  )
}
