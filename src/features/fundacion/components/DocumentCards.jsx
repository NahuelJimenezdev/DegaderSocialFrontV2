import React from 'react';
import { FileText, UserCircle, CheckCircle, Clock } from 'lucide-react';

const DocumentCard = ({ title, description, buttonText, onClick, status, icon: Icon }) => {
  const isCompleted = status === 'Completado';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-lg ${isCompleted ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
            <Icon size={24} />
          </div>
          <div className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${
            isCompleted 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
          }`}>
            {isCompleted ? <CheckCircle size={14} /> : <Clock size={14} />}
            {status}
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          {description}
        </p>
      </div>
      
      <button
        onClick={onClick}
        className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
          isCompleted
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.98]'
        }`}
      >
        <FileText size={18} />
        {buttonText}
      </button>
    </div>
  );
};

export default function DocumentCards({ user, onNavigate }) {
  // Documentos lógica de estado (Mock por ahora para los nuevos)
  const docs = [
    {
      id: 1,
      title: "Aplicativo República Argentina",
      description: "Completa y actualiza tu documentación específica para la Fundación Humanitaria Sol y Luna en Argentina.",
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
