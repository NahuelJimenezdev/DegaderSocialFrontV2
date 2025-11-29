import { useState, useEffect, useMemo } from 'react'
import { Search, MapPin } from 'lucide-react'
import { FriendCard } from './FriendCard'
import { FriendsEmptyState } from './FriendsEmptyState'
import friendshipService from '../../../api/friendshipService'
import styles from '../styles/FriendsPage.module.css'

export const CityFriends = () => {
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await friendshipService.getFriends()
        const friendsList = response.data || response || []
        setFriends(friendsList)
      } catch (err) {
        console.error('❌ Error al obtener amigos:', err)
        setError('Error al cargar amigos')
      } finally {
        setLoading(false)
      }
    }
    fetchFriends()
  }, [])

  // Obtener lista única de ubicaciones (ciudades y países)
  const locations = useMemo(() => {
    const locationSet = new Set()

    friends.forEach(friend => {
      const ciudad = friend?.personal?.ubicacion?.ciudad
      const pais = friend?.personal?.ubicacion?.pais
      const estado = friend?.personal?.ubicacion?.estado

      if (ciudad) locationSet.add(ciudad)
      if (pais) locationSet.add(pais)
      if (estado) locationSet.add(estado)
    })

    return Array.from(locationSet).sort()
  }, [friends])

  // Filtrar amigos por búsqueda y ubicación seleccionada
  const filteredFriends = useMemo(() => {
    return friends.filter(friend => {
      const ciudad = friend?.personal?.ubicacion?.ciudad?.toLowerCase() || ''
      const pais = friend?.personal?.ubicacion?.pais?.toLowerCase() || ''
      const estado = friend?.personal?.ubicacion?.estado?.toLowerCase() || ''
      const search = searchTerm.toLowerCase()

      // Filtrar por búsqueda
      const matchesSearch =
        ciudad.includes(search) ||
        pais.includes(search) ||
        estado.includes(search)

      // Filtrar por ubicación seleccionada
      const matchesLocation =
        selectedLocation === 'all' ||
        ciudad === selectedLocation.toLowerCase() ||
        pais === selectedLocation.toLowerCase() ||
        estado === selectedLocation.toLowerCase()

      return matchesSearch && matchesLocation
    })
  }, [friends, searchTerm, selectedLocation])

  // Agrupar amigos por ubicación
  const groupedByLocation = useMemo(() => {
    const groups = {}

    filteredFriends.forEach(friend => {
      const ciudad = friend?.personal?.ubicacion?.ciudad
      const pais = friend?.personal?.ubicacion?.pais

      // Usar ciudad si existe, sino país, sino "Sin ubicación"
      const location = ciudad || pais || 'Sin ubicación'

      if (!groups[location]) {
        groups[location] = []
      }
      groups[location].push(friend)
    })

    return groups
  }, [filteredFriends])

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por ciudad, país o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Selector de ubicación */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todas las ubicaciones</option>
          {locations.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Lista agrupada por ubicación */}
      {Object.keys(groupedByLocation).length === 0 ? (
        <FriendsEmptyState />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByLocation)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([location, locationFriends]) => (
              <div key={location} className="space-y-3">
                {/* Header de ubicación */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <MapPin size={18} className="text-primary" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {location}
                  </h3>
                  <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                    {locationFriends.length} {locationFriends.length === 1 ? 'amigo' : 'amigos'}
                  </span>
                </div>

                {/* Lista de amigos en esta ubicación */}
                <div className={styles.list}>
                  {locationFriends.map(friend => (
                    <FriendCard key={friend._id} friend={friend} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
