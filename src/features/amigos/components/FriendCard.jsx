import { MessageSquare, MoreHorizontal, Cake } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/FriendsPage.module.css'
import { getUserAvatar } from '../../../shared/utils/avatarUtils'

export const FriendCard = ({ friend }) => {
  const navigate = useNavigate()
  const fullName = `${friend?.nombres?.primero || ''} ${friend?.apellidos?.primero || ''}`.trim() || 'Usuario';
  const avatarUrl = getUserAvatar(friend);

  const handleMessageClick = (e) => {
    e.stopPropagation()
    navigate(`/mensajes?userId=${friend._id}`)
  }

  // Calcular si es el cumpleaños hoy
  const isBirthdayToday = () => {
    if (!friend?.personal?.fechaNacimiento) {
      console.log('🎂 Sin fecha de nacimiento para:', fullName);
      return false;
    }

    const today = new Date();
    const birthDate = new Date(friend.personal.fechaNacimiento);

    // Usar UTC para evitar problemas de zona horaria
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const birthMonth = birthDate.getUTCMonth();
    const birthDay = birthDate.getUTCDate();

    console.log('🎂 Verificando cumpleaños:', {
      nombre: fullName,
      fechaNacimiento: friend.personal.fechaNacimiento,
      birthDateISO: birthDate.toISOString(),
      todayMonth,
      birthMonth,
      todayDay,
      birthDay,
      matches: todayMonth === birthMonth && todayDay === birthDay
    });

    return todayMonth === birthMonth && todayDay === birthDay;
  };

  // Determinar si está online (basado en última conexión)
  const isOnline = () => {
    if (!friend?.ultimaConexion) return false;

    const lastConnection = new Date(friend.ultimaConexion);
    const now = new Date();
    const diffMinutes = (now - lastConnection) / (1000 * 60);

    // Consideramos online si se conectó en los últimos 5 minutos
    return diffMinutes <= 5;
  };

  const online = isOnline();
  const hasBirthday = isBirthdayToday();

  return (
    <div className={styles.item}>
      <div className={styles.avatarWrap}>
        <img
          src={avatarUrl}
          alt={fullName}
          className={styles.avatar}
        />
        {online && <span className={styles.onlineBadge} />}
      </div>

      <div className={styles.meta}>
        <div className={styles.nameRow}>
          <div className={styles.name}>{fullName}</div>
          {hasBirthday && (
            <div className={styles.birthday} title="¡Es su cumpleaños hoy!">
              <Cake size={16} />
            </div>
          )}
        </div>

        <div className={styles.subtitle}>
          <div className={online ? styles.onlineText : styles.offlineText}>
            {online ? 'Online' : 'Offline'}
          </div>
          {(friend?.personal?.ubicacion?.ciudad || friend?.personal?.ubicacion?.pais) && (
            <div className={styles.cityInfo}>
              {friend.personal.ubicacion.ciudad && friend.personal.ubicacion.pais
                ? `${friend.personal.ubicacion.ciudad}, ${friend.personal.ubicacion.pais}`
                : friend.personal.ubicacion.ciudad || friend.personal.ubicacion.pais}
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={handleMessageClick} title="Enviar mensaje">
          <MessageSquare size={18} />
        </button>
        <div className={styles.menuWrap}>
          <button className={styles.iconBtn}><MoreHorizontal size={18} /></button>
        </div>
      </div>
    </div>
  )
}
