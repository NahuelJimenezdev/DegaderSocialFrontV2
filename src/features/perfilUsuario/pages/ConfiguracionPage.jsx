import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../api';
import { ArrowLeft, Settings, Bell, Shield, Moon, Sun, Smartphone, Download, Trash2, Mail, Key } from 'lucide-react';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import '../../../shared/styles/layout.mobile.css';

const ConfiguracionPage = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth(); // Usamos login para actualizar el context si cambian datos
    const { showToast } = useToast();
    
    const [loading, setLoading] = useState(false);
    
    // Estado local para Preferencias
    const [preferencias, setPreferencias] = useState({
        tema: 'system',
        sonidoAlertas: true,
        notificaciones: {
            mensajes: true,
            solicitudes: true,
            iglesia: true,
            arena: true
        }
    });

    useEffect(() => {
        // Cargar preferencias actuales del usuario
        if (user?.preferencias) {
            setPreferencias(user.preferencias);
        } else {
            // Intenta cargar el tema por localStorage si no está en BD
            const savedTheme = localStorage.getItem('theme') || 'system';
            setPreferencias(prev => ({ ...prev, tema: savedTheme }));
        }
    }, [user]);

    const handleThemeChange = async (newTheme) => {
        // Actualiza LocalStorage y DOM
        const effectiveTheme = newTheme === 'system' 
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : newTheme;

        localStorage.setItem('theme', newTheme);
        if (effectiveTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Actualiza BD
        updateConfig('tema', newTheme);
    };

    const updateConfig = async (key, value, isNested = false, nestedKey = null) => {
        try {
            setLoading(true);
            
            let updatedPreferencias = { ...preferencias };
            
            if (isNested) {
                updatedPreferencias[key] = {
                    ...updatedPreferencias[key],
                    [nestedKey]: value
                };
            } else {
                updatedPreferencias[key] = value;
            }

            setPreferencias(updatedPreferencias);

            const res = await userService.updateProfile({
                preferencias: updatedPreferencias
            });

            if (res.success) {
                // Actualizar contexto global
                if(user) {
                     login(res.data, localStorage.getItem('token'));
                }
                showToast('ConfiguracionGuardada', 'success', 'Configuración actualizada');
            }
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            showToast('ErrorConfiguracion', 'error', 'Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header Fijo */}
            <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Settings size={20} className="text-blue-500" />
                            Configuración
                        </h1>
                    </div>
                </div>
            </div>

            <div className="mt-4 mb-mobile-67">
                <div className="max-w-3xl mx-auto px-4 space-y-6">
                    
                    {/* SECCIÓN: MI CUENTA */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mi Cuenta</h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            <button onClick={() => showToast('wip', 'info', 'Función próximamente')} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg"><Mail size={20} /></div>
                                <div className="text-left flex-1 border-b-none">
                                    <p className="text-gray-900 dark:text-white font-medium">Cambiar Correo Electrónico</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                                </div>
                            </button>
                            <button onClick={() => showToast('wip', 'info', 'Función próximamente')} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg"><Key size={20} /></div>
                                <div className="text-left flex-1 border-b-none">
                                    <p className="text-gray-900 dark:text-white font-medium">Cambiar Contraseña</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Actualiza tu clave de acceso</p>
                                </div>
                            </button>
                            <button onClick={() => showToast('wip', 'warning', 'Soporte procesará tu solicitud')} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg"><Download size={20} /></div>
                                <div className="text-left flex-1 border-b-none">
                                    <p className="text-gray-900 dark:text-white font-medium">Exportar Mis Datos</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Solicitar copia de mi información</p>
                                </div>
                            </button>
                            <button onClick={() => showToast('wip', 'error', 'Para borrar la cuenta contacta a soporte')} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition group">
                                <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/40"><Trash2 size={20} /></div>
                                <div className="text-left flex-1 border-b-none">
                                    <p className="text-red-600 dark:text-red-400 font-medium">Eliminar Cuenta</p>
                                    <p className="text-xs text-red-500/70 dark:text-red-400/70">Borrado irreversible de datos</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* SECCIÓN: APARIENCIA */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Apariencia</h2>
                        </div>
                        <div className="p-5">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Elige cómo quieres visualizar Degader Social.</p>
                            <div className="grid grid-cols-3 gap-3">
                                <button 
                                    disabled={loading}
                                    onClick={() => handleThemeChange('light')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition ${preferencias.tema === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-300'}`}
                                >
                                    <Sun size={24} className="mb-2" />
                                    <span className="text-sm font-medium">Claro</span>
                                </button>
                                <button 
                                    disabled={loading}
                                    onClick={() => handleThemeChange('dark')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition ${preferencias.tema === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-300'}`}
                                >
                                    <Moon size={24} className="mb-2" />
                                    <span className="text-sm font-medium">Oscuro</span>
                                </button>
                                <button 
                                    disabled={loading}
                                    onClick={() => handleThemeChange('system')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition ${preferencias.tema === 'system' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-300'}`}
                                >
                                    <Smartphone size={24} className="mb-2" />
                                    <span className="text-sm font-medium">Sistema</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN: NOTIFICACIONES */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alertas y Notificaciones</h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            <ToggleRow 
                                label="Sonido de Alertas In-App" 
                                description="Reproducir un " 
                                value={preferencias.sonidoAlertas}
                                onChange={(val) => updateConfig('sonidoAlertas', val)}
                                disabled={loading}
                            />
                            <div className="px-5 py-3 bg-gray-50/30 dark:bg-gray-800/30 text-xs font-semibold text-gray-400 uppercase">Filtros Módulos</div>
                            <ToggleRow 
                                label="Nuevos Mensajes / Chat" 
                                value={preferencias.notificaciones?.mensajes}
                                onChange={(val) => updateConfig('notificaciones', val, true, 'mensajes')}
                                disabled={loading}
                            />
                            <ToggleRow 
                                label="Solicitudes de Amistad" 
                                value={preferencias.notificaciones?.solicitudes}
                                onChange={(val) => updateConfig('notificaciones', val, true, 'solicitudes')}
                                disabled={loading}
                            />
                            <ToggleRow 
                                label="Actividad de Iglesias" 
                                description="Eventos, noticias y anuncios de tu congregación"
                                value={preferencias.notificaciones?.iglesia}
                                onChange={(val) => updateConfig('notificaciones', val, true, 'iglesia')}
                                disabled={loading}
                            />
                            <ToggleRow 
                                label="Arena (La Senda del Reino)" 
                                description="Logros desbloqueados y actualizaciones de ranking"
                                value={preferencias.notificaciones?.arena}
                                onChange={(val) => updateConfig('notificaciones', val, true, 'arena')}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Espacio para que el scroll móvil no se corte por el footer rápido */}
                    <div className="h-6"></div>
                </div>
            </div>
        </div>
    );
};

// Toggle UI Component extraido
const ToggleRow = ({ label, description, value, onChange, disabled }) => {
    return (
        <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
            <div className="pr-4">
                <p className="text-gray-900 dark:text-white font-medium text-sm">{label}</p>
                {description && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{description}</p>}
            </div>
            <button
                disabled={disabled}
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${value ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'} ${disabled ? 'opacity-50' : ''}`}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
        </div>
    );
};

export default ConfiguracionPage;
