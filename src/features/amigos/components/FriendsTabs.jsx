import { useState } from 'react';
import styles from '../styles/FriendsPage.module.css';
import { Cake } from 'lucide-react';

const TABS = [
  { id: 'friends', label: 'Amigos' },
  { id: 'birthdays', label: 'Cumpleaños' },
  { id: 'city', label: 'Ciudad Actual' },
];

export default function FriendsTabs({ birthdaysTodayCount = 0, onChange }) {
  const [activeTab, setActiveTab] = useState('friends');
  const [badgePulse, setBadgePulse] = useState(false);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onChange?.(tabId); // Notifica al componente padre si se provee
    setBadgePulse(true);
    setTimeout(() => setBadgePulse(false), 420);
  };

  return (
    <div className={styles.tabsRow} role="tablist" aria-label="Filtros de amigos">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={activeTab === tab.id ? styles.tabActive : styles.tab}
          onClick={() => handleTabChange(tab.id)}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {tab.label}
            {tab.id === 'birthdays' && birthdaysTodayCount > 0 && (
              <span className={`${styles.tabBadge} ${badgePulse ? styles.tabBadgePulse : ''}`} aria-hidden>
                <span className={styles.tabBadgeCount}>{birthdaysTodayCount}</span>
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
