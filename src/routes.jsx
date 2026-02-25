import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from './app/layout/AppLayout'
import App from './App'
import SearchPage from './pages/SearchPage'
import Login from './features/auth/pages/Login'
import PostPage from './features/feed/pages/PostPage'
import Register from './features/auth/pages/Register'
import FounderRoute from './shared/components/FounderRoute'
import FriendsPage from './features/amigos/page/FriendsPage'
import GruposPages from './features/grupos/pages/GruposPages'
import GroupDetail from './features/grupos/pages/GroupDetail'
import IglesiaPage from './features/iglesias/pages/IglesiaPage'
import FolderDetail from './features/carpetas/pages/FolderDetail'
import MensajesPage from './features/mensajes/pages/MensajesPage'
import AuditLogsPage from './features/admin/pages/AuditLogsPage'
import ClientAdsDashboard from './features/ads/ClientAdsDashboard'
import IglesiaDetail from './features/iglesias/pages/IglesiaDetail'
import ProfilePage from './features/perfilUsuario/page/ProfilePage'
import FundacionPage from './features/fundacion/pages/FundacionPage'
import FounderAdsDashboard from './features/ads/FounderAdsDashboard'
import FavoritosPage from './features/favoritos/pages/FavoritosPage'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import UserInfoPage from './features/perfilUsuario/pages/UserInfoPage'
import MisCarpetasPage from './features/carpetas/pages/MisCarpetasPage'
import { ReunionesPage } from './features/reuniones/pages/ReunionesPage'
import CampaignAnalyticsPage from './features/ads/CampaignAnalyticsPage'
import FounderUsersPage from './features/founder/pages/FounderUsersPage'
import TicketDetailPage from './features/tickets/pages/TicketDetailPage'
import SuspendedUsersPage from './features/admin/pages/SuspendedUsersPage'
import IglesiaExMiembros from './features/iglesias/pages/IglesiaExMiembros'
import MemberProfilePage from './features/iglesias/pages/MemberProfilePage'
import ModeratorRoute from './features/moderacion/components/ModeratorRoute'
import ModeratorDashboard from './features/moderacion/pages/ModeratorDashboard'
import TicketsManagementPage from './features/admin/pages/TicketsManagementPage'
import FolderDetailAdvanced from './features/carpetas/pages/FolderDetailAdvanced'
import NotificationsPage from './features/notificaciones/pages/NotificationsPage'
import PerfilVisitantePage from './features/perfilVisitante/page/PerfilVisitantePage'
import IglesiaExMiembroDetalle from './features/iglesias/pages/IglesiaExMiembroDetalle'
import SystemNotificationPage from './features/notificaciones/pages/SystemNotificationPage'
import ArenaPage from './features/LaSendadelReino/components/ArenaPage'

export const router = createBrowserRouter([
  // Public routes (Login & Register)
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },

  // Protected routes (require authentication)
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <App /> },
      { path: '/buscar', element: <SearchPage /> },
      { path: '/amigos', element: <FriendsPage /> },
      { path: '/mensajes', element: <MensajesPage /> },
      { path: '/mensajes/:id', element: <MensajesPage /> },
      { path: '/Mis_reuniones', element: <ReunionesPage /> },
      { path: '/Mis_grupos', element: <GruposPages /> },
      { path: '/Mis_grupos/:id', element: <GroupDetail /> },
      { path: '/Mi_iglesia', element: <IglesiaPage /> },
      { path: '/fundacion', element: <FundacionPage /> },
      { path: '/Mi_iglesia/:id', element: <IglesiaDetail /> },
      { path: '/iglesias/:id', element: <IglesiaDetail /> },
      { path: '/Mi_iglesia/:id/miembros_salidos', element: <IglesiaExMiembros /> },
      { path: '/Mi_iglesia/:id/miembros_salidos/:userId/motivo', element: <IglesiaExMiembroDetalle /> },
      { path: '/Mi_iglesia/:iglesiaId/miembros/:userId', element: <MemberProfilePage /> },
      { path: '/Mis_carpetas', element: <MisCarpetasPage /> },
      { path: '/Mis_carpetas/:id', element: <FolderDetailAdvanced /> },
      { path: '/Mi_perfil', element: <ProfilePage /> },
      { path: '/perfil/:id', element: <PerfilVisitantePage /> },
      { path: '/informacionUsuario/:nombreapellido', element: <UserInfoPage /> },
      { path: '/publicacion/:id', element: <PostPage /> },
      { path: '/notificaciones', element: <NotificationsPage /> },
      { path: '/Sistema/:id', element: <SystemNotificationPage /> },
      { path: '/favoritos', element: <FavoritosPage /> },
      // Ticket System Routes
      { path: '/tickets/:id', element: <TicketDetailPage /> }, // Vista usuario
      // Advertising routes
      { path: '/publicidad', element: <ClientAdsDashboard /> },
      { path: '/admin/publicidad', element: <FounderAdsDashboard /> },
      { path: '/publicidad/analytics/:campaignId', element: <CampaignAnalyticsPage /> },
      // Moderator Panel
      { path: '/moderador', element: <ModeratorRoute><ModeratorDashboard /></ModeratorRoute> },
      // Admin Panel
      { path: '/admin/suspendidos', element: <ModeratorRoute><SuspendedUsersPage /></ModeratorRoute> },
      { path: '/admin/tickets', element: <ModeratorRoute><TicketsManagementPage /></ModeratorRoute> },
      { path: '/admin/tickets/:id', element: <ModeratorRoute><TicketDetailPage /></ModeratorRoute> }, // Vista admin
      // Founder Panel
      { path: '/admin/logs', element: <FounderRoute><AuditLogsPage /></FounderRoute> }, // Solo Founder/Audit
      { path: '/founder/users', element: <FounderRoute><FounderUsersPage /></FounderRoute> },
      { path: '/arena', element: <ArenaPage /> }
    ],
  },

  // Catch all - redirect to home
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])
