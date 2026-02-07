import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext.jsx';
import "../styles/loginOneLoading.css";


export default function Login() {
    const navigate = useNavigate();
    const { login, error: authError } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
    return (
        <div className="container-fluid">
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
                            <button className="btn btn-primary">Iniciar sesión</button>
                            <button className="btn btn-secondary">Crear cuenta</button>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="right-side">
                    {/* <div className="login-card">
                        <div className="tabs">
                            <button className="tab active">Iniciar sesión</button>
                            <button className="tab">Crear cuenta</button>
                        </div>

                        <form className="login-form">
                            <div className="input-group">
                                <svg
                                    className="input-icon"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V16C17 16.5523 16.5523 17 16 17H4C3.44772 17 3 16.5523 3 16V4Z"
                                        stroke="#9CA3AF"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M3 7L10 11L17 7"
                                        stroke="#9CA3AF"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                <input
                                    type="email"
                                    placeholder="Email - Adress"
                                    className="input-field"
                                />
                            </div>

                            <div className="input-group">
                                <svg
                                    className="input-icon"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 9V6C5 3.79086 6.79086 2 9 2H11C13.2091 2 15 3.79086 15 6V9M4 9H16C16.5523 9 17 9.44772 17 10V16C17 16.5523 16.5523 17 16 17H4C3.44772 17 3 16.5523 3 16V10C3 9.44772 3.44772 9 4 9Z"
                                        stroke="#9CA3AF"
                                        strokeWidth="1.5"
                                    />
                                </svg>

                                <input
                                    type="password"
                                    placeholder="••••••"
                                    className="input-field"
                                />
                            </div>

                            <a href="#" className="forgot-password">
                                Forgot your password? →
                            </a>

                            <button type="submit" className="btn-login">
                                INICIAR SESIÓN
                            </button>
                        </form>
                    </div> */}
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Degader Social</h1>
                            <p className="text-gray-600">Inicia sesión en tu cuenta</p>
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
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                ¿No tienes una cuenta?{' '}
                                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
