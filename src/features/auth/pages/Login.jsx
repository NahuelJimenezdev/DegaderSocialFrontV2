import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

import "../styles/loginStyles.css";
import "../styles/loginStylesMobile.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado para la vista móvil
  const [mobileView, setMobileView] = useState('welcome');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isClosing, setIsClosing] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Lógica para el loader de sesión única
    if (window.innerWidth < 1024) {
      const hasSeenLoader = sessionStorage.getItem('degader_auth_loader_shown');
      if (!hasSeenLoader) {
        setSessionLoading(true);
        sessionStorage.setItem('degader_auth_loader_shown', 'true');
        setTimeout(() => {
          setSessionLoading(false);
        }, 2500); // 2.5 segundos de elegancia
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Esperamos a que termine la animación de bajada (500ms definidos en CSS)
    setTimeout(() => {
      setMobileView('welcome');
      setIsClosing(false);
    }, 500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(authError || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  // Renderizado para Móvil
  if (isMobile) {
    return (
      <div className="mobile-auth-shell">
        {/* Loader de Sesión (Solo primera vez) */}
        {sessionLoading && (
          <div className="mobile-session-loader">
            <div className="loader-logo-circle">
              <img
                src="https://vientodevida.org/servidorimagenes/imagenes/Degader_0.0.1.png"
                alt="Logo"
                className="loader-logo"
              />
            </div>
            <span className="loader-text">Degader Social</span>
          </div>
        )}

        {/* Pantalla de Bienvenida */}
        <div className={`mobile-welcome-container ${mobileView !== 'welcome' ? 'hidden' : ''}`}>
          <div className="mobile-welcome-logo-section">
            <div className="mobile-logo-circle">
              <img
                src="https://vientodevida.org/servidorimagenes/imagenes/Degader_0.0.1.png"
                alt="Degader Logo"
              />
            </div>
            <div className="mobile-welcome-text">
              <h1>
                Bienvenido a
                <span>Degader Social</span>
              </h1>
            </div>
            <p className="mobile-welcome-subtext">
              Conecta, comparte y crece junto a tu comunidad
            </p>
          </div>

          <div className="mobile-welcome-buttons">
            <button
              className="btn-mobile btn-mobile-login"
              onClick={() => setMobileView('login')}
            >
              Iniciar sesión
            </button>
            <button
              className="btn-mobile btn-mobile-register"
              onClick={() => navigate('/register')}
            >
              Crear cuenta
            </button>
          </div>
        </div>

        {/* Card de Login (BottomSheet) */}
        <div className={`mobile-login-container ${mobileView === 'login' && !isClosing ? 'active' : ''} ${isClosing ? 'closing' : ''}`}>
          <div className="mobile-login-header">
            <div className="header-logo-container">
              {/* <div className="header-logo-circle">
                <img
                  src="https://vientodevida.org/servidorimagenes/imagenes/Degader_0.0.1.png"
                  alt="Logo"
                />
              </div> */}
              <span className="header-brand-name mb-4">DEGADER SOCIAL</span>
            </div>
          </div>

          <div className="mobile-login-tabs">
            <button className="login-tab active">Iniciar sesión</button>
            <button
              className="login-tab"
              onClick={() => navigate('/register')}
            >
              Crear cuenta
            </button>
          </div>

          <form className="mobile-login-form-section" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-xs mb-2 text-center">
                {error}
              </div>
            )}

            <div className="mobile-input-group">
              <label className="mobile-input-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="mobile-input-field"
                disabled={loading}
              />
            </div>

            <div className="mobile-input-group">
              <label className="mobile-input-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mobile-input-field"
                disabled={loading}
              />
            </div>

            <Link to="#" className="mobile-forgot-pass">
              ¿Olvidaste tu contraseña?
            </Link>

            <button
              type="submit"
              className="btn-mobile-submit"
              disabled={loading}
            >
              {loading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
            </button>

            <button
              type="button"
              className="text-gray-400 text-sm mt-4"
              onClick={handleClose}
            >
              ← Volver
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Renderizado para Desktop (Original con ajustes si es necesario)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="contenedor">
        {/* Left Side */}
        <div className="left-side">
          <div className="logo">
            <div className="logo-circle">
              <img
                src="https://vientodevida.org/servidorimagenes/imagenes/Degader_0.0.1.png"
                alt="Degader Logo"
                className="logo-img"
              />
            </div>
          </div>

          <div className="welcome-content">
            <h1 className="welcome-title">
              Bienvenido a
              <br />
              <span>Degader Social</span>
            </h1>

            <p className="welcome-subtitle">
              Conecta, comparte y crece junto a tu comunidad
            </p>

            <div className="buttons">
              <button className="btn btn-primary" onClick={() => { }}>Iniciar sesión</button>
              <button className="btn btn-secondary" onClick={() => navigate('/register')}>Crear cuenta</button>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="right-side">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Inicia sesión en tu cuenta</h1>
              {/* <p className="text-gray-600">Inicia sesión en tu cuenta</p> */}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-login text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="textLinkColor hover:text-blue-700 font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


