import { useState, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import FriendsTabs from '../components/FriendsTabs';
import { FriendsSearch } from '../components/FriendsSearch'
import { FriendsList } from '../components/FriendsList'
import { CityFriends } from '../components/CityFriends'
import friendshipService from '../../../api/friendshipService'
import styles from '../styles/FriendsPage.module.css'
import Birthday from '../components/Birthday';

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
    <div className={styles.container}>
      <div className={styles.friendsCard}><div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-5xl text-primary">group</span>
        <div className="flex flex-col">
          <p className="text-[#1F2937] dark:text-[#F9FAFB] text-4xl font-black leading-tight tracking-[-0.033em]">
            Mis Amigos
          </p>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-base font-normal leading-normal">
            Conecta, comparte y mantente al día con tus amigos
          </p>
        </div>
      </div>


        <FriendsSearch />
        <FriendsTabs birthdaysTodayCount={birthdayCount} onChange={handleTabChange} />
        
        <div className={styles.content}>
          {activeTab === 'friends' && <div><FriendsList /></div>}
          {activeTab === 'birthdays' && <div><Birthday /></div>}
          {activeTab === 'city' && <div><CityFriends /></div>}
        </div>
      </div>
    </div>
  )
}



