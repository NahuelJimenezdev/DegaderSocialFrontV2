import React from 'react';
import { FileText, UserCircle, CheckCircle, Clock } from 'lucide-react';

const DocumentCard = ({ title, description, buttonText, onClick, status, icon: Icon, locked }) => {
  const isCompleted = status === 'Completado';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm transition-all group ${locked ? 'opacity-75' : 'hover:shadow-md'}`}>
      <div className="flex items-start gap-4 md:gap-6">
        {/* Icono */}
        <div className={`flex-shrink-0 p-3.5 rounded-2xl ${
          locked ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : 
          isCompleted ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
        } transition-colors ${!locked && 'group-hover:scale-105'} duration-300 h-fit`}>
          <Icon size={28} />
        </div>

        {/* Info */}
        <div className="flex-1 text-left">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className={`text-xl font-bold transition-colors ${locked ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
              {title}
            </h3>
            {!locked ? (
              <div className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider ${
                isCompleted 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
              }`}>
                {isCompleted ? <CheckCircle size={14} /> : <Clock size={14} />}
                {status}
              </div>
            ) : (
              <div className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500">
                <Clock size={14} />
                Bloqueado
              </div>
            )}
          </div>
          <p className={`leading-relaxed max-w-2xl ${locked ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`}>
            {description}
          </p>
        </div>
        
        {/* Acción */}
        <div className="flex-shrink-0 hidden md:block">
          <button
            onClick={!locked ? onClick : undefined}
            disabled={locked}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${
              locked
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : isCompleted
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98]'
            }`}
          >
            <FileText size={18} />
            {locked ? 'Pendiente completar otros' : (isCompleted ? 'Visualizar documento' : buttonText)}
          </button>
        </div>
      </div>

      {/* Botón en móvil */}
      <div className="mt-4 md:hidden">
        <button
          onClick={!locked ? onClick : undefined}
          disabled={locked}
          className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${
            locked
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : isCompleted
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                : 'bg-blue-600 text-white shadow-md'
          }`}
        >
          <FileText size={18} />
          {locked ? 'Debes completar lo anterior' : (isCompleted ? 'Visualizar documento' : buttonText)}
        </button>
      </div>
    </div>
  );
};

export default function DocumentCards({ user, onNavigate }) {
  // Prerrequisitos completados
  const isFHSYLDone = !!user?.fundacion?.documentacionFHSYL?.ultimaActualizacion;
  const isEntrevistaDone = !!user?.fundacion?.entrevista?.completado;
  const isHojaDeVidaDone = !!user?.fundacion?.hojaDeVida?.completado;
  const allPrerequisitesMet = isFHSYLDone && isEntrevistaDone && isHojaDeVidaDone;

  // Documentos lógica de estado
  const docs = [
    {
      id: 1,
      type: 'Aplicativo',
      title: "Aplicativo República Argentina",
      description: "Completa y actualiza tu documentación específica para la Fundación Humanitaria Internacional Sol y Luna en Argentina.",
      buttonText: "Rellenar formulario",
      status: isFHSYLDone ? 'Completado' : 'Pendiente',
      icon: FileText,
      path: '/fundacion/documentacion-fhsyl',
      locked: false
    },
    {
      id: 2,
      type: 'Entrevista',
      title: "Entrevista Fundación",
      description: "Completa la entrevista inicial requerida para formar parte de la fundación.",
      buttonText: "Realizar entrevista",
      status: isEntrevistaDone ? 'Completado' : 'Pendiente',
      icon: UserCircle,
      path: '/fundacion/entrevista',
      locked: false
    },
    {
      id: 3,
      type: 'HojaDeVida',
      title: "Formato de Hoja de Vida",
      description: "Completa tu hoja de vida con tu información personal, profesional y ministerial.",
      buttonText: "Completar hoja de vida",
      status: isHojaDeVidaDone ? 'Completado' : 'Pendiente',
      icon: FileText,
      path: '/fundacion/hoja-de-vida',
      locked: false
    },
    {
      id: 4,
      type: 'Solicitud',
      title: "Solicitud de Ingreso",
      description: "Una vez completados los documentos anteriores, podrás enviar tu solicitud oficial para formar parte de la fundación.",
      buttonText: "Enviar solicitud",
      status: (user?.fundacion?.estadoAprobacion === 'aprobado' || user?.fundacion?.estadoAprobacion === 'pendiente') ? 'Completado' : 'Pendiente',
      icon: CheckCircle,
      path: '/fundacion/solicitud',
      locked: !allPrerequisitesMet
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
