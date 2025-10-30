import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './app/layout/AppLayout'
import MyFolders from './features/carpetas/pages/MyFolders'
import FolderDetail from './features/carpetas/pages/FolderDetail'
import App from './App'
import GruposPages from './features/grupos/pages/GruposPages'
// import GroupDetail from './features/grupos/pages/GroupDetail'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: ( <App /> ) },
      { path: '/carpetas', element: (<MyFolders />) }, 
      { path: '/folder/:id', element: <FolderDetail /> },
      { path: '/grupos', element: <GruposPages /> },
      // { path: '/group/:id', element: <GroupDetail /> },
    ],
  }
])

