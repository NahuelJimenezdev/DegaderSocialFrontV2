import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './shared/components/Toast/ToastProvider'
import { OnlineUsersProvider } from './contexts/OnlineUsersContext'
// import './index.css'
// import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <OnlineUsersProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </OnlineUsersProvider>
    </AuthProvider>
    {/* <App /> */}
  </StrictMode>,
)


