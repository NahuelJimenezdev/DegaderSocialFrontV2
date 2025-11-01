import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './app/layout/AppLayout'
import App from './App'
import FriendsPage from './features/amigos/page/FriendsPage'
import GruposPages from './features/grupos/pages/GruposPages'
import GroupDetail from './features/grupos/pages/GroupDetail'
import IglesiaPage from './features/iglesias/pages/IglesiaPage'
import MyFolders from './features/carpetas/pages/MyFolders'
import FolderDetail from './features/carpetas/pages/FolderDetail'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: ( <App /> ) },
      { path: '/amigos', element: <FriendsPage /> },
      { path: '/Mis_grupos', element: <GruposPages /> },
      { path: '/Mis_grupos/:id', element: <GroupDetail /> },
      { path: '/Mi_iglesia', element: <IglesiaPage /> },
      { path: '/Mis_carpetas', element: (<MyFolders />) }, 
      { path: '/Mis_carpetas/:id', element: <FolderDetail /> },
    ],
  }
])

