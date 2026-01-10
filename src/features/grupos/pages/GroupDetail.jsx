import { useState, useEffect } from 'react'
import { logger } from '../../../shared/utils/logger';
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useGroupData } from '../hooks/useGroupData'
import { getSocket } from '../../../shared/lib/socket'
import groupService from '../../../api/groupService'
import SidebarGroup from '../components/SidebarGroup'
import GroupChat from '../components/GroupChat'
import GroupFeed from '../components/GroupFeed'
import GroupInfo from '../components/GroupInfo'
import GroupMembers from '../components/GroupMembers'
import GroupMultimedia from '../components/GroupMultimedia'
import GroupFiles from '../components/GroupFiles'
import GroupLinks from '../components/GroupLinks'
import GroupEvents from '../components/GroupEvents'
import GroupSettings from '../components/GroupSettings'

const GroupDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth() // Obtener usuario autenticado
  const [activeSection, setActiveSection] = useState('feed')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [targetMessageId, setTargetMessageId] = useState(null)

  // Contadores para los badges del sidebar
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [newPostsCount, setNewPostsCount] = useState(0)

  // Detectar si es mobile/tablet o desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // 1024px es el breakpoint lg de Tailwind
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Usar custom hook para obtener los datos del grupo
  const { groupData, loading, refetch } = useGroupData(id)

  // Determinar rol del usuario en el grupo
  const isOwner = String(groupData?.creador?._id) === String(user?._id);
  const isAdmin = groupData?.administradores?.some(admin =>
    String(admin._id || admin) === String(user?._id)
  ) || false;

  const userMember = groupData?.members?.find(m =>
    String(m.user?._id || m.user) === String(user?._id)
  );
  const userRole = isOwner ? 'owner' : (isAdmin ? 'admin' : userMember?.role || 'member');

  // Contador de solicitudes pendientes
  const pendingRequestsCount = groupData?.joinRequests?.length || groupData?.solicitudesPendientes?.length || 0;

  // Socket listener para nuevos mensajes y notificaciones (actualizar contadores)
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !id) return;

    const handleNewMessage = (message) => {
      // Solo incrementar si el mensaje NO es del usuario actual y NO está en la sección de chat
      if (String(message.author?._id) !== String(user?._id) && activeSection !== 'chat') {
        setUnreadMessagesCount(prev => prev + 1);
      }
    };

    const handleNewNotification = (notification) => {
      // Si es una solicitud de grupo, recargar datos para actualizar contador de solicitudes
      if (notification.tipo === 'solicitud_grupo' && notification.referencia?.id === id) {
        refetch(); // Esto actualizará el contador de pendingRequestsCount
      }
    };

    socket.on('newGroupMessage', handleNewMessage);
    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('newGroupMessage', handleNewMessage);
      socket.off('newNotification', handleNewNotification);
    };
  }, [id, user?._id, activeSection, refetch]);

  // Resetear contador de mensajes cuando se entra a la sección de chat
  useEffect(() => {
    if (activeSection === 'chat') {
      setUnreadMessagesCount(0);
    }
  }, [activeSection]);

  // Cargar contador inicial de mensajes no leídos
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        // Obtener la última visita del usuario al chat de este grupo desde localStorage
        const lastVisitKey = `group_chat_last_visit_${id}`;
        const lastVisit = localStorage.getItem(lastVisitKey);

        if (lastVisit) {
          const messages = await groupService.getMessages(id);
          const messagesArray = Array.isArray(messages) ? messages : [];

          // Contar mensajes después de la última visita que no sean del usuario actual
          const unreadCount = messagesArray.filter(msg =>
            new Date(msg.createdAt) > new Date(lastVisit) &&
            String(msg.author?._id) !== String(user?._id)
          ).length;

          setUnreadMessagesCount(unreadCount);
        }
      } catch (error) {
        logger.error('Error loading unread count:', error);
      }
    };

    if (id && user?._id) {
      loadUnreadCount();
    }
  }, [id, user?._id]);

  // Guardar timestamp cuando se visita el chat
  useEffect(() => {
    if (activeSection === 'chat') {
      const lastVisitKey = `group_chat_last_visit_${id}`;
      localStorage.setItem(lastVisitKey, new Date().toISOString());
    }
  }, [activeSection, id]);

  const menuItems = [
    { id: 'feed', icon: 'article', label: 'Feed', count: newPostsCount },
    { id: 'chat', icon: 'chat', label: 'Chat', count: unreadMessagesCount },
    { id: 'detail', icon: 'info', label: 'Detalle' },
    { id: 'members', icon: 'group', label: 'Miembros', count: pendingRequestsCount },
    { id: 'multimedia', icon: 'collections', label: 'Multimedia' },
    { id: 'files', icon: 'folder', label: 'Archivos' },
    { id: 'links', icon: 'link', label: 'Enlaces' },
    { id: 'events', icon: 'event', label: 'Destacados' },
    { id: 'settings', icon: 'settings', label: 'Configuración' }
  ]

  const handleGoToMessage = (messageId) => {
    setTargetMessageId(messageId);
    setActiveSection('chat');
  };

  // Renderizar el componente según la sección activa
  const renderSection = () => {
    switch (activeSection) {
      case 'feed':
        return <GroupFeed groupData={groupData} />
      case 'chat':
        return <GroupChat
          groupData={groupData}
          user={user}
          targetMessageId={targetMessageId}
          onClearTargetMessage={() => setTargetMessageId(null)}
        />
      case 'detail':
        return <GroupInfo groupData={groupData} />
      case 'members':
        return <GroupMembers
          groupData={groupData}
          refetch={refetch}
          user={user}
          userRole={userRole}
          isAdmin={isAdmin}
          isOwner={isOwner}
        />
      case 'multimedia':
        return <GroupMultimedia groupData={groupData} />
      case 'files':
        return <GroupFiles groupData={groupData} />
      case 'links':
        return <GroupLinks groupData={groupData} />
      case 'events':
        return <GroupEvents groupData={groupData} onGoToMessage={handleGoToMessage} />
      case 'settings':
        return <GroupSettings
          groupData={groupData}
          refetch={refetch}
          user={user}
          userRole={userRole}
          isAdmin={isAdmin}
          isOwner={isOwner}
        />
      default:
        return <GroupFeed groupData={groupData} />
    }
  }

  // Mostrar loading mientras se cargan los datos
  if (loading || !groupData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-[#64748b] dark:text-[#94a3b8]">Cargando grupo...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full overflow-hidden overflow-x-hidden bg-gray-50 dark:bg-gray-900 relative">
      <div className='mb-mobile-67'>

        {/* Botón hamburguesa - Visible en mobile y tablet */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-20 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-12 h-12 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl text-gray-700 dark:text-gray-300">
              {sidebarOpen ? 'close' : 'menu'}
            </span>
          </button>
        )}

        {/* Overlay para cerrar sidebar en mobile/tablet */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar del grupo */}
        <div
          className={`
          w-64 flex-shrink-0 bg-white dark:bg-gray-800
          lg:relative lg:!translate-x-0 lg:h-full lg:border-r
          fixed top-16 z-40 h-[calc(100vh-64px)]
          transition-transform duration-300 ease-in-out lg:transition-none
          ${isMobile ? 'right-0 border-l' : 'left-0 border-r'}
          ${isMobile
              ? (sidebarOpen ? 'translate-x-0' : 'translate-x-full')
              : (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
            }
          lg:translate-x-0 border-gray-200 dark:border-gray-700
        `}
        >
          <SidebarGroup
            groupData={groupData}
            navigate={navigate}
            activeSection={activeSection}
            setActiveSection={(section) => {
              setActiveSection(section)
              setSidebarOpen(false) // Cerrar sidebar al seleccionar una sección en mobile
            }}
            menuItems={menuItems}
          />
        </div>

        {/* Contenido principal - Ocupa el resto del espacio */}
        <main className="flex-1 h-full overflow-hidden overflow-x-hidden">
          <div className="w-full h-full overflow-x-hidden">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default GroupDetail



