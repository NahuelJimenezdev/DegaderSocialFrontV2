import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from './app/layout/AppLayout'
import App from './App'
import FriendsPage from './features/amigos/page/FriendsPage'
import GruposPages from './features/grupos/pages/GruposPages'
import GroupDetail from './features/grupos/pages/GroupDetail'
import IglesiaPage from './features/iglesias/pages/IglesiaPage'
import FundacionPage from './features/fundacion/pages/FundacionPage'
import IglesiaDetail from './features/iglesias/pages/IglesiaDetail'
import IglesiaExMiembros from './features/iglesias/pages/IglesiaExMiembros'
import IglesiaExMiembroDetalle from './features/iglesias/pages/IglesiaExMiembroDetalle'
import MemberProfilePage from './features/iglesias/pages/MemberProfilePage'
import MisCarpetasPage from './features/carpetas/pages/MisCarpetasPage'
import FolderDetail from './features/carpetas/pages/FolderDetail'
import FolderDetailAdvanced from './features/carpetas/pages/FolderDetailAdvanced'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import ProfilePage from './features/perfilUsuario/page/ProfilePage'
import MensajesPage from './features/mensajes/pages/MensajesPage'
import PerfilVisitantePage from './features/perfilVisitante/page/PerfilVisitantePage'
import { ReunionesPage } from './features/reuniones/pages/ReunionesPage'
import SearchPage from './pages/SearchPage'
import ClientAdsDashboard from './features/ads/ClientAdsDashboard'
import FounderAdsDashboard from './features/ads/FounderAdsDashboard'
import CampaignAnalyticsPage from './features/ads/CampaignAnalyticsPage'
import PostPage from './features/feed/pages/PostPage'
import NotificationsPage from './features/notificaciones/pages/NotificationsPage'
import SystemNotificationPage from './features/notificaciones/pages/SystemNotificationPage'
import UserInfoPage from './features/perfilUsuario/pages/UserInfoPage'
import FavoritosPage from './features/favoritos/pages/FavoritosPage'
import ModeratorDashboard from './features/moderacion/pages/ModeratorDashboard'
import ModeratorRoute from './features/moderacion/components/ModeratorRoute'
import SuspendedUsersPage from './features/admin/pages/SuspendedUsersPage'
import TicketsManagementPage from './features/admin/pages/TicketsManagementPage'
import FounderRoute from './shared/components/FounderRoute';
import FounderUsersPage from './features/founder/pages/FounderUsersPage';
import TicketDetailPage from './features/tickets/pages/TicketDetailPage';
import AuditLogsPage from './features/admin/pages/AuditLogsPage';

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
      { path: '/iglesias/:iglesiaId/miembros/:userId', element: <MemberProfilePage /> },
      { path: '/Mis_carpetas', element: <MisCarpetasPage /> },
      { path: '/Mis_carpetas/:id', element: <FolderDetailAdvanced /> },
      { path: '/Mi_perfil', element: <ProfilePage /> },
      { path: '/perfil/:id', element: <PerfilVisitantePage /> },
      { path: '/informacionUsuario/:nombreapellido', element: <UserInfoPage /> },
      { path: '/publicacion/:id', element: <PostPage /> },
      { path: '/notificaciones', element: <NotificationsPage /> },
      { path: '/Sistema/:id', element: <SystemNotificationPage /> },
      { path: '/favoritos', element: <FavoritosPage /> },
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
      { path: '/admin/suspendidos', element: <ModeratorRoute><SuspendedUsersPage /></ModeratorRoute> },
      { path: '/admin/tickets', element: <ModeratorRoute><TicketsManagementPage /></ModeratorRoute> },
      { path: '/admin/tickets/:id', element: <ModeratorRoute><TicketDetailPage /></ModeratorRoute> }, // Vista admin
      // Founder Panel
      { path: '/admin/logs', element: <FounderRoute><AuditLogsPage /></FounderRoute> }, // Solo Founder/Audit
      { path: '/founder/users', element: <FounderRoute><FounderUsersPage /></FounderRoute> }
    ],
  },

  // Catch all - redirect to home
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])



