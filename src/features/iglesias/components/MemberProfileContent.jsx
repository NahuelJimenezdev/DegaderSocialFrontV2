import React, { useState, useEffect } from 'react';
import { userService } from '../../../api';
import iglesiaService from '../../../api/iglesiaService';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import { logger } from '../../../shared/utils/logger';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, Cake, MapPin, Heart, Clock, Phone, UserMinus, AlertTriangle, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import SeccionAdministrativaMinisterios from './SeccionAdministrativaMinisterios';
import { MINISTERIOS_DISPONIBLES } from '../hooks/useMinisterios';
import { formatNivelDetallado } from '../../fundacion/utils/obtenerNivel';

const MemberProfileContent = ({ userId, iglesiaId, isPastor, onMemberRemoved }) => {
    const { user: currentUser, refreshProfile } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showExpulsionModal, setShowExpulsionModal] = useState(false);
    const [expulsionMotivo, setExpulsionMotivo] = useState('');
    const [expulsionLoading, setExpulsionLoading] = useState(false);

    useEffect(() => {
        loadUserInfo();
    }, [userId]);

    const loadUserInfo = async () => {
        try {
            setLoading(true);
            const response = await userService.getUserById(userId);

            if (response.success) {
                setUserInfo(response.data);

                // Si el usuario editado es el mismo logueado, actualizar el contexto global
                if (currentUser && (currentUser._id === userId || currentUser.id === userId)) {
                    await refreshProfile();
                }
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
            const dateStr = typeof date === 'string' ? date.split('T')[0] : date.toISOString().split('T')[0];
            const [year, month, day] = dateStr.split('-').map(Number);
            const localDate = new Date(year, month - 1, day);
            return format(localDate, "d 'de' MMMM 'de' yyyy", { locale: es });
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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !userInfo) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                <p className="text-red-500 dark:text-red-400 mb-4">{error || 'Usuario no encontrado'}</p>
            </div>
        );
    }

    const avatar = getUserAvatar(userInfo);
    const fullName = `${userInfo.nombres?.primero || ''} ${userInfo.apellidos?.primero || ''}`.trim() || 'Usuario';

    return (
        <div className="w-full">
            {/* User Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <img
                        src={avatar}
                        alt={fullName}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/20"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {fullName}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {userInfo.eclesiastico?.rolPrincipal === 'pastor_principal' ? 'Pastor Principal' :
                                userInfo.eclesiastico?.rolPrincipal === 'adminIglesia' ? 'Administrador de Iglesia' :
                                    'Miembro de la iglesia'}
                        </p>
                        {/* Mostrar ministerios activos */}
                        {userInfo.eclesiastico?.ministerios?.filter(m => m.activo).length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {userInfo.eclesiastico.ministerios
                                    .filter(m => m.activo)
                                    .map((ministerio, index) => {
                                        const ministerioLabel = MINISTERIOS_DISPONIBLES.find(m => m.value === ministerio.nombre)?.label || ministerio.nombre;
                                        const cargoLabel = ministerio.cargo === 'lider' ? 'Líder' : ministerio.cargo === 'sublider' ? 'Sublíder' : 'Miembro';
                                        return (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                            >
                                                {cargoLabel} de {ministerioLabel}
                                            </span>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    {userInfo.eclesiastico?.fechaBautismo && (
                        <InfoItem
                            icon={Calendar}
                            label="Fecha de bautismo"
                            value={formatDate(userInfo.eclesiastico.fechaBautismo)}
                            subtitle={`Hace ${calculateTimeSince(userInfo.eclesiastico.fechaBautismo)}`}
                        />
                    )}
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
                        value={userInfo.personal?.fechaNacimiento ? formatDate(userInfo.personal.fechaNacimiento) : null}
                        notConfirmed={!userInfo.personal?.fechaNacimiento}
                    />
                    <InfoItem
                        icon={MapPin}
                        label="Ubicación"
                        value={(userInfo.personal?.ubicacion?.ciudad || userInfo.personal?.ubicacion?.pais)
                            ? [userInfo.personal.ubicacion.ciudad, userInfo.personal.ubicacion.pais].filter(Boolean).join(', ')
                            : null}
                        notConfirmed={!userInfo.personal?.ubicacion?.ciudad && !userInfo.personal?.ubicacion?.pais}
                    />
                    {userInfo.personal?.celular && (
                        <InfoItem
                            icon={Phone}
                            label="Celular"
                            value={userInfo.personal.celular}
                        />
                    )}
                </InfoCard>

                {/* Información de Fundación */}
                {(userInfo.esMiembroFundacion || userInfo.fundacion?.nivel) && (
                    <InfoCard
                        icon={Building2}
                        title="Fundación"
                        iconColor="text-indigo-600"
                        bgColor="bg-indigo-50 dark:bg-indigo-900/20"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Cargo y Jurisdicción
                                </p>
                                <p className="text-base text-gray-900 dark:text-white leading-relaxed">
                                    Se desempeña como <span className="font-bold">{userInfo.fundacion?.cargo || 'Miembro'}</span> 
                                    {userInfo.fundacion?.area ? ` en la ${userInfo.fundacion.area}` : ''}
                                    {' '}{formatNivelDetallado(userInfo)}
                                </p>
                            </div>
                        </div>
                    </InfoCard>
                )}
            </div>

            {/* Sección Administrativa de Ministerios */}
            {currentUser && iglesiaId && (
                <SeccionAdministrativaMinisterios
                    usuario={userInfo}
                    iglesiaId={iglesiaId}
                    currentUser={currentUser}
                    isPastor={isPastor}
                    onUpdate={loadUserInfo}
                />
            )}

            {/* Botón Expulsar Miembro - Solo visible para el pastor y no sobre sí mismo */}
            {isPastor && userId !== currentUser?._id && userId !== currentUser?.id && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Zona de administración
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Remover a este miembro de la iglesia
                            </p>
                        </div>
                        <button
                            onClick={() => setShowExpulsionModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
                        >
                            <UserMinus className="w-4 h-4" />
                            Expulsar miembro
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Expulsión */}
            {showExpulsionModal && (
                <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                                <UserMinus className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Expulsar miembro
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {fullName}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Esta acción removerá al miembro de la iglesia. Se registrará en el historial de salidas y el miembro recibirá una notificación.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Motivo (opcional)
                            </label>
                            <textarea
                                value={expulsionMotivo}
                                onChange={(e) => setExpulsionMotivo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                rows={3}
                                placeholder="Ej: Inactividad prolongada, conducta inapropiada..."
                                maxLength={300}
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => { setShowExpulsionModal(false); setExpulsionMotivo(''); }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                disabled={expulsionLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        setExpulsionLoading(true);
                                        await iglesiaService.expulsarMiembro(iglesiaId, userId, expulsionMotivo);
                                        setShowExpulsionModal(false);
                                        setExpulsionMotivo('');
                                        if (onMemberRemoved) onMemberRemoved(userId);
                                    } catch (err) {
                                        logger.error('Error al expulsar miembro:', err);
                                        alert(err.response?.data?.message || 'Error al expulsar miembro');
                                    } finally {
                                        setExpulsionLoading(false);
                                    }
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                disabled={expulsionLoading}
                            >
                                {expulsionLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                ) : (
                                    <UserMinus className="w-4 h-4" />
                                )}
                                {expulsionLoading ? 'Expulsando...' : 'Confirmar expulsión'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                    <p className="text-base font-medium text-gray-600 dark:text-gray-400 break-words">
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

export default MemberProfileContent;
