import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DocumentCards from '../components/DocumentCards';
import { useFundacion } from '../hooks/useFundacion';
import { Loader2, ChevronLeft } from 'lucide-react';

const DocumentosPage = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    // Hook de Fundación para estados de carga
    const { loading } = useFundacion(user, updateUser);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-blue-200 font-medium tracking-wide">Cargando documentación...</p>
            </div>
        );
    }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header con Botón Volver */}
        <div className="flex items-center gap-4 mb-10">
            <button 
                onClick={() => navigate('/fundacion')}
                className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all text-gray-600 dark:text-gray-400 active:scale-95"
            >
                <ChevronLeft size={24} />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Documentación Requerida
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Completa los pasos obligatorios para tu ingreso a la Fundación.
                </p>
            </div>
        </div>

        <div className="page-container px-0 shadow-none border-none bg-transparent">
            {/* Sección de Documentos */}
            <DocumentCards 
                user={user} 
                onNavigate={(path, options) => navigate(path, options)} 
            />
        </div>
    </div>
  )
}

export default DocumentosPage