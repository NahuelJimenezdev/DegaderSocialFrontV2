import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, FileText, Printer, Edit3 } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

export default function DocumentViewer() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { type, data } = location.state || {};

  if (!type || !user) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500 mb-4">No se encontró información del documento.</p>
        <button onClick={() => navigate('/fundacion')} className="text-blue-600 font-bold underline">Volver a Fundación</button>
      </div>
    );
  }

  const handleDownloadWord = () => {
    // Basic HTML to Word implementation
    const content = document.getElementById('document-preview').innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Documento</title><style>"+
            "body { font-family: 'Arial', sans-serif; padding: 20px; text-align: justify; }"+
            "h1, h2 { color: #1e3a8a; text-align: center; }"+
            "h3 { color: #1e3a8a; text-align: left; }" +
            ".section { background: #f3f4f6; padding: 5px; margin-top: 20px; font-weight: bold; }"+
            "table { width: 100%; border-collapse: collapse; }"+
            "td, th { border: 1px solid #ddd; padding: 8px; }"+
            "p { text-align: justify; }"+
            "</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Documento_${type}_${user.nombres.primero}_${user.nombres.primero}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (type) {
      case 'Aplicativo':
      case 'Solicitud':
        const appData = user.fundacion?.documentacionFHSYL || {};
        return (
          <div id="document-preview" className="text-gray-900 bg-white">
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-blue-900 mb-1">
                APLICATIVO REPUBLICA ARGENTINA
              </h1>
              <h2 className="text-xl font-medium text-gray-700">
                Fundación Humanitaria Sol y Luna
              </h2>
            </div>
            
            {/* Informacion Basica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-8 text-[15px]">
              <div className="flex gap-2">
                <span className="font-bold">Nombre:</span>
                <span className="border-b border-gray-300 flex-1 min-w-[150px]">{user.nombres?.primero} {user.nombres?.segundo} {user.apellidos?.primero} {user.apellidos?.segundo}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Dirección:</span>
                <span className="border-b border-gray-300 flex-1">{user.personal?.direccion || '---'}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Localidad:</span>
                <span className="border-b border-gray-300 flex-1">{user.personal?.ubicacion?.ciudad || '---'}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Barrio:</span>
                <span className="border-b border-gray-300 flex-1">{user.personal?.ubicacion?.barrio || '---'}</span>
                <span className="font-bold ml-2">UPZ:</span>
                <span className="border-b border-gray-300 min-w-[50px]">{appData.upz || '---'}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Celular:</span>
                <span className="border-b border-gray-300 flex-1">{user.personal?.celular || '---'}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Email:</span>
                <span className="border-b border-gray-300 flex-1">{user.email || '---'}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Ocupación:</span>
                <span className="border-b border-gray-300 flex-1">{appData.ocupacion || '---'}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Estado Civil:</span>
                <span className="border-b border-gray-300 flex-1">{appData.estadoCivil || '---'}</span>
              </div>
              <div className="flex gap-2 md:col-span-2">
                <span className="font-bold">Nombre del Cónyugue:</span>
                <span className="border-b border-gray-300 flex-1">{appData.nombreConyuge || '---'}</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="font-bold mb-2">Nombre de los hijos, y su respectiva edad:</p>
              <ul className="list-disc ml-8 space-y-1">
                {appData.hijos && appData.hijos.length > 0 ? (
                  appData.hijos.map((hijo, i) => (
                    <li key={i}>{hijo.nombre} ({hijo.edad} años)</li>
                  ))
                ) : (
                  <li>Sin registros</li>
                )}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-10">
              <div className="flex gap-2">
                <span className="font-bold">Desea ser Coordinador de una Localidad:</span>
                <span className="border-b border-gray-300 min-w-[60px] text-center">{appData.deseaSerCoordinadorLocalidad ? 'SI' : 'NO'}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Localidad:</span>
                <span className="border-b border-gray-300 flex-1">{appData.localidadCoordinar || '---'}</span>
              </div>
            </div>

            {/* Secciones de Vida y Ministerio */}
            <div className="space-y-8">
              <section>
                <h3 className="bg-gray-100 p-2 font-bold text-[16px] border-l-4 border-blue-900 mb-3">1. Comparta su testimonio personal brevemente, y su conversión a Cristo Jesús:</h3>
                <p className="text-justify px-2 leading-relaxed whitespace-pre-wrap">{appData.testimonioConversion || '---'}</p>
              </section>

              <section>
                <h3 className="bg-gray-100 p-2 font-bold text-[16px] border-l-4 border-blue-900 mb-3">2. Compártanos acerca de su llamado Pastoral:</h3>
                <p className="text-justify px-2 leading-relaxed whitespace-pre-wrap">{appData.llamadoPastoral || '---'}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h3 className="bg-gray-100 p-2 font-bold text-[16px] border-l-4 border-blue-900 mb-3">3. Tres virtudes personales:</h3>
                  <ol className="list-decimal ml-8 space-y-1">
                    {appData.virtudes?.map((v, i) => <li key={i}>{v}</li>) || <li>---</li>}
                  </ol>
                </section>
                <section>
                  <h3 className="bg-gray-100 p-2 font-bold text-[16px] border-l-4 border-blue-900 mb-3">4. Dos áreas por mejorar:</h3>
                  <ol className="list-decimal ml-8 space-y-1">
                    {appData.areasMejora?.map((v, i) => <li key={i}>{v}</li>) || <li>---</li>}
                  </ol>
                </section>
              </div>

              <section>
                <h3 className="bg-gray-100 p-2 font-bold text-[16px] border-l-4 border-blue-900 mb-3">5. Dos eventos de éxito en su ministerio:</h3>
                <ol className="list-decimal ml-8 space-y-1">
                  {appData.eventosExito?.map((v, i) => <li key={i}>{v}</li>) || <li>---</li>}
                </ol>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-6">
                <div className="flex gap-2 md:col-span-2">
                  <span className="font-bold">Nombre de la Congregación que Pastorea:</span>
                  <span className="border-b border-gray-300 flex-1">{appData.nombreCongregacionPastorea || '---'}</span>
                </div>
                <div className="flex gap-2 md:col-span-2">
                  <span className="font-bold">Alianza de pastores a la cual pertenece:</span>
                  <span className="border-b border-gray-300 flex-1">{appData.alianzaPastores || '---'}</span>
                </div>
              </div>

              <section>
                <h3 className="bg-gray-100 p-2 font-bold text-[16px] border-l-4 border-blue-900 mb-3">6. Referencias (No familiares):</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                  {appData.referencias?.map((ref, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-bold text-blue-800 underline">Referencia {idx + 1}</p>
                      <p><strong>Nombre:</strong> {ref.nombre || '---'}</p>
                      <p><strong>Relación:</strong> {ref.relacion || '---'}</p>
                      <p><strong>Contacto:</strong> {ref.contacto || '---'}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex gap-2 pt-4">
                <span className="font-bold">Nombre del pastor que le Invitó:</span>
                <span className="border-b border-gray-300 flex-1">{appData.pastorQueInvito || '---'}</span>
              </div>

              <section>
                <h3 className="bg-blue-900 text-white p-2 font-bold text-[17px] text-center mb-4">PREGUNTAS FINALES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-6">
                  <div className="flex gap-2">
                    <span className="font-bold">1. ¿Tiene Casa Propia?</span>
                    <span className="border-b border-gray-300 min-w-[60px] text-center">{appData.tieneCasaPropia ? 'SI' : 'NO'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold">2. ¿La iglesia tiene propiedad?</span>
                    <span className="border-b border-gray-300 min-w-[60px] text-center">{appData.iglesiaTienePropiedad ? 'SI' : 'NO'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <p className="font-bold mb-2">3. Necesidades familia Pastoral:</p>
                    <ol className="list-decimal ml-8 space-y-1">
                      {appData.necesidadesFamiliaPastoral?.map((v, m) => <li key={m}>{v}</li>) || <li>---</li>}
                    </ol>
                  </div>
                  <div>
                    <p className="font-bold mb-2">4. Necesidades congregación:</p>
                    <ol className="list-decimal ml-8 space-y-1">
                      {appData.necesidadesCongregacion?.map((v, n) => <li key={n}>{v}</li>) || <li>---</li>}
                    </ol>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="font-bold mb-1">5. Profesionales en su iglesia:</p>
                    <p className="px-2 italic">{appData.profesionalesIglesia || 'Ninguno especificado'}</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">6. Proyecto Psico-social a desarrollar:</p>
                    <p className="px-2 italic">{appData.proyectoPsicosocial || 'Ninguno especificado'}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case 'Entrevista':
        const entData = user.fundacion?.entrevista?.respuestas || {};
        const entRes = typeof entData === 'object' && !Array.isArray(entData) ? entData : {};
        
        return (
          <div id="document-preview" className="text-gray-900 bg-white">
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-blue-900 mb-1">
                ENTREVISTA FUNDACIONAL
              </h1>
              <h2 className="text-xl font-medium text-gray-700">
                Fundación Humanitaria Sol y Luna
              </h2>
            </div>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex gap-2">
                <span className="font-bold">Nombre:</span>
                <span className="border-b border-gray-300 flex-1">{entRes.nombre || `${user.nombres?.primero} ${user.apellidos?.primero}`}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Fecha Nacimiento:</span>
                <span className="border-b border-gray-300 flex-1">{entRes.fechaNacimiento || '---'}</span>
              </div>
              <div className="flex gap-2 md:col-span-2">
                <span className="font-bold">UPZ/Localidad:</span>
                <span className="border-b border-gray-300 flex-1">{entRes.upzLocalidad || '---'}</span>
              </div>
            </section>

            <div className="space-y-6">
              <section>
                <h3 className="bg-gray-100 p-2 font-bold text-[16px] border-l-4 border-blue-900 mb-3">Ministerio</h3>
                <div className="space-y-4 px-2">
                  <div>
                    <p className="font-bold text-sm text-blue-800">¿Cuál es su llamado?</p>
                    <p className="italic">{entRes.llamado || '---'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-blue-800">¿Qué es lo que más le gusta de servir?</p>
                    <p className="italic">{entRes.loQueMasGusta || '---'}</p>
                  </div>
                </div>
              </section>
              
              <section>
                <h3 className="bg-gray-100 p-2 font-bold text-[16px] border-l-4 border-blue-900 mb-3">Carácter</h3>
                <div className="space-y-4 px-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-sm text-blue-800">¿Qué dicen sus amigos?</p>
                      <p className="italic">{entRes.caracterAmigos || '---'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-blue-800">¿Qué dicen sus compañeros?</p>
                      <p className="italic">{entRes.caracterCompañeros || '---'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-blue-800">¿Cómo reacciona ante situaciones difíciles?</p>
                    <p className="italic">{entRes.situacionDificil || '---'}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="bg-gray-100 p-2 font-bold text-[16px] border-l-4 border-blue-900 mb-3">Compromiso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
                  <div>
                    <p className="font-bold text-sm text-blue-800">Tiempo pastoreando:</p>
                    <p className="italic">{entRes.tiempoPastoreando || '---'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-blue-800">Disponibilidad de tiempo:</p>
                    <p className="italic">{entRes.disponibilidadTiempo || '---'}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      default:
        return <p className="text-center py-10">Vista previa no disponible para este tipo de documento.</p>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <button onClick={() => navigate('/fundacion')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition-colors">
          <ChevronLeft size={20} />
          Volver a Fundación
        </button>

        <div className="flex gap-3">
          {(type === 'Aplicativo' || type === 'Solicitud') && (
             <button 
              onClick={() => navigate('/fundacion/documentacion-fhsyl')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200 transition"
            >
              <Edit3 size={18} />
              Modificar
            </button>
          )}
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            <Printer size={18} />
            Imprimir / PDF
          </button>
          <button 
            onClick={handleDownloadWord}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md shadow-blue-500/20"
          >
            <Download size={18} />
            Descargar Word
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative max-h-[1000px] overflow-y-auto print:max-h-none print:overflow-visible">
        {/* Marca de agua o estilo de hoja */}
        <div className="p-8 md:p-16 bg-gray-50/30">
          <div className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.05)] w-full max-w-4xl mx-auto min-h-[842px] p-12 md:p-20 border border-gray-100">
             {renderContent()}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .flex, button { display: none !important; }
          .bg-white { box-shadow: none !important; border: none !important; }
          body { background: white !important; }
          .max-w-5xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .rounded-3xl { border-radius: 0 !important; }
          .bg-gray-50\/30 { background: white !important; padding: 0 !important; }
          .p-12 { padding: 0 !important; }
          .max-h-\[1000px\] { max-height: none !important; overflow: visible !important; }
        }
      `}</style>
    </div>
  );
}
