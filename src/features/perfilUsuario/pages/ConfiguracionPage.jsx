import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../api';
import authService from '../../../api/authService';
import { ArrowLeft, Settings, Bell, Shield, Moon, Sun, Smartphone, Download, Trash2, Mail, Key } from 'lucide-react';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import { requestFirebaseToken } from '../../../shared/lib/firebase';
import '../../../shared/styles/layout.mobile.css';

const ConfiguracionPage = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth(); // Usamos updateUser para actualizar el context si cambian datos
    const toast = useToast();
    
    const [loading, setLoading] = useState(false);

    // Estados para Modales
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
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

    const [isPushEnabled, setIsPushEnabled] = useState(false);
    const [pushPermissionStatus, setPushPermissionStatus] = useState('default');
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    useEffect(() => {
        // Cargar preferencias actuales del usuario
        if (user?.preferencias) {
            setPreferencias(user.preferencias);
        } else {
            // Intenta cargar el tema por localStorage si no está en BD
            const savedTheme = localStorage.getItem('theme') || 'system';
            setPreferencias(prev => ({ ...prev, tema: savedTheme }));
        }

        // Verificar estado de permisos Push
        if ('Notification' in window) {
            setPushPermissionStatus(Notification.permission);
            setIsPushEnabled(Notification.permission === 'granted');
        }

        // Manejar prompt de instalación PWA
        const handleInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBtn(true);
        };

        window.addEventListener('beforeinstallprompt', handleInstallPrompt);

        // Si ya está instalado o no es instalable
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowInstallBtn(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    }, [user]);

    const handleInstallApp = async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setShowInstallBtn(false);
            toast.success('¡Gracias por instalar Degader Social!');
        }
        setDeferredPrompt(null);
    };

    const handleTogglePush = async () => {
        if (!user?._id) return;

        try {
            setLoading(true);
            const token = await requestFirebaseToken(user._id);
            if (token) {
                setPushPermissionStatus('granted');
                setIsPushEnabled(true);
                toast.success('Notificaciones push activadas correctamente');
            } else {
                // Si el token es null, puede ser que el usuario denegó el permiso
                setPushPermissionStatus(Notification.permission);
                setIsPushEnabled(Notification.permission === 'granted');
                if (Notification.permission === 'denied') {
                    toast.error('Permiso denegado. Debes activarlo en la configuración de tu navegador.');
                }
            }
        } catch (error) {
            console.error('Error al manejar toggle push:', error);
            toast.error('Error al configurar notificaciones');
        } finally {
            setLoading(false);
        }
    };

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
                     updateUser(res.data);
                }
                toast.success('Configuración actualizada');
            }
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            toast.error('Error al guardar');
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
                            <button onClick={() => toast.info('Función próximamente')} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg"><Mail size={20} /></div>
                                <div className="text-left flex-1 border-b-none">
                                    <p className="text-gray-900 dark:text-white font-medium">Cambiar Correo Electrónico</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                                </div>
                            </button>
                            <button onClick={() => setIsPasswordModalOpen(true)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg"><Key size={20} /></div>
                                <div className="text-left flex-1 border-b-none">
                                    <p className="text-gray-900 dark:text-white font-medium">Cambiar Contraseña</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Actualiza tu clave de acceso</p>
                                </div>
                            </button>
                            <button onClick={() => toast.warning('Soporte procesará tu solicitud')} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg"><Download size={20} /></div>
                                <div className="text-left flex-1 border-b-none">
                                    <p className="text-gray-900 dark:text-white font-medium">Exportar Mis Datos</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Solicitar copia de mi información</p>
                                </div>
                            </button>

                            {showInstallBtn && (
                                <button onClick={handleInstallApp} className="w-full flex items-center gap-4 px-5 py-4 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition group">
                                    <div className="p-2 bg-blue-500 text-white rounded-lg animate-bounce"><Smartphone size={20} /></div>
                                    <div className="text-left flex-1 border-b-none">
                                        <p className="text-blue-600 dark:text-blue-400 font-bold">Descargar Aplicación</p>
                                        <p className="text-xs text-blue-500/70 dark:text-blue-400/70">Instala Degader Social en tu dispositivo</p>
                                    </div>
                                </button>
                            )}
                            <button onClick={() => setIsDeleteModalOpen(true)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition group">
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
                            <ToggleRow 
                                label="Alertas del Dispositivo (Push)" 
                                description={pushPermissionStatus === 'denied' 
                                    ? "⚠️ Permiso bloqueado en el navegador" 
                                    : "Recibir notificaciones cuando la app esté cerrada"}
                                value={isPushEnabled}
                                onChange={handleTogglePush}
                                disabled={loading || pushPermissionStatus === 'denied'}
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

            {/* Modos PopUps Portados */}
            <PasswordChangeModal 
                isOpen={isPasswordModalOpen} 
                onClose={() => setIsPasswordModalOpen(false)} 
                toast={toast} 
            />
            
            {/* OJO: el componente de logout lo saco de useAuth(). En este archivo no estaba disponible, lo extraigo en la linea 11 actual */}
            <DeleteAccountModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                toast={toast} 
                logout={user?.logout} // Pasamos referencia si existe, aunque también login() sirve para redirigir si se borra de Storage. Ver linea reactiva.
            />
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

// Modal para Cambiar Contraseña
const PasswordChangeModal = ({ isOpen, onClose, toast, userId }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            return toast.error('La contraseña debe tener al menos 6 caracteres');
        }
        if (newPassword !== confirmPassword) {
            return toast.error('Las contraseñas nuevas no coinciden');
        }

        try {
            setLoading(true);
            const res = await authService.changePassword(currentPassword, newPassword);
            if (res.success) {
                toast.success('Contraseña actualizada correctamente');
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al actualizar contraseña. Verifica tu clave actual.');
        } finally {
            setLoading(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Key size={18} className="text-blue-500" />
                        Cambiar Contraseña
                    </h3>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Contraseña Actual</label>
                        <input 
                            type="password" 
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Nueva Contraseña</label>
                        <input 
                            type="password"
                            required
                            minLength={6}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Confirmar Nueva Contraseña</label>
                        <input 
                            type="password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                        />
                    </div>
                    
                    <div className="pt-2 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            Cancelar
                        </button>
                        <button disabled={loading} type="submit" className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition disabled:opacity-50">
                            {loading ? 'Guardando...' : 'Actualizar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal para Eliminar Cuenta
const DeleteAccountModal = ({ isOpen, onClose, toast, logout }) => {
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);
    
    const TARGET_TEXT = 'ELIMINAR MI CUENTA';

    if (!isOpen) return null;

    const handleDelete = async () => {
        if (confirmText !== TARGET_TEXT) return;

        try {
            setLoading(true);
            const res = await userService.deactivateAccount();
            if (res.success) {
                toast.success('Tu cuenta ha sido eliminada. Lamentamos verte partir.');
                onClose();
                logout(); // Destruir token y redirigir
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Hubo un problema al eliminar tu cuenta');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-red-50 dark:bg-red-900/10">
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                        <Trash2 size={18} />
                        Zona de Peligro
                    </h3>
                </div>
                <div className="p-5 space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Esta acción es <strong className="text-red-500">irreversible</strong>. Perderás el acceso a tus publicaciones, amigos y configuraciones.
                    </p>
                    
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                            Para proceder, escribe <strong>{TARGET_TEXT}</strong> a continuación.
                        </label>
                        <input 
                            type="text" 
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="ELIMINAR MI CUENTA"
                            className="w-full px-3 py-2 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-400 placeholder:text-red-300 dark:placeholder:text-red-800 focus:ring-2 focus:ring-red-500 outline-none transition font-mono text-center" 
                        />
                    </div>
                    
                    <div className="pt-2 flex flex-col gap-2">
                        <button 
                            disabled={loading || confirmText !== TARGET_TEXT} 
                            onClick={handleDelete} 
                            className="w-full px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Eliminando...' : 'Eliminar Permanentemente'}
                        </button>
                        <button disabled={loading} onClick={onClose} className="w-full px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition">
                            Mejor no, volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfiguracionPage;
