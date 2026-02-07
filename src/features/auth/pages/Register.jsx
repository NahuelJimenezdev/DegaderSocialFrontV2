import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getPaisesOrdenados, getDivisionesPais, getTipoDivision } from '../../../data/paisesProvincias';

import "../styles/loginStyles.css";
import "../styles/loginStylesMobile.css";

const Register = () => {
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: '',
    genero: 'M',
    pais: '',
    ciudad: '',
    estado: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      navigate('/login');
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

  const handleCountryChange = (e) => {
    const nuevoPais = e.target.value;
    setFormData((prev) => ({
      ...prev,
      pais: nuevoPais,
      estado: '',
      ciudad: '',
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre || !formData.apellido || !formData.email || !formData.fechaNacimiento || !formData.password || !formData.pais || !formData.ciudad) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        fechaNacimiento: formData.fechaNacimiento,
        genero: formData.genero,
        pais: formData.pais,
        ciudad: formData.ciudad,
        estado: formData.estado,
        password: formData.password,
      };

      await register(userData);
      navigate('/');
    } catch (err) {
      setError(authError || 'Error al registrarse. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) {
    return (
      <div className="mobile-auth-shell">
        <div className={`mobile-login-container ${!isClosing ? 'active' : 'closing'}`}>
          <div className="mobile-login-header">
            <div className="header-logo-container">
              {/* <div className="header-logo-circle">
                <img
                  src="https://vientodevida.org/servidorimagenes/imagenes/Degader_0.0.1.png"
                  alt="Logo"
                />
              </div> */}
              <span className="header-brand-name mt-2 mb-6">DEGADER SOCIAL</span>
            </div>
          </div>

          <div className="mobile-login-tabs">
            <button
              className="login-tab"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </button>
            <button
              className="login-tab active"
              onClick={() => navigate('/register')}
            >
              Crear cuenta
            </button>
          </div>

          <form className="mobile-login-form-section" onSubmit={handleSubmit} >
            {error && (
              <div className="text-red-500 text-xs mb-2 text-center">
                {error}
              </div>
            )}

            <div className="mobile-input-group">
              <label className="mobile-input-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan"
                className="mobile-input-field"
                disabled={loading}
              />
            </div>

            <div className="mobile-input-group">
              <label className="mobile-input-label">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Pérez"
                className="mobile-input-field"
                disabled={loading}
              />
            </div>

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
              <label className="mobile-input-label">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="mobile-input-field"
                disabled={loading}
              />
            </div>

            <div className="mobile-input-group">
              <label className="mobile-input-label">Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="mobile-input-field"
                disabled={loading}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div className="mobile-input-group">
              <label className="mobile-input-label">País</label>
              <select
                name="pais"
                value={formData.pais}
                onChange={handleCountryChange}
                className="mobile-input-field"
                disabled={loading}
              >
                <option value="">Selecciona País</option>
                {getPaisesOrdenados().map((pais) => (
                  <option key={pais} value={pais}>
                    {pais}
                  </option>
                ))}
              </select>
            </div>

            <div className="mobile-input-group">
              <label className="mobile-input-label">
                {formData.pais ?
                  getTipoDivision(formData.pais).charAt(0).toUpperCase() + getTipoDivision(formData.pais).slice(1)
                  : 'Estado/Provincia'}
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="mobile-input-field"
                disabled={loading || !formData.pais}
              >
                <option value="">Selecciona</option>
                {formData.pais && getDivisionesPais(formData.pais).map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>

            <div className="mobile-input-group">
              <label className="mobile-input-label">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                placeholder="Ej: La Plata"
                className="mobile-input-field"
                disabled={loading}
              />
            </div>

            <div className="mobile-input-group">
              <label className="mobile-input-label">Contraseña</label>
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

            <div className="mobile-input-group">
              <label className="mobile-input-label">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="mobile-input-field"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-mobile-submit"
              disabled={loading}
            >
              {loading ? 'REGISTRANDO...' : 'CREAR CUENTA'}
            </button>

            <button
              type="button"
              className="text-gray-400 text-sm mt-4"
              onClick={handleClose}
            >
              ← Volver al Login
            </button>
          </form>
        </div>
      </div >
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="contenedor">
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
              <button className="btn btn-primary" onClick={() => navigate('/login')}>Iniciar sesión</button>
              <button className="btn btn-secondary">Crear cuenta</button>
            </div>
          </div>
        </div>

        <div className="right-side">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Crea tu cuenta</h1>
              {/* <p className="text-gray-600">Crea tu cuenta</p> */}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2 truncate">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent text-gray-900 text-sm outline-none"
                    placeholder="Juan"
                    disabled={loading}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2 truncate">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent text-gray-900 text-sm outline-none"
                    placeholder="Pérez"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-2 truncate">
                    Fecha Nac. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent text-gray-900 text-sm outline-none"
                    disabled={loading}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-2 truncate">
                    Género <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="genero"
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm"
                    disabled={loading}
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-2 truncate">
                    País <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="pais"
                    name="pais"
                    value={formData.pais}
                    onChange={handleCountryChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm"
                    disabled={loading}
                  >
                    <option value="">País</option>
                    {getPaisesOrdenados().map((pais) => (
                      <option key={pais} value={pais}>
                        {pais}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-0">
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2 truncate">
                    {formData.pais ?
                      getTipoDivision(formData.pais).charAt(0).toUpperCase() + getTipoDivision(formData.pais).slice(1)
                      : 'Estado'}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm"
                    disabled={loading || !formData.pais}
                  >
                    <option value="">División</option>
                    {formData.pais && getDivisionesPais(formData.pais).map((division) => (
                      <option key={division} value={division}>
                        {division}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-2 truncate">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent text-gray-900 text-sm outline-none"
                    placeholder="Ej: La Plata"
                    disabled={loading}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 truncate">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent text-gray-900 text-sm outline-none"
                    placeholder="tu@email.com"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <label htmlFor="password" alt="Contraseña" className="block text-sm font-medium text-gray-700 mb-2 truncate">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2 truncate"
                  >
                    Confirmar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-login text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors mt-6"
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="textLinkColor hover:text-blue-700 font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
