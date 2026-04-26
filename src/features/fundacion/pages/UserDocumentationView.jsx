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
  Loader2,
  MessageCircle,
  Mail,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import userService from '../../../api/userService';
import { 
  generateCV, 
  generateFHSYL, 
  generateEntrevista, 
  generateSolicitud,
  generateUserZip,
  downloadCV
} from '../utils/docUtils';
import fundacionService from '../../../api/fundacionService';
import { Calendar, Award, Star as StarIcon } from 'lucide-react';
import { getWhatsAppLink } from '../../whatsapp/utils/whatsappHelper';
import { getUserAvatar, handleImageError } from '../../../shared/utils/avatarUtils';

export default function UserDocumentationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [evalData, setEvalData] = useState({
    fechaIngresoReal: '',
    puntajeCompromiso: 0,
    puntajeParticipacion: 0
  });
  const [savingEval, setSavingEval] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fundacionService.getUsuarioJurisdiccionDetalle(id);
        if (res.success) {
          setTargetUser(res.data);
          setEvalData({
            fechaIngresoReal: res.data.fundacion?.fechaIngresoReal ? new Date(res.data.fundacion.fechaIngresoReal).toISOString().split('T')[0] : '',
            puntajeCompromiso: res.data.fundacion?.puntajeCompromiso || 0,
            puntajeParticipacion: res.data.fundacion?.puntajeParticipacion || 0
          });
        } else {
          toast.error('No se pudo cargar la información del usuario');
          navigate('/fundacion/admin');
        }
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
    console.log('Iniciando descarga de tipo:', type);
    try {
      let blob;
      let filename = '';
      const nameStr = `${targetUser.nombres?.primero || 'Usuario'}_${targetUser.apellidos?.primero || ''}`.replace(/\s+/g, '_');

      switch (type) {
        case 'cv':
          console.log('Generando Hoja de Vida unificada...');
          await downloadCV(targetUser);
          setDownloading(false);
          return; // downloadCV ya maneja el saveAs
        case 'fhsyl':
          const fhsylCountry = targetUser.fundacion?.territorio?.pais || targetUser.personal?.ubicacion?.pais || 'Argentina';
          console.log(`Generando Aplicativo ${fhsylCountry}...`);
          blob = await generateFHSYL(targetUser);
          filename = `FHSYL_${fhsylCountry.replace(/\s+/g, '_')}_${nameStr}.doc`;
          break;
        case 'entrevista':
          console.log('Generando Entrevista...');
          blob = await generateEntrevista(targetUser);
          filename = `Entrevista_${nameStr}.doc`;
          break;
        case 'solicitud':
          console.log('Generando Solicitud...');
          blob = await generateSolicitud(targetUser);
          filename = `Solicitud_Ingreso_${nameStr}.doc`;
          break;
        default: return;
      }

      if (!blob) throw new Error('No se pudo generar el blob del documento');
      console.log('Documento generado, procediendo a descargar. Tamaño:', blob.size);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Documento generado con éxito');
    } catch (error) {
      console.error('Error detallado handleDownload:', error);
      toast.error('Error al generar el documento: ' + error.message);
    } finally {
      setDownloading(false);
    }
  };

  const handlePreview = (docId) => {
    const typeMap = {
      'cv': 'Hoja de Vida',
      'fhsyl': 'Aplicativo',
      'entrevista': 'Entrevista',
      'solicitud': 'Solicitud'
    };
    console.log('Abriendo vista previa para:', typeMap[docId]);
    navigate('/fundacion/visor', { 
      state: { 
        type: typeMap[docId], 
        data: targetUser // Pasamos el usuario cargado como data para el visor
      } 
    });
  };

  const downloadAll = async () => {
    if (!targetUser) return;
    setDownloading(true);
    try {
      const loadingToast = toast.loading('Preparando paquete de documentos...');
      await generateUserZip(targetUser);
      toast.dismiss(loadingToast);
      toast.success('¡Paquete descargado con éxito!');
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al generar el ZIP');
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveEval = async () => {
    setSavingEval(true);
    try {
      const res = await fundacionService.updateValoracionManual(id, evalData);
      if (res.success) {
        toast.success('Valoración actualizada correctamente');
        setTargetUser(prev => ({
          ...prev,
          fundacion: { ...prev.fundacion, ...res.data }
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la valoración');
    } finally {
      setSavingEval(false);
    }
  };

  const getAntiguedad = () => {
    if (!targetUser?.fundacion?.fechaIngresoReal) return 'No registrada';
    const ingreso = new Date(targetUser.fundacion.fechaIngresoReal);
    const hoy = new Date();
    const diffTime = Math.abs(hoy - ingreso);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) return `${diffDays} días`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} meses`;
    const diffYears = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    return `${diffYears} años ${remainingMonths > 0 ? `y ${remainingMonths} meses` : ''}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-vh-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Cargando documentación...</p>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-gray-500 font-medium">No se pudo cargar la información del usuario.</p>
        <button 
          onClick={() => navigate('/fundacion/admin')}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl"
        >
          Volver al Panel
        </button>
      </div>
    );
  }

  const DOCS = [
    { 
      id: 'cv', 
      title: 'Hoja de Vida', 
      desc: 'Perfil profesional, educación y experiencia.', 
      status: targetUser?.fundacion?.hojaDeVida?.completado 
    },
    { 
      id: 'fhsyl', 
      title: `Aplicativo ${targetUser?.fundacion?.territorio?.pais || targetUser?.personal?.ubicacion?.pais || 'Argentina'}`, 
      desc: 'Información pastoral y aplicativo específico por país.', 
      status: targetUser?.fundacion?.documentacionFHSYL?.completado || !!targetUser?.fundacion?.documentacionFHSYL?.testimonioConversion 
    },
    { 
      id: 'entrevista', 
      title: 'Entrevista Fundación', 
      desc: 'Respuestas a la entrevista de ingreso.', 
      status: targetUser?.fundacion?.entrevista?.completado 
    },
    { 
      id: 'solicitud', 
      title: 'Solicitud de Ingreso', 
      desc: 'Datos de jerarquía y área asignada.', 
      status: !!targetUser?.fundacion?.nivel 
    }
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
              Documentación: <span className="text-blue-600">{targetUser.nombres?.primero || ''} {targetUser.apellidos?.primero || ''}</span>
              {targetUser.fundacion?.puntajeGestion > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-black shadow-sm border border-amber-200 dark:border-amber-800 ml-2">
                  <Star size={14} fill="currentColor" />
                  <span>Valoración: {targetUser.fundacion.puntajeGestion.toFixed(1)}</span>
                </div>
              )}
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

      {/* --- SECCIÓN DE VALORACIÓN Y DESEMPEÑO --- */}
      <div className="mb-10 bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/10 rounded-full blur-3xl" />
        
        <div className="flex flex-col lg:flex-row gap-10 relative">
          {/* Columna Izquierda: Información de Antigüedad */}
          <div className="lg:w-1/3 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">Antigüedad Fundación</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Tiempo real de servicio activo</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Fecha de Ingreso Real</label>
                <input 
                  type="date" 
                  value={evalData.fechaIngresoReal}
                  onChange={(e) => setEvalData(prev => ({ ...prev, fechaIngresoReal: e.target.value }))}
                  className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-amber-500 transition-all outline-none"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 ml-1">Tiempo Calculado</span>
                <span className="text-2xl font-black text-gray-800 dark:text-gray-200 ml-1">{getAntiguedad()}</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Calificaciones Manuales */}
          <div className="lg:w-2/3 space-y-6">
             <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">Criterios de Desempeño</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Valoración subjetiva del superior jerárquico</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Nivel de Compromiso</label>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">{evalData.puntajeCompromiso}/10</span>
                  </div>
                  <input 
                    type="range" min="0" max="10" step="0.5"
                    value={evalData.puntajeCompromiso}
                    onChange={(e) => setEvalData(prev => ({ ...prev, puntajeCompromiso: e.target.value }))}
                    className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[10px] text-gray-400 italic px-1">Lealtad, cumplimiento de normas y sentido de pertenencia.</p>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Participación Activa</label>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{evalData.puntajeParticipacion}/10</span>
                  </div>
                  <input 
                    type="range" min="0" max="10" step="0.5"
                    value={evalData.puntajeParticipacion}
                    onChange={(e) => setEvalData(prev => ({ ...prev, puntajeParticipacion: e.target.value }))}
                    className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <p className="text-[10px] text-gray-400 italic px-1">Asistencia a reuniones, aporte de ideas y proactividad.</p>
               </div>
            </div>

            <div className="pt-4 flex justify-end">
               <button 
                onClick={handleSaveEval}
                disabled={savingEval}
                className="flex items-center gap-2 px-8 py-3 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
               >
                 {savingEval ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                 Guardar Valoraciones
               </button>
            </div>
          </div>
        </div>
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
                  onClick={() => handlePreview(doc.id)}
                  disabled={!doc.status}
                  className="p-3 bg-white dark:bg-gray-800 text-blue-600 border border-blue-100 dark:border-blue-900/50 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
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
      <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl relative overflow-hidden group">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 transition-transform group-hover:scale-110 duration-700" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 dark:bg-white/10 p-1 border border-gray-200 dark:border-white/20 shadow-inner">
             <img 
               src={getUserAvatar(targetUser)} 
               className="w-full h-full object-cover rounded-2xl" 
               alt={`${targetUser.nombres?.primero || 'Usuario'}`}
               onError={handleImageError}
             />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              {targetUser.nombres?.primero || 'Usuario'} {targetUser.apellidos?.primero || ''}
            </h4>
            <p className="text-blue-600 dark:text-blue-300 mt-1 uppercase tracking-widest text-xs font-bold">
              {targetUser.fundacion?.cargo || 'Sin Cargo'} • {targetUser.fundacion?.area || 'Sin Área'}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
              <span className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl border border-gray-100 dark:border-white/10">
                <Mail size={16} className="text-blue-500" />
                {targetUser.email}
              </span>

              {targetUser.personal?.celular && (
                <a 
                  href={getWhatsAppLink(targetUser)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95 border border-green-400/20"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
