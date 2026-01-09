import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Users,
    Briefcase,
    MapPin,
    Cake,
    Clock,
    Building2,
    Heart
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { userService } from '../../../api';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import { logger } from '../../../shared/utils/logger';

const UserInfoPage = () => {
    const { nombreapellido } = useParams();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUserInfo();
    }, [nombreapellido]);

    const loadUserInfo = async () => {
        try {
            setLoading(true);
            // El nombreapellido es en realidad el userId que viene de la navegación
            const response = await userService.getUserById(nombreapellido);

            if (response.success) {
                setUserInfo(response.data);
            } else {
                setError('No se pudo cargar la información del usuario');
            }
        } catch (err) {
            logger.error('Error al cargar información del usuario:', err);
            setError('Error al cargar la información');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'No disponible';
        try {
            return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: es });
        } catch {
            return 'Fecha inválida';
        }
    };

    const calculateTimeSince = (date) => {
        if (!date) return 'No disponible';
        try {
            const start = new Date(date);
            const now = new Date();
            const diffTime = Math.abs(now - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffDays / 365);

            if (diffYears > 0) {
                return `${diffYears} ${diffYears === 1 ? 'año' : 'años'}`;
            } else if (diffMonths > 0) {
                return `${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
            } else {
                return `${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
            }
        } catch {
            return 'No disponible';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !userInfo) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-red-500 dark:text-red-400 mb-4">{error || 'Usuario no encontrado'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    const avatar = getUserAvatar(userInfo);
    const fullName = `${userInfo.nombre} ${userInfo.apellido}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Volver</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* User Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <img
                            src={avatar}
                            alt={fullName}
                            className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/20"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {fullName}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Información de la cuenta
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información de Cuenta */}
                    <InfoCard
                        icon={Calendar}
                        title="Información de Cuenta"
                        iconColor="text-blue-500"
                        bgColor="bg-blue-50 dark:bg-blue-900/20"
                    >
                        <InfoItem
                            icon={Clock}
                            label="Miembro desde"
                            value={formatDate(userInfo.fechaRegistro || userInfo.createdAt)}
                            subtitle={`Hace ${calculateTimeSince(userInfo.fechaRegistro || userInfo.createdAt)}`}
                        />
                        {userInfo.fechaAmistad && (
                            <InfoItem
                                icon={Heart}
                                label="Amigos desde"
                                value={formatDate(userInfo.fechaAmistad)}
                                subtitle={`Hace ${calculateTimeSince(userInfo.fechaAmistad)}`}
                            />
                        )}
                    </InfoCard>

                    {/* Información Personal */}
                    <InfoCard
                        icon={Cake}
                        title="Información Personal"
                        iconColor="text-purple-500"
                        bgColor="bg-purple-50 dark:bg-purple-900/20"
                    >
                        <InfoItem
                            icon={Cake}
                            label="Cumpleaños"
                            value={userInfo.cumpleaños ? formatDate(userInfo.cumpleaños) : null}
                            notConfirmed={!userInfo.cumpleaños}
                        />
                        <InfoItem
                            icon={MapPin}
                            label="Ubicación"
                            value={(userInfo.ciudad || userInfo.pais) ? [userInfo.ciudad, userInfo.pais].filter(Boolean).join(', ') : null}
                            notConfirmed={!userInfo.ciudad && !userInfo.pais}
                        />
                    </InfoCard>

                    {/* Cargo en Iglesia */}
                    {userInfo.cargoIglesia && (
                        <InfoCard
                            icon={Building2}
                            title="Cargo en Iglesia"
                            iconColor="text-indigo-500"
                            bgColor="bg-indigo-50 dark:bg-indigo-900/20"
                        >
                            <InfoItem
                                icon={Briefcase}
                                label="Cargo"
                                value={userInfo.cargoIglesia.nombre || 'No especificado'}
                            />
                            {userInfo.cargoIglesia.iglesia && (
                                <InfoItem
                                    icon={Building2}
                                    label="Iglesia"
                                    value={userInfo.cargoIglesia.iglesia}
                                />
                            )}
                        </InfoCard>
                    )}

                    {/* Cargo en Fundación */}
                    {userInfo.cargoFundacion && (
                        <InfoCard
                            icon={Users}
                            title="Cargo en Fundación"
                            iconColor="text-green-500"
                            bgColor="bg-green-50 dark:bg-green-900/20"
                        >
                            <InfoItem
                                icon={Briefcase}
                                label="Cargo"
                                value={userInfo.cargoFundacion.nombre || 'No especificado'}
                            />
                            {userInfo.cargoFundacion.area && (
                                <InfoItem
                                    icon={Users}
                                    label="Área"
                                    value={userInfo.cargoFundacion.area}
                                />
                            )}
                        </InfoCard>
                    )}
                </div>
            </div>
        </div>
    );
};

// Componente Card Reutilizable
const InfoCard = ({ icon: Icon, title, iconColor, bgColor, children }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className={`${bgColor} p-2 rounded-lg`}>
                    <Icon className={`${iconColor} w-5 h-5`} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h2>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

// Componente Item de Información
const InfoItem = ({ icon: Icon, label, value, subtitle, notConfirmed }) => {
    return (
        <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {label}
                </p>
                {notConfirmed ? (
                    <p className="text-base font-bold text-gray-600 dark:text-gray-400 break-words">
                        Sin confirmar
                    </p>
                ) : (
                    <p className="text-base font-medium text-gray-900 dark:text-white break-words">
                        {value || 'No disponible'}
                    </p>
                )}
                {subtitle && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserInfoPage;
