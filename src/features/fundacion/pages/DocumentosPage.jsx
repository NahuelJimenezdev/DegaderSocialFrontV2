import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DocumentCards from '../components/DocumentCards';
import { useFundacion } from '../hooks/useFundacion';
import { Loader2 } from 'lucide-react';

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
    <div className="page-container max-w-7xl mx-auto px-4 py-8">
      {/* Sección de Documentos */}
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Documentación Requerida
      </h3>
      
      <DocumentCards 
          user={user} 
          onNavigate={(path, options) => navigate(path, options)} 
      />
    </div>
  )
}

export default DocumentosPage