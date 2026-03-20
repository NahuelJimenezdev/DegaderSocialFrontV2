import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  FileText, 
  Download, 
  Eye, 
  Package, 
  User, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import userService from '../../../api/userService';
import { 
  generateCV, 
  generateFHSYL, 
  generateEntrevista, 
  generateSolicitud 
} from '../utils/docUtils';

export default function UserDocumentationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUserById(id);
        setTargetUser(data);
      } catch (error) {
        toast.error('Error al cargar datos del usuario');
        navigate('/fundacion/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleDownload = async (type) => {
    if (!targetUser) return;
    setDownloading(true);
    try {
      let blob;
      let filename = '';
      const nameStr = `${targetUser.nombres.primero}_${targetUser.apellidos.primero}`.replace(/\s+/g, '_');

      switch (type) {
        case 'cv':
          blob = await generateCV(targetUser);
          filename = `Hoja_de_Vida_${nameStr}.docx`;
          break;
        case 'fhsyl':
          blob = generateFHSYL(targetUser);
          filename = `FHSYL_Argentina_${nameStr}.doc`;
          break;
        case 'entrevista':
          blob = generateEntrevista(targetUser);
          filename = `Entrevista_${nameStr}.doc`;
          break;
        case 'solicitud':
          blob = generateSolicitud(targetUser);
          filename = `Solicitud_Ingreso_${nameStr}.doc`;
          break;
        default: return;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Documento generado con éxito');
    } catch (error) {
      console.error(error);
      toast.error('Error al generar el documento');
    } finally {
      setDownloading(false);
    }
  };

  const downloadAll = async () => {
    setDownloading(true);
    try {
      toast.loading('Generando paquete de documentos...');
      await handleDownload('cv');
      await new Promise(r => setTimeout(r, 1000));
      await handleDownload('fhsyl');
      await new Promise(r => setTimeout(r, 1000));
      await handleDownload('entrevista');
      await new Promise(r => setTimeout(r, 1000));
      await handleDownload('solicitud');
      toast.dismiss();
      toast.success('Todos los documentos han sido generados');
    } catch (error) {
      toast.error('Ocurrió un error al descargar el paquete');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Cargando documentación...</p>
      </div>
    );
  }

  const DOCS = [
    { id: 'cv', title: 'Hoja de Vida', desc: 'Perfil profesional, educación y experiencia.', status: !!targetUser?.fundacion?.hojaDeVida?.ultimaActualizacion },
    { id: 'fhsyl', title: 'Aplicativo Argentina', desc: 'Información pastoral y aplicativo FHSYL.', status: !!targetUser?.fundacion?.documentacionFHSYL?.ultimaActualizacion },
    { id: 'entrevista', title: 'Entrevista Fundación', desc: 'Respuestas a la entrevista de ingreso.', status: !!targetUser?.fundacion?.entrevista?.ultimaActualizacion },
    { id: 'solicitud', title: 'Solicitud de Ingreso', desc: 'Datos de jerarquía y área asignada.', status: !!targetUser?.fundacion?.nivel }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/fundacion/admin')}
            className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all text-gray-600 dark:text-gray-400 active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Documentación: <span className="text-blue-600">{targetUser.nombres.primero} {targetUser.apellidos.primero}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Visualiza y descarga los documentos oficiales requeridos.
            </p>
          </div>
        </div>
        
        <button 
          onClick={downloadAll}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {downloading ? <Loader2 className="animate-spin" size={20} /> : <Package size={20} />}
          Descargar Todo el Paquete
        </button>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {DOCS.map((doc) => (
          <div 
            key={doc.id}
            className="group bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                  <FileText size={24} />
                </div>
                {doc.status ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    <CheckCircle size={14} />
                    Completado
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    <AlertCircle size={14} />
                    Pendiente
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{doc.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 flex-1">
                {doc.desc}
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => handleDownload(doc.id)}
                  disabled={!doc.status || downloading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95 border border-gray-100 dark:border-gray-600/50"
                >
                  <Download size={18} />
                  Descargar
                </button>
                <button 
                  disabled={!doc.status}
                  className="p-3 bg-white dark:bg-gray-800 text-blue-600 border border-blue-100 dark:border-blue-900/50 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  title="Vista Previa"
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Bio Card */}
      <div className="mt-12 bg-gradient-to-r from-gray-900 to-blue-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white/10 p-1 border border-white/20">
             <img 
               src={targetUser.avatar || '/avatars/default-avatar.png'} 
               className="w-full h-full object-cover rounded-2xl" 
               alt="Avatar"
             />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold">{targetUser.nombres.primero} {targetUser.apellidos.primero}</h4>
            <p className="text-blue-200 mt-1 uppercase tracking-widest text-xs font-bold">
              {targetUser.fundacion?.cargo} • {targetUser.fundacion?.area}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <span className="flex items-center gap-2 text-sm bg-white/10 px-4 py-1.5 rounded-xl border border-white/10">
                <User size={16} className="text-blue-300" />
                {targetUser.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
