import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './app/layout/AppLayout'
import MyFolders from './features/carpetas/pages/MyFolders'
import FolderDetail from './features/carpetas/pages/FolderDetail'
import App from './App'
import GruposPages from './features/grupos/pages/GruposPages'
import GroupDetail from './features/grupos/pages/GroupDetail'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: ( <App /> ) },
      { path: '/Mis_carpetas', element: (<MyFolders />) }, 
      { path: '/Mis_carpetas/:id', element: <FolderDetail /> },
      { path: '/Mis_grupos', element: <GruposPages /> },
      { path: '/Mis_grupos/:id', element: <GroupDetail /> },
    ],
  }
])

