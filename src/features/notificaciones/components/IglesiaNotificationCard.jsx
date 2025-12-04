import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import iglesiaService from '../../../api/iglesiaService';
import notificationService from '../../../api/notificationService';
import { useToast } from '../../../shared/components/Toast/ToastProvider';

const IglesiaNotificationCard = ({ notification, onAction }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  console.log('🔔 IglesiaNotificationCard - notification:', notification);

  const { emisor, metadata, createdAt, tipo, referencia } = notification;
  const { iglesiaNombre, solicitanteId } = metadata || {};
  
  // Obtener ID de la iglesia de forma segura
  const iglesiaId = referencia?.id || referencia?._id;

  // Formatear tiempo relativo
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'ahora';
    if (minutes < 60) return `hace ${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours}h`;
    
    const days = Math.floor(hours / 24);
    return `hace ${days}d`;
  };

  const handleAction = async (accion) => {
    if (!iglesiaId) {
      console.error('❌ No se pudo obtener el ID de la iglesia:', referencia);
      toast.error('Error: No se puede identificar la iglesia');
      return;
    }

    if (!solicitanteId) {
      console.error('❌ No se pudo obtener el ID del solicitante:', metadata);
      toast.error('Error: No se puede identificar el solicitante');
      return;
    }

    setLoading(true);
    try {
      console.log('📤 Gestionando solicitud:', { iglesiaId, solicitanteId, accion });
      
      await iglesiaService.manageRequest(
        iglesiaId,
        solicitanteId,
        accion
      );
      
      toast.success(
        accion === 'aprobar' 
          ? 'Solicitud aprobada exitosamente' 
          : 'Solicitud rechazada'
      );

      // Eliminar la notificación del backend para que no vuelva a aparecer
      try {
        await notificationService.deleteNotification(notification._id);
      } catch (deleteError) {
        console.warn('⚠️ Error al eliminar notificación (puede que ya no exista):', deleteError);
      }
      
      // Notificar al componente padre para actualizar la lista
      if (onAction) {
        onAction(notification._id);
      }
    } catch (error) {
      console.error('❌ Error al gestionar solicitud:', error);
      toast.error('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (iglesiaId) {
      navigate(`/Mi_iglesia/${iglesiaId}`);
    }
  };

  // Obtener nombre del solicitante
  const getNombreSolicitante = () => {
    if (emisor?.nombres?.primero && emisor?.apellidos?.primero) {
      return `${emisor.nombres.primero} ${emisor.apellidos.primero}`;
    }
    return 'Usuario';
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-4 transition-all duration-200 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start gap-3">
        {/* Avatar del solicitante */}
        <div 
          className="flex-shrink-0 cursor-pointer"
          onClick={handleClick}
        >
          <img
            src={getUserAvatar(emisor)}
            alt={getNombreSolicitante()}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
          />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div 
            className="cursor-pointer"
            onClick={handleClick}
          >
            <p className="text-sm text-gray-900 dark:text-white">
              <span className="font-semibold">
                {getNombreSolicitante()}
              </span>
              {' '}
              <span className="text-gray-600 dark:text-gray-400">
                desea unirse a
              </span>
              {' '}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {iglesiaNombre || 'la iglesia'}
              </span>
            </p>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatTime(createdAt)}
            </p>
          </div>

          {/* Botones de acción */}
          {tipo === 'solicitud_iglesia' && (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => handleAction('aprobar')}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Check size={16} />
                Aceptar
              </button>
              <button
                onClick={() => handleAction('rechazar')}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <X size={16} />
                Rechazar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de no leída */}
      {!notification.leida && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full"></div>
      )}
    </div>
  );
};

export default IglesiaNotificationCard;
