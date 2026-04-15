import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '../../../api';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import ProgressiveImage from '../../../shared/components/ProgressiveImage';

import "../styles/loginStylesMobile.css";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Las contraseñas no coinciden');
    }

    if (formData.password.length < 6) {
      return toast.error('La contraseña debe tener al menos 6 caracteres');
    }

    try {
      setLoading(true);
      const res = await authService.resetPassword(token, formData.password);
      toast.success(res.message);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al restablecer contraseña. El enlace puede haber expirado.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">¡Contraseña Actualizada!</h1>
          <p className="text-gray-600">
            Tu contraseña ha sido cambiada exitosamente. Redirigiéndote al inicio de sesión...
          </p>
          <Link to="/login" className="inline-block text-blue-600 font-medium hover:underline">
            Ir al Login ahora
          </Link>
        </div>
      </div>
    );
  }

  // Desktop View
  const renderDesktop = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex max-w-4xl w-full" style={{ minHeight: '500px' }}>
        {/* Left decoration */}
        <div className="hidden md:flex w-1/2 bg-blue-600 p-12 flex-col justify-center items-center text-white space-y-6 text-center">
           <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center overflow-hidden">
              <ProgressiveImage
                src="https://vientodevida.org/servidorimagenes/imagenes/Degader_0.0.1.png"
                alt="Logo"
                className="rounded-full"
                style={{ width: '70%', height: '70%', objectFit: 'contain' }}
              />
           </div>
           <h2 className="text-3xl font-bold">Crea tu nueva clave</h2>
           <p className="text-blue-100">Asegúrate de elegir una contraseña segura que no compartas con nadie.</p>
        </div>

        {/* Right form */}
        <div className="w-full md:w-1/2 p-12">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-gray-800">Restablecer Contraseña</h1>
            <p className="text-gray-500 text-sm mt-2">Ingresa tu nueva contraseña para recuperar el acceso.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nueva Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Confirmar Contraseña</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // Mobile View
  const renderMobile = () => (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <ProgressiveImage
                src="https://vientodevida.org/servidorimagenes/imagenes/Degader_0.0.1.png"
                alt="Logo"
                style={{ width: '60%', height: '60%', objectFit: 'contain' }}
            />
        </div>
        <span className="font-bold text-gray-800">DEGADER SOCIAL</span>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Nueva clave</h1>
        <p className="text-gray-500 mb-8">Escribe tu nueva contraseña para entrar a tu cuenta.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border-b-2 border-gray-100 py-3 focus:border-blue-500 outline-none transition-all text-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Confirmar</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border-b-2 border-gray-100 py-3 focus:border-blue-500 outline-none transition-all text-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 mt-10 active:bg-blue-700 transition-colors"
          >
            {loading ? 'RESTABLECIENDO...' : 'RESTABLECER CONTRASEÑA'}
          </button>
        </form>
      </div>

      <div className="py-4 text-center">
        <Link to="/login" className="text-sm text-gray-400 font-medium">Cancelar y volver</Link>
      </div>
    </div>
  );

  return isMobile ? renderMobile() : renderDesktop();
};

export default ResetPasswordPage;
