import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
import styles from '../styles/FriendsPage.module.css'
import { FriendCard } from './FriendCard'
import { FriendsEmptyState } from './FriendsEmptyState'
import friendshipService from '../../../api/friendshipService'

export const FriendsList = () => {
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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

        setFriends(Array.isArray(friendsList) ? friendsList : [])
      } catch (err) {
        console.error('❌ Error al obtener amigos:', err)
        console.error('❌ Detalles del error:', err.response?.data || err.message)
        setError('Error al cargar amigos')
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [])

  if (loading) return <div className="flex justify-center p-8"><Loader className="animate-spin text-primary" /></div>
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>

  return (
    <div className={styles.list}>
      {friends.length > 0
        ? friends.map(friend => (
          <FriendCard key={friend._id} friend={friend} />
        ))
        : <FriendsEmptyState />}
    </div>
  )
}
