import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './app/layout/AppLayout'
import MyFolders from './features/carpetas/pages/MyFolders'
import FolderDetail from './features/carpetas/pages/FolderDetail'
import App from './App'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: ( <App /> ) },
      { path: '/mis-carpetas', element: (<MyFolders />) }, 
      { path: '/folder/:id', element: <FolderDetail /> },
    ],
  }
])

