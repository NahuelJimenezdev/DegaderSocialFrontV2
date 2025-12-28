import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from './app/layout/AppLayout'
import App from './App'
import FriendsPage from './features/amigos/page/FriendsPage'
import GruposPages from './features/grupos/pages/GruposPages'
import GroupDetail from './features/grupos/pages/GroupDetail'
import IglesiaPage from './features/iglesias/pages/IglesiaPage'
import IglesiaDetail from './features/iglesias/pages/IglesiaDetail'
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
      { path: '/Mi_iglesia/:id', element: <IglesiaDetail /> },
      { path: '/Mis_carpetas', element: <MisCarpetasPage /> },
      { path: '/Mis_carpetas/:id', element: <FolderDetailAdvanced /> },
      { path: '/Mi_perfil', element: <ProfilePage /> },
      { path: '/perfil/:id', element: <PerfilVisitantePage /> },
      { path: '/publicacion/:id', element: <PostPage /> },
      // Advertising routes
      { path: '/publicidad', element: <ClientAdsDashboard /> },
      { path: '/admin/publicidad', element: <FounderAdsDashboard /> },
      { path: '/publicidad/analytics/:campaignId', element: <CampaignAnalyticsPage /> }
    ],
  },

  // Catch all - redirect to home
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])



