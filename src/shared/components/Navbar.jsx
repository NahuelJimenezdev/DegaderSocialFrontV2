import { useState, useRef, useEffect } from 'react'
import { Bell, Mail, Sun, Moon } from 'lucide-react'

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const dropdownRef = useRef(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Aquí puedes agregar la lógica para cambiar el tema de toda la aplicación
    document.documentElement.classList.toggle('dark')
  }

  const handleLogout = () => {
    // Aquí puedes agregar la lógica de cerrar sesión
    console.log('Cerrando sesión...')
  }

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold">Degader</span>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Notification icon */}
            <button className="p-2 rounded-full hover:bg-slate-700 transition-colors relative">
              <Bell size={20} />
              {/* Badge de notificaciones pendientes */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Mail icon */}
            <button className="p-2 rounded-full hover:bg-slate-700 transition-colors relative">
              <Mail size={20} />
              {/* Badge de mensajes pendientes */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition-all">
                  <span className="text-white font-medium">N</span>
                </div>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-medium">N</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">nahuel@gmail.com</p>
                        <p className="text-xs text-slate-400">Ver todos los perfiles</p>
                      </div>
                    </div>
                  </div>

                  {/* Dark mode toggle */}
                  <button
                    onClick={toggleDarkMode}
                    className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex items-center space-x-3"
                  >
                    {isDarkMode ? (
                      <>
                        <Moon size={20} className="text-yellow-400" />
                        <span className="text-white">Modo Oscuro</span>
                      </>
                    ) : (
                      <>
                        <Sun size={20} className="text-yellow-400" />
                        <span className="text-white">Modo Claro</span>
                      </>
                    )}
                  </button>

                  {/* Menu items */}
                  <button className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors">
                    <span className="text-white">Configuración y privacidad</span>
                  </button>

                  <button className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors">
                    <span className="text-white">Notificaciones</span>
                  </button>

                  <button className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors">
                    <span className="text-white">Privacidad</span>
                  </button>

                  <button className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors">
                    <span className="text-white">Ayuda y soporte técnico</span>
                  </button>

                  {/* Logout */}
                  <div className="border-t border-slate-700 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors"
                    >
                      <span className="text-white">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
