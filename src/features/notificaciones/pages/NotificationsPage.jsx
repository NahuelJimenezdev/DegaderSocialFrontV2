import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import NotificationCard from '../components/NotificationCard';
import IglesiaNotificationCard from '../components/IglesiaNotificationCard';
import FundacionNotificationCard from '../components/FundacionNotificationCard';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import { getNombreCompleto } from '../../../shared/utils/userUtils';
import { Filter, Bell, CheckCheck, Trash2 } from 'lucide-react';
import styles from '../styles/NotificationsPage.module.css';

const NotificationsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const userId = user?._id || user?.id;
    const [filtroTipo, setFiltroTipo] = useState('todas'); // todas, amistad, grupos, eventos, etc.
    const [filtroEstado, setFiltroEstado] = useState('todas'); // todas, leidas, no_leidas
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });

    const {
        notifications,
        processedNotifications,
        markAsRead,
        handleAcceptFriend,
        handleRejectFriend,
        handleAcceptGroup,
        handleRejectGroup,
        deleteInformativeNotification,
        setNotifications,
        loading
    } = useNotifications(user);

    // Filtrar notificaciones
    const notificacionesFiltradas = notifications.filter(n => {
        // Filtro por tipo
        if (filtroTipo !== 'todas') {
            if (filtroTipo === 'amistad' && !['amistad', 'solicitud_amistad'].includes(n.tipo)) return false;
            if (filtroTipo === 'grupos' && !n.tipo.includes('grupo')) return false;
            if (filtroTipo === 'eventos' && n.tipo !== 'evento') return false;
            if (filtroTipo === 'iglesia' && !n.tipo.includes('iglesia')) return false;
            if (filtroTipo === 'fundacion' && !n.tipo.includes('fundacion')) return false;
            if (filtroTipo === 'posts' && !['like_post', 'comentario_post', 'respuesta_comentario', 'like_comentario', 'compartir_post'].includes(n.tipo)) return false;
        }

        // Filtro por estado
        if (filtroEstado === 'leidas' && !n.leido) return false;
        if (filtroEstado === 'no_leidas' && n.leido) return false;

        return true;
    });

    // Marcar todas como leídas
    const marcarTodasComoLeidas = async () => {
        const noLeidas = notifications.filter(n => !n.leido);
        for (const notif of noLeidas) {
            await markAsRead(notif._id);
        }
    };

    // Handlers de acciones
    const onAcceptFriendAction = async (notificacion) => {
        if (notificacion.tipo !== 'amistad' && notificacion.tipo !== 'solicitud_amistad') {
            return;
        }
        if (!notificacion.mensaje?.includes('te envió una solicitud') && !notificacion.contenido?.includes('te envió una solicitud')) {
            setAlertConfig({ isOpen: true, variant: 'warning', message: 'Esta notificación no se puede procesar como solicitud entrante.' });
            return;
        }
        try {
            await handleAcceptFriend(notificacion);
        } catch (error) {
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al aceptar la solicitud' });
        }
    };

    const onRejectFriendAction = async (notificacion) => {
        try {
            await handleRejectFriend(notificacion);
        } catch (error) {
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al rechazar la solicitud' });
        }
    };

    const handleProfileClick = async (notificacion) => {
        const typesToDelete = [
            'solicitud_iglesia_aprobada',
            'solicitud_iglesia_rechazada',
            'solicitud_fundacion_aprobada',
            'solicitud_fundacion_rechazada',
            'solicitud_grupo_aprobada',
            'solicitud_grupo_rechazada',
            'solicitud_rechazada',
            'solicitud_cancelada'
        ];

        if (typesToDelete.includes(notificacion.tipo)) {
            await deleteInformativeNotification(notificacion._id);
        } else if (!notificacion.leido) {
            markAsRead(notificacion._id);
        }

        if (notificacion.tipo === 'evento' && notificacion.metadata?.meetingId) {
            navigate('/Mis_reuniones', {
                state: { scrollToMeetingId: notificacion.metadata.meetingId }
            });
            return;
        }

        if (['solicitud_grupo', 'solicitud_grupo_aprobada', 'solicitud_grupo_rechazada', 'promocion_admin_grupo', 'nuevo_miembro_grupo'].includes(notificacion.tipo)) {
            const groupId = notificacion.referencia?.id?._id || notificacion.referencia?.id;
            if (groupId) {
                navigate(`/Mis_grupos/${groupId}`, { state: { openMembersTab: true } });
                return;
            }
        }

        if (['solicitud_iglesia', 'solicitud_iglesia_aprobada', 'solicitud_iglesia_rechazada'].includes(notificacion.tipo)) {
            const iglesiaId = notificacion.referencia?.id?._id || notificacion.referencia?.id;
            if (iglesiaId) {
                navigate(`/Mis_Iglesias/${iglesiaId}`);
                return;
            }
        }

        if (['solicitud_fundacion', 'solicitud_fundacion_aprobada', 'solicitud_fundacion_rechazada'].includes(notificacion.tipo)) {
            navigate('/Mi_iglesia', { state: { activeTab: 'fundacion' } });
            return;
        }

        if (notificacion.tipo === 'nuevo_anuncio') {
            navigate('/admin/publicidad');
            return;
        }

        const postTypes = ['like_post', 'comentario_post', 'respuesta_comentario', 'like_comentario', 'compartir_post'];
        if (postTypes.includes(notificacion.tipo)) {
            let postId = null;

            if (notificacion.referencia && notificacion.referencia.id) {
                if (typeof notificacion.referencia.id === 'object' && notificacion.referencia.id._id) {
                    postId = notificacion.referencia.id._id;
                } else if (typeof notificacion.referencia.id === 'string') {
                    postId = notificacion.referencia.id;
                } else if (typeof notificacion.referencia.id === 'object') {
                    postId = notificacion.referencia.id._id || notificacion.referencia.id.id;
                }
            }

            if (postId) {
                let navPath = `/publicacion/${postId}`;
                const commentId = notificacion.metadata?.commentId;
                if (commentId) {
                    navPath += `?commentId=${commentId}`;
                }
                navigate(navPath);
                return;
            }
        }

        const profileUserId = notificacion.remitenteId?._id || notificacion.remitenteId || notificacion.datos?.fromUserId;
        if (profileUserId && profileUserId !== userId) {
            navigate(`/perfil/${profileUserId}`);
        }
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.titleSection}>
                        <Bell className={styles.titleIcon} size={32} />
                        <div>
                            <h1 className={styles.title}>Notificaciones</h1>
                            <p className={styles.subtitle}>
                                {notifications.length} notificaciones totales
                                {notifications.filter(n => !n.leido).length > 0 && (
                                    <span className={styles.unreadBadge}>
                                        {notifications.filter(n => !n.leido).length} sin leer
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {notifications.filter(n => !n.leido).length > 0 && (
                        <button
                            onClick={marcarTodasComoLeidas}
                            className={styles.markAllButton}
                        >
                            <CheckCheck size={18} />
                            Marcar todas como leídas
                        </button>
                    )}
                </div>
            </div>

            {/* Filtros */}
            <div className={styles.filtersContainer}>
                <div className={styles.filterGroup}>
                    <Filter size={16} className={styles.filterIcon} />
                    <span className={styles.filterLabel}>Filtros:</span>

                    <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="todas">Todos los tipos</option>
                        <option value="amistad">Amistad</option>
                        <option value="grupos">Grupos</option>
                        <option value="eventos">Eventos</option>
                        <option value="posts">Publicaciones</option>
                        <option value="iglesia">Iglesia</option>
                        <option value="fundacion">Fundación</option>
                    </select>

                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="todas">Todas</option>
                        <option value="no_leidas">No leídas</option>
                        <option value="leidas">Leídas</option>
                    </select>
                </div>
            </div>

            {/* Contenido */}
            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Cargando notificaciones...</p>
                </div>
            ) : notificacionesFiltradas.length === 0 ? (
                <div className={styles.emptyState}>
                    <Bell size={64} className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>No hay notificaciones</h3>
                    <p className={styles.emptyText}>
                        {filtroTipo !== 'todas' || filtroEstado !== 'todas'
                            ? 'No se encontraron notificaciones con los filtros seleccionados'
                            : 'Cuando tengas nuevas notificaciones, aparecerán aquí'}
                    </p>
                </div>
            ) : (
                <div className={styles.notificationsList}>
                    {notificacionesFiltradas.map(n => {
                        let displayName = 'Usuario';
                        let displayAvatar = null;
                        let displayMessage = n.mensaje || n.contenido;

                        if (n.emisor) {
                            const nombre = getNombreCompleto(n.emisor);
                            displayName = nombre !== 'Usuario' ? nombre : displayName;
                            displayAvatar = getUserAvatar(n.emisor);
                        } else if (n.remitenteId || n.datos) {
                            const remitente = n.remitenteId || n.datos;
                            const nombre = getNombreCompleto(remitente);
                            displayName = nombre !== 'Usuario' ? nombre : displayName;
                            displayAvatar = getUserAvatar(remitente);
                        }

                        if (['solicitud_grupo', 'solicitud_grupo_aprobada', 'solicitud_grupo_rechazada', 'promocion_admin_grupo'].includes(n.tipo)) {
                            if (n.emisor) {
                                const nombre = getNombreCompleto(n.emisor);
                                displayName = nombre !== 'Usuario' ? nombre : displayName;
                                displayAvatar = getUserAvatar(n.emisor);
                            }
                            if (n.tipo === 'promocion_admin_grupo' && n.referencia?.id?.nombre) {
                                displayMessage = `${displayName} ${n.contenido} "${n.referencia.id.nombre}"`;
                            }
                        }

                        if (['solicitud_iglesia', 'solicitud_iglesia_aprobada', 'solicitud_iglesia_rechazada'].includes(n.tipo)) {
                            return (
                                <IglesiaNotificationCard
                                    key={n._id}
                                    notification={n}
                                    onAction={(notifId) => {
                                        setNotifications(prev => prev.filter(notif => notif._id !== notifId));
                                    }}
                                />
                            );
                        }

                        if (['solicitud_fundacion', 'solicitud_fundacion_aprobada', 'solicitud_fundacion_rechazada'].includes(n.tipo)) {
                            return (
                                <FundacionNotificationCard
                                    key={n._id}
                                    notification={n}
                                    onAction={(notifId) => {
                                        setNotifications(prev => prev.filter(notif => notif._id !== notifId));
                                    }}
                                />
                            );
                        }

                        if (n.tipo === 'evento') {
                            const titles = {
                                meeting_created: 'Nueva Reunión',
                                meeting_reminder: 'Recordatorio',
                                meeting_starting: 'Reunión en Curso',
                                meeting_cancelled: 'Reunión Cancelada'
                            };
                            displayName = titles[n.metadata?.eventType] || 'Notificación de Reunión';
                            displayMessage = n.contenido;
                        }

                        if (n.tipo === 'nuevo_anuncio') {
                            displayName = 'Nuevo Anuncio';
                            displayAvatar = null;
                        }

                        return (
                            <NotificationCard
                                key={n._id}
                                tipo={n.tipo}
                                nombre={displayName}
                                avatar={displayAvatar}
                                mensaje={displayMessage}
                                leido={n.leido}
                                fechaCreacion={n.fechaCreacion || n.createdAt}
                                remitenteId={n.remitenteId || n.emisor}
                                onAccept={n.tipo === 'solicitud_grupo' ? () => handleAcceptGroup(n) : () => onAcceptFriendAction(n)}
                                onReject={n.tipo === 'solicitud_grupo' ? () => handleRejectGroup(n) : () => onRejectFriendAction(n)}
                                onProfileClick={() => handleProfileClick(n)}
                                isProcessed={processedNotifications.has(n._id)}
                                notification={n}
                            />
                        );
                    })}
                </div>
            )}

            {/* AlertDialog */}
            <AlertDialog
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                variant={alertConfig.variant}
                message={alertConfig.message}
            />
        </div>
    );
};

export default NotificationsPage;
