import React from 'react';
import { FileText, UserCircle, CheckCircle, Clock } from 'lucide-react';

const DocumentCard = ({ title, description, buttonText, onClick, status, icon: Icon }) => {
  const isCompleted = status === 'Completado';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start gap-4 md:gap-6">
        {/* Icono */}
        <div className={`flex-shrink-0 p-3.5 rounded-2xl ${isCompleted ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'} transition-colors group-hover:scale-105 duration-300 h-fit`}>
          <Icon size={28} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
              {title}
            </h3>
            <div className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider ${
              isCompleted 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            }`}>
              {isCompleted ? <CheckCircle size={14} /> : <Clock size={14} />}
              {status}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>
        
        {/* Acción */}
        <div className="flex-shrink-0 hidden md:block">
          <button
            onClick={onClick}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${
              isCompleted
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98]'
            }`}
          >
            <FileText size={18} />
            {buttonText}
          </button>
        </div>
      </div>

      {/* Botón en móvil */}
      <div className="mt-4 md:hidden">
        <button
          onClick={onClick}
          className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${
            isCompleted
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              : 'bg-blue-600 text-white shadow-md'
          }`}
        >
          <FileText size={18} />
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default function DocumentCards({ user, onNavigate }) {
  // Documentos lógica de estado
  const docs = [
    {
      id: 1,
      title: "Aplicativo República Argentina",
      description: "Completa y actualiza tu documentación específica para la Fundación Humanitaria Internacional Sol y Luna en Argentina.",
      buttonText: "Rellenar formulario",
      status: user?.fundacion?.documentacionFHSYL?.ultimaActualizacion ? 'Completado' : 'Pendiente',
      icon: FileText,
      path: '/fundacion/documentacion-fhsyl'
    },
    {
      id: 2,
      title: "Entrevista Fundación",
      description: "Completa la entrevista inicial requerida para formar parte de la fundación.",
      buttonText: "Realizar entrevista",
      status: user?.fundacion?.entrevista?.completado ? 'Completado' : 'Pendiente',
      icon: UserCircle,
      path: '/fundacion/entrevista'
    },
    {
      id: 3,
      title: "Formato de Hoja de Vida",
      description: "Completa tu hoja de vida con tu información personal, profesional y ministerial.",
      buttonText: "Completar hoja de vida",
      status: user?.fundacion?.hojaDeVida?.completado ? 'Completado' : 'Pendiente',
      icon: FileText,
      path: '/fundacion/hoja-de-vida'
    },
    {
      id: 4,
      title: "Solicitud de Ingreso",
      description: "Una vez completados los documentos anteriores, podrás enviar tu solicitud oficial para formar parte de la fundación.",
      buttonText: "Enviar solicitud",
      status: (user?.fundacion?.estadoAprobacion === 'aprobado' || user?.fundacion?.estadoAprobacion === 'pendiente') ? 'Completado' : 'Pendiente',
      icon: CheckCircle,
      path: null // Acción especial
    }
  ];

  return (
    <div className="flex flex-col gap-4 mb-10">
      {docs.map((doc) => (
        <DocumentCard 
          key={doc.id}
          {...doc}
          onClick={() => doc.path ? onNavigate(doc.path) : null}
        />
      ))}
    </div>
  );
}
