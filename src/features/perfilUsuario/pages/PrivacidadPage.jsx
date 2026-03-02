import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../api';
import { ArrowLeft, Lock, Users, Shield, MessagesSquare, Eye, Ghost } from 'lucide-react';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import '../../../shared/styles/layout.mobile.css';

const PrivacidadPage = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const toast = useToast();
    
    const [loading, setLoading] = useState(false);
    
    // Estado local para Privacidad (mapeado de user.social.privacidad)
    const [privacidad, setPrivacidad] = useState({
        amigosVisible: 'todos',
        iglesiaVisible: true,
        arenaIncognito: false,
        quienPuedeMensajear: 'todos',
        perfilPublico: true,
        permitirEtiquetas: true
    });

    useEffect(() => {
        if (user?.social?.privacidad) {
            setPrivacidad(user.social.privacidad);
        }
    }, [user]);

    const updatePrivacidad = async (key, value) => {
        try {
            setLoading(true);
            
            const updatedPrivacidad = {
                ...privacidad,
                [key]: value
            };

            setPrivacidad(updatedPrivacidad);

            const res = await userService.updateProfile({
                social: {
                    privacidad: updatedPrivacidad
                }
            });

            if (res.success) {
                if(user) {
                     login(res.data, localStorage.getItem('token'));
                }
                toast.success('Privacidad actualizada');
            }
        } catch (error) {
            console.error('Error al guardar privacidad:', error);
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
                            <Lock size={20} className="text-purple-500" />
                            Privacidad y Seguridad
                        </h1>
                    </div>
                </div>
            </div>

            <div className="mt-4 mb-mobile-67">
                <div className="max-w-3xl mx-auto px-4 space-y-6">
                    
                    {/* SECCIÓN: VISIBILIDAD DE INFORMACIÓN */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-2">
                            <Eye size={18} className="text-gray-500" />
                            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visibilidad de Información</h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            
                            <ToggleRow 
                                label="Perfil Público" 
                                description="Tu información es visible para usuarios no registrados"
                                value={privacidad.perfilPublico}
                                onChange={(val) => updatePrivacidad('perfilPublico', val)}
                                disabled={loading}
                            />
                            
                            <div className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <label className="block text-gray-900 dark:text-white font-medium text-sm mb-1">
                                    Visibilidad de amigos
                                </label>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">¿Quién puede ver tu lista de amigos desde tu perfil?</p>
                                <select 
                                    className="w-full sm:w-1/2 rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-purple-500 focus:border-purple-500 text-sm py-2"
                                    value={privacidad.amigosVisible}
                                    onChange={(e) => updatePrivacidad('amigosVisible', e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="todos">Todos los usuarios ({`Público`})</option>
                                    <option value="amigos">Solo mis amigos</option>
                                    <option value="solo_yo">Nadie (Solo yo)</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    {/* SECCIÓN: PRIVACIDAD MODULAR */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-2">
                            <Shield size={18} className="text-gray-500" />
                            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Privacidad en Módulos</h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            
                            <ToggleRow 
                                label="Visibilidad Eclesiástica" 
                                description="Mostrar públicamente a qué iglesia pertenezco y mi ministerio."
                                value={privacidad.iglesiaVisible}
                                onChange={(val) => updatePrivacidad('iglesiaVisible', val)}
                                disabled={loading}
                            />

                            <ToggleRow 
                                label="Modo Incógnito en Arena" 
                                description="Al activarlo, tu perfil y foto no figurarán en los Ranking globales."
                                icon={<Ghost size={16} className="text-blue-500" />}
                                value={privacidad.arenaIncognito}
                                onChange={(val) => updatePrivacidad('arenaIncognito', val)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* SECCIÓN: INTERACCIONES */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-2">
                            <MessagesSquare size={18} className="text-gray-500" />
                            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Interacciones</h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            
                            <div className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <label className="block text-gray-900 dark:text-white font-medium text-sm mb-1">
                                    ¿Quién puede enviarme mensajes directos?
                                </label>
                                <select 
                                    className="w-full sm:w-1/2 rounded-lg border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-purple-500 focus:border-purple-500 text-sm py-2 mt-2"
                                    value={privacidad.quienPuedeMensajear}
                                    onChange={(e) => updatePrivacidad('quienPuedeMensajear', e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="todos">Todos los usuarios</option>
                                    <option value="amigos">Solo mis amigos</option>
                                    <option value="nadie">Nadie</option>
                                </select>
                            </div>

                            <ToggleRow 
                                label="Permitir Etiquetas" 
                                description="Autorizar que amigos o páginas te mencionen en publicaciones."
                                value={privacidad.permitirEtiquetas}
                                onChange={(val) => updatePrivacidad('permitirEtiquetas', val)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Toggle UI Component
const ToggleRow = ({ label, description, value, onChange, disabled, icon }) => {
    return (
        <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
            <div className="pr-4">
                <p className="text-gray-900 dark:text-white font-medium text-sm flex items-center gap-2">
                    {icon} {label}
                </p>
                {description && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">{description}</p>}
            </div>
            <button
                disabled={disabled}
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${value ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-600'} ${disabled ? 'opacity-50' : ''}`}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
        </div>
    );
};

export default PrivacidadPage;
