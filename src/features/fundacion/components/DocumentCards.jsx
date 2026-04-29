import React, { useState, useEffect } from 'react';
import fundacionService from '../../../api/fundacionService';
import { FileText, UserCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

const DocumentCard = ({ title, description, buttonText, onClick, status, icon: Icon, locked, overrideButtonText, disableAction }) => {
  const isCompleted = status === 'Completado' || status === 'Aprobado';
  const isRejected = status === 'Rechazado';
  const isEvaluando = status === 'Evaluando' || status === 'Pendiente';

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    if (isRejected) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
  };

  const getIconColor = () => {
    if (locked) return 'bg-gray-100 dark:bg-gray-700 text-gray-400';
    if (isCompleted) return 'bg-green-50 dark:bg-green-900/20 text-green-600';
    if (isRejected) return 'bg-red-50 dark:bg-red-900/20 text-red-600';
    return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600';
  };

  const StatusIcon = isCompleted ? CheckCircle : (isRejected ? XCircle : Clock);
  
  const finalButtonText = locked ? 'Pendiente completar otros' : (overrideButtonText || (isCompleted ? 'Visualizar documento' : buttonText));
  const isButtonDisabled = locked || disableAction;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm transition-all group ${locked ? 'opacity-75' : 'hover:shadow-md'}`}>
      <div className="flex items-start gap-4 md:gap-6">
        {/* Icono */}
        <div className={`flex-shrink-0 p-3.5 rounded-2xl ${getIconColor()} transition-colors ${!locked && 'group-hover:scale-105'} duration-300 h-fit`}>
          <Icon size={28} />
        </div>

        {/* Info */}
        <div className="flex-1 text-left">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className={`text-xl font-bold transition-colors ${locked ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
              {title}
            </h3>
            {!locked ? (
              <div className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider ${getStatusColor()}`}>
                <StatusIcon size={14} />
                {status}
              </div>
            ) : (
              <div className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500">
                <Clock size={14} />
                Bloqueado
              </div>
            )}
          </div>
          <div className={`leading-relaxed max-w-2xl ${locked ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`}>
            {description}
          </div>
        </div>
        
        {/* Acción */}
        <div className="flex-shrink-0 hidden md:block">
          <button
            onClick={!isButtonDisabled ? onClick : undefined}
            disabled={isButtonDisabled}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${
              isButtonDisabled
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : isCompleted || overrideButtonText
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98]'
            }`}
          >
            <FileText size={18} />
            {finalButtonText}
          </button>
        </div>
      </div>

      {/* Botón en móvil */}
      <div className="mt-4 md:hidden">
        <button
          onClick={!isButtonDisabled ? onClick : undefined}
          disabled={isButtonDisabled}
          className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${
            isButtonDisabled
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : isCompleted || overrideButtonText
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                : 'bg-blue-600 text-white shadow-md'
          }`}
        >
          <FileText size={18} />
          {finalButtonText}
        </button>
      </div>
    </div>
  );
};

export default function DocumentCards({ user, onNavigate }) {
  const [systemLocked, setSystemLocked] = useState(false);
  const isFounder = user?.email === 'founderdegader@degadersocial.com';

  useEffect(() => {
    const fetchLockStatus = async () => {
      try {
        const res = await fundacionService.getSystemLock();
        if (res?.success) setSystemLocked(res.data.locked);
      } catch (error) {
        console.error('Error fetching system lock', error);
      }
    };
    fetchLockStatus();
  }, []);

  const handleToggleLock = async () => {
    try {
      const res = await fundacionService.toggleSystemLock();
      if (res?.success) setSystemLocked(res.locked);
    } catch (error) {
      console.error('Error toggling system lock', error);
    }
  };

  // Prerrequisitos completados
  const isFHSYLDone = !!user?.fundacion?.documentacionFHSYL?.ultimaActualizacion;
  const isEntrevistaDone = !!user?.fundacion?.entrevista?.completado;
  const isHojaDeVidaDone = !!user?.fundacion?.hojaDeVida?.completado;
  const allPrerequisitesMet = isFHSYLDone && isEntrevistaDone && isHojaDeVidaDone;

  const estadoAprobacion = user?.fundacion?.estadoAprobacion;
  
  let solicitudStatus = 'Pendiente';
  let solicitudOverrideButton = null;
  let disableSolicitudAction = false;

  if (estadoAprobacion === 'aprobado') {
      solicitudStatus = 'Aprobado';
      solicitudOverrideButton = 'Aprobado';
      disableSolicitudAction = true;
  } else if (estadoAprobacion === 'rechazado') {
      solicitudStatus = 'Rechazado';
      solicitudOverrideButton = 'Rehacer documentación';
      disableSolicitudAction = false;
  } else if (estadoAprobacion === 'pendiente') {
      solicitudStatus = 'Pendiente';
      solicitudOverrideButton = 'Pendiente';
      disableSolicitudAction = false; // Permitir completar o visualizar
  } else {
      // Estado inicial (nulo o undefined)
      solicitudStatus = 'Pendiente';
  }

  // Mantenimiento global
  const maintenanceMessage = (
    <span className="inline-block bg-[#ccff00] text-black font-bold px-3 py-1 rounded shadow-sm border border-[#aacc00]">
      Estamos actualizando el sistema, por estos momentos no hay acceso.
    </span>
  );

  // Documentos lógica de estado
  const docs = [
    {
      id: 1,
      type: 'Aplicativo',
      title: `Aplicativo ${user.fundacion?.territorio?.pais || user.personal?.ubicacion?.pais || 'República Argentina'}`,
      description: systemLocked ? maintenanceMessage : `Completa y actualiza tu documentación específica para la Fundación en ${user.fundacion?.territorio?.pais || user.personal?.ubicacion?.pais || 'tu país'}.`,
      buttonText: "Rellenar formulario",
      status: isFHSYLDone ? 'Completado' : 'Pendiente',
      icon: FileText,
      path: '/fundacion/documentacion-fhsyl',
      locked: systemLocked,
      overrideButtonText: systemLocked ? 'Mantenimiento' : null,
      disableAction: systemLocked
    },
    {
      id: 2,
      type: 'Entrevista',
      title: "Entrevista Fundación",
      description: systemLocked ? maintenanceMessage : "Completa la entrevista inicial requerida para formar parte de la fundación.",
      buttonText: "Realizar entrevista",
      status: isEntrevistaDone ? 'Completado' : 'Pendiente',
      icon: UserCircle,
      path: '/fundacion/entrevista',
      locked: systemLocked,
      overrideButtonText: systemLocked ? 'Mantenimiento' : null,
      disableAction: systemLocked
    },
    {
      id: 3,
      type: 'HojaDeVida',
      title: "Formato de Hoja de Vida",
      description: systemLocked ? maintenanceMessage : "Completa tu hoja de vida con tu información personal, profesional y ministerial.",
      buttonText: "Completar hoja de vida",
      status: isHojaDeVidaDone ? 'Completado' : 'Pendiente',
      icon: FileText,
      path: '/fundacion/hoja-de-vida',
      locked: systemLocked,
      overrideButtonText: systemLocked ? 'Mantenimiento' : null,
      disableAction: systemLocked
    },
    {
      id: 4,
      type: 'Solicitud',
      title: "Solicitud de Ingreso",
      description: "Una vez completados los documentos anteriores, podrás enviar tu solicitud oficial para formar parte de la fundación.",
      buttonText: "Enviar solicitud",
      status: solicitudStatus,
      icon: CheckCircle,
      path: '/fundacion/solicitud',
      locked: !allPrerequisitesMet && estadoAprobacion !== 'rechazado',
      overrideButtonText: solicitudOverrideButton,
      disableAction: disableSolicitudAction
    }
  ];

  const handleAction = (doc) => {
    // Solicitud y Hoja de Vida siempre van al formulario, sin pasar por el visor
    if (doc.type === 'Solicitud' || doc.type === 'HojaDeVida') {
      onNavigate(doc.path);
      return;
    }

    if (doc.status === 'Completado') {
      onNavigate('/fundacion/visor', { state: { type: doc.type } });
    } else if (doc.path) {
      onNavigate(doc.path);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-10">
      {isFounder && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between mb-2">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Panel Founder: Modo Mantenimiento</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Bloquea los formularios temporalmente para todos los usuarios.</p>
          </div>
          <button
            onClick={handleToggleLock}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              systemLocked
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
            }`}
          >
            {systemLocked ? 'Desactivar Bloqueo' : 'Activar Bloqueo'}
          </button>
        </div>
      )}

      {docs.map((doc) => (
        <DocumentCard 
          key={doc.id}
          {...doc}
          onClick={() => handleAction(doc)}
        />
      ))}
    </div>
  );
}
