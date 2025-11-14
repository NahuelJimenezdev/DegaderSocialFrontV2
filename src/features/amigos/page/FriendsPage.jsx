import { useState } from 'react';
import FriendsTabs from '../components/FriendsTabs';
import { FriendsSearch } from '../components/FriendsSearch'
import { FriendsList } from '../components/FriendsList'
import styles from '../styles/FriendsPage.module.css'
import Birthday from '../components/Birthday';

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('friends');
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
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
        <FriendsTabs birthdaysTodayCount={3} onChange={handleTabChange} />
        
        <div className={styles.content}>
          {activeTab === 'friends' && <div><FriendsList /></div>}
          {activeTab === 'birthdays' && <div><Birthday /></div>}
          {activeTab === 'city' && <div>Amigos por ciudaaaaad</div>}
        </div>
      </div>
    </div>
  )
}
