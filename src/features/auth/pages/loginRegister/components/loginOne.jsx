import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import '../styles/loginOne.module.css';
import logo from '../assets/Degader_0.0.1.png';
// https://vientodevida.org/servidorimagenes/imagenes/DegaderSocialLogin.png
// https://vientodevida.org/servidorimagenes/imagenes/Degader_0.0.1.png
const LoginOne = () => {
    const navigate = useNavigate();
    const { login, error: authError } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

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

        if (!acceptedTerms) {
            setError('Debes aceptar los términos y condiciones');
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
        <div className="auth-wrapper">
            <div className="auth-card">

                {/* PANEL IZQUIERDO */}
                <div className="auth-left">
                    <div className="clouds" />
                    <div className="brand">
                        <img src={logo} alt="Degader Social Logo" className="auth-logo" />
                        <h2>Welcome tooooo</h2>
                        <h1>Degader Social</h1>
                        <p>Conecta, comparte y crece junto a tu comunidad</p>
                    </div>
                </div>

                {/* PANEL DERECHO */}
                <div className="auth-right">
                    <div className="auth-right-inner">
                        <h2>Create your account</h2>

                        {/* Mensaje de error */}
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <label>
                                Name
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </label>

                            <label>
                                E-mail Address
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your mail"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </label>

                            <label>
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </label>

                            <div className="terms">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                />
                                <span>
                                    I agree to all the{' '}
                                    <Link to="/terms">Terms & Conditions</Link>
                                </span>
                            </div>

                            <div className="actions">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Cargando...' : 'Sign Up'}
                                </button>
                                <Link to="/login" className="btn-secondary">
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginOne;
