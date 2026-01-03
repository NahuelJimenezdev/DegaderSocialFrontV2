import { Link, useLocation } from 'react-router-dom'
import styles from './styles/NavItem.module.css'

const NavItem = ({ to, icon: Icon, label, badge }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className={`${styles.navLink} ${active ? styles.active : ''}`}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Icon size={18} />
        {badge > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            fontSize: '10px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span>{label}</span>
    </Link>
  )
}

export default NavItem

