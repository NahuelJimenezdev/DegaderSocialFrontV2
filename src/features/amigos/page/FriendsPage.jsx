import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { logger } from '../../../shared/utils/logger';
import FriendsTabs from '../components/FriendsTabs';
import { FriendsSearch } from '../components/FriendsSearch'
import { FriendsList } from '../components/FriendsList'
import { CityFriends } from '../components/CityFriends'
import friendshipService from '../../../api/friendshipService'
import styles from '../styles/FriendsPage.module.css'
import Birthday from '../components/Birthday';
import '../../../shared/styles/headers.style.css';
import '../../../shared/styles/components.style.css';

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('friends');
  const [birthdayCount, setBirthdayCount] = useState(0);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Calcular cumpleaños de hoy
  useEffect(() => {
    const fetchBirthdaysToday = async () => {
      try {
        const response = await friendshipService.getFriends()
        const friendsList = response.data || response || []

        // Filtrar amigos que cumplen años hoy
        const today = new Date()
        const birthdaysToday = friendsList.filter(friend => {
          if (!friend?.personal?.fechaNacimiento) return false

          const birthDate = new Date(friend.personal.fechaNacimiento)
          return (
            today.getMonth() === birthDate.getUTCMonth() &&
            today.getDate() === birthDate.getUTCDate()
          )
        })

        setBirthdayCount(birthdaysToday.length)
      } catch (error) {
        logger.error('Error al calcular cumpleaños:', error)
        setBirthdayCount(0)
      }
    }

    fetchBirthdaysToday()
  }, []);
  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header">
        {/* Icono en caja con fondo */}
        <div className="section-header__icon-box">
          <span className="material-symbols-outlined section-header__icon">
            <Users className="section-header__icon" />
          </span>
        </div>

        {/* Contenido: Título + Subtítulo */}
        <div className="section-header__content">
          <h1 className="section-header__title section-header__title--heavy">
            Mis Amigos
          </h1>
          <p className="section-header__subtitle">
            Conecta, comparte y mantente al día con tus amigos
          </p>
        </div>
      </div>

      {/* Barra de búsqueda funcional */}
      <FriendsSearch />

      {/* Tabs */}
      <FriendsTabs birthdaysTodayCount={birthdayCount} onChange={handleTabChange} />

      {/* Contenido según tab activo */}
      <div className={styles.content}>
        {activeTab === 'friends' && <div><FriendsList /></div>}
        {activeTab === 'birthdays' && <div><Birthday /></div>}
        {activeTab === 'city' && <div><CityFriends /></div>}
      </div>
    </div>
  )
}
