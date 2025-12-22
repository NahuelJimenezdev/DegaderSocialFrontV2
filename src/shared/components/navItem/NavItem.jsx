import { Link, useLocation } from 'react-router-dom'
import styles from './styles/NavItem.module.css'

const NavItem = ({to, icon: Icon, label }) => {
  const {pathname} = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className={`${styles.navLink} ${active ? styles.active : ''}`}>
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  )
}

export default NavItem

