import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, FileText, Printer, Edit3 } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

export default function DocumentViewer() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { type, data: stateData } = location.state || {};
  // Priorizar los datos pasados por estado (para administradores) o los del propio usuario
  const targetUser = stateData || user;
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll window to top
    window.scrollTo(0, 0);
    
    // Scroll main layout container to top if exists
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }

    // Scroll internal container to top
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [type]);

  if (!type || !targetUser) {
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
    link.download = `Documento_${type}_${targetUser.nombres?.primero}_${targetUser.apellidos?.primero}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (type) {
      case 'Aplicativo':
      case 'Solicitud':
        const appData = targetUser.fundacion?.documentacionFHSYL || {};
        return (
          <div id="document-preview" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-blue-900 dark:text-blue-400 mb-1">
                APLICATIVO REPUBLICA ARGENTINA
              </h1>
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                Fundación Humanitaria Sol y Luna
              </h2>
            </div>
            
            {/* Informacion Basica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-8 text-[15px]">
              <div className="flex flex-col">
                <span className="font-bold">Nombre:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1 min-w-[150px]">{targetUser.nombres?.primero} {targetUser.nombres?.segundo} {targetUser.apellidos?.primero} {targetUser.apellidos?.segundo}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Dirección:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{targetUser.personal?.direccion || '---'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Localidad:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{targetUser.personal?.ubicacion?.ciudad || '---'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Barrio:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{targetUser.personal?.ubicacion?.barrio || '---'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold ml-2">UPZ:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 min-w-[50px]">{appData.upz || '---'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Celular:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{targetUser.personal?.celular || '---'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Email:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{targetUser.email || '---'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Ocupación:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{appData.ocupacion || '---'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Estado Civil:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{appData.estadoCivil || '---'}</span>
              </div>
              <div className="flex flex-col md:col-span-2">
                <span className="font-bold">Nombre del Cónyugue:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{appData.nombreConyuge || '---'}</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="font-bold mb-2">Nombre de los hijos, y su respectiva edad:</p>
              <ul className="list-disc ml-8 space-y-1">
                  {(targetUser.fundacion?.documentacionFHSYL?.hijos || []).length > 0 ? (
                    targetUser.fundacion.documentacionFHSYL.hijos.map((hijo, i) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300">
                        <span className="font-bold">{hijo.nombre}</span>
                        {hijo.edad !== undefined && hijo.edad !== null && hijo.edad !== '' && (
                          <span className="ml-1 text-gray-500">({hijo.edad} años)</span>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">Sin registros</li>
                  )}
              </ul>
            </div>

            <div className="flex flex-col mb-2">
              <span className="font-bold">Desea ser Coordinador de una Localidad:</span>
              <span className="border-b border-gray-300 dark:border-gray-600 min-w-[60px] text-center">{appData.deseaSerCoordinadorLocalidad ? 'SI' : 'NO'}</span>
            </div>
            <div className="flex flex-col mb-8">
              <span className="font-bold">Localidad:</span>
              <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{appData.localidadCoordinar || '---'}</span>
            </div>

            {/* Secciones de Vida y Ministerio */}
            <div className="space-y-8">
              <section>
                <h3 className="bg-gray-100 dark:bg-gray-700 p-2 font-bold text-[16px] border-l-4 border-blue-900 dark:border-blue-400 mb-3 text-blue-900 dark:text-blue-100">1. Comparta su testimonio personal brevemente, y su conversión a Cristo Jesús:</h3>
                <p className="text-justify px-2 leading-relaxed whitespace-pre-wrap">{appData.testimonioConversion || '---'}</p>
              </section>

              <section>
                <h3 className="bg-gray-100 dark:bg-gray-700 p-2 font-bold text-[16px] border-l-4 border-blue-900 dark:border-blue-400 mb-3 text-blue-900 dark:text-blue-100">2. Compártanos acerca de su llamado Pastoral:</h3>
                <p className="text-justify px-2 leading-relaxed whitespace-pre-wrap">{appData.llamadoPastoral || '---'}</p>
              </section>

              <section>
                <h3 className="bg-gray-100 dark:bg-gray-700 p-2 font-bold text-[16px] border-l-4 border-blue-900 dark:border-blue-400 mb-3 text-blue-900 dark:text-blue-100">3. Tres virtudes personales:</h3>
                <ol className="text-justify list-decimal ml-8 space-y-1">
                  {appData.virtudes?.map((v, i) => <li key={i}>{v}</li>) || <li>---</li>}
                </ol>
              </section>
              <section>
                <h3 className="bg-gray-100 dark:bg-gray-700 p-2 font-bold text-[16px] border-l-4 border-blue-900 dark:border-blue-400 mb-3 text-blue-900 dark:text-blue-100">4. Dos áreas por mejorar:</h3>
                <ol className="text-justify list-decimal ml-8 space-y-1">
                  {appData.areasMejora?.map((v, i) => <li key={i}>{v}</li>) || <li>---</li>}
                </ol>
              </section>

              <section>
                <h3 className="bg-gray-100 dark:bg-gray-700 p-2 font-bold text-[16px] border-l-4 border-blue-900 dark:border-blue-400 mb-3 text-blue-900 dark:text-blue-100">5. Dos eventos de éxito en su ministerio:</h3>
                <ol className="text-justify list-decimal ml-8 space-y-1">
                  {appData.eventosExito?.map((v, i) => <li key={i}>{v}</li>) || <li>---</li>}
                </ol>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 mb-6">
                <div className="flex flex-col md:col-span-2">
                  <span className="font-bold">Nombre de la Congregación que Pastorea:</span>
                  <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{appData.nombreCongregacionPastorea || '---'}</span>
                </div>
                <div className="flex flex-col md:col-span-2">
                  <span className="font-bold">Alianza de pastores a la cual pertenece:</span>
                  <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{appData.alianzaPastores || '---'}</span>
                </div>
              </div>

              <section>
                <h3 className="bg-gray-100 dark:bg-gray-700 p-2 font-bold text-[16px] border-l-4 border-blue-900 dark:border-blue-400 mb-3 text-blue-900 dark:text-blue-100">6. Referencias (No familiares):</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                  {appData.referencias?.map((ref, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-bold text-blue-800 dark:text-blue-400 underline">Referencia {idx + 1}</p>
                      <p><strong>Nombre:</strong> {ref.nombre || '---'}</p>
                      <p><strong>Relación:</strong> {ref.relacion || '---'}</p>
                      <p><strong>Contacto:</strong> {ref.contacto || '---'}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex gap-2 pt-4">
                <span className="font-bold">Nombre del pastor que le Invitó:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{appData.pastorQueInvito || '---'}</span>
              </div>

              <section>
                <h3 className="bg-blue-900 dark:bg-blue-800 text-white p-2 font-bold text-[17px] text-center mb-4 uppercase tracking-wider">Preguntas Finales</h3>
                  <div className="flex flex-col">
                    <span className="font-bold">1. ¿Tiene Casa Propia?</span>
                    <span className="border-b border-gray-300 dark:border-gray-600 min-w-[60px] text-center">{appData.tieneCasaPropia ? 'SI' : 'NO'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">2. ¿La iglesia tiene propiedad?</span>
                    <span className="border-b border-gray-300 dark:border-gray-600 min-w-[60px] text-center">{appData.iglesiaTienePropiedad ? 'SI' : 'NO'}</span>
                  </div>

                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-bold mb-2">3. Necesidades familia Pastoral:</p>
                    <ol className="text-justify list-decimal ml-8 space-y-1">
                      {appData.necesidadesFamiliaPastoral?.map((v, m) => <li key={m}>{v}</li>) || <li>---</li>}
                    </ol>
                  </div>
                  <div>
                    <p className="font-bold mb-2">4. Necesidades congregación:</p>
                    <ol className="text-justify list-decimal ml-8 space-y-1">
                      {appData.necesidadesCongregacion?.map((v, n) => <li key={n}>{v}</li>) || <li>---</li>}
                    </ol>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-bold mb-1">5. Profesionales en su iglesia:</p>
                    <p className="text-justify px-2 italic">{appData.profesionalesIglesia || 'Ninguno especificado'}</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">6. Proyecto Psico-social a desarrollar:</p>
                    <p className="text-justify px-2 italic">{appData.proyectoPsicosocial || 'Ninguno especificado'}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case 'Hoja de Vida':
      case 'HojaDeVida':
        const cvData = targetUser.fundacion?.hojaDeVida?.datos || {};
        
        // Helper para renderizar valor o placeholder
        const cv = (key, fallback = '---') => cvData[key] || fallback;
        
        // Helper para renderizar foto/firma
        const getImgUrl = (val) => {
          if (!val) return null;
          if (typeof val === 'string' && (val.startsWith('http') || val.startsWith('data:'))) return val;
          return null;
        };

        return (
          <div id="document-preview" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-blue-900 dark:text-blue-400 mb-1">
                HOJA DE VIDA
              </h1>
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                Fundación Humanitaria Sol y Luna
              </h2>
            </div>

            {/* Foto de perfil */}
            {getImgUrl(cvData.foto_perfil_form) && (
              <div className="flex justify-center mb-6">
                <img src={getImgUrl(cvData.foto_perfil_form)} alt="Foto" className="w-32 h-32 rounded-2xl object-cover border-2 border-gray-200 dark:border-gray-600 shadow-md" />
              </div>
            )}

            {/* INFORMACIÓN PERSONAL */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4">
              <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-3 text-lg border-b border-gray-200 dark:border-gray-600 pb-2">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><strong>Nombre Completo:</strong> {cv('nombre_completo', `${targetUser.nombres?.primero || ''} ${targetUser.apellidos?.primero || ''}`)}</p>
                <p><strong>Documento N°:</strong> {cv('documento_num')}</p>
                <p><strong>Lugar Expedición:</strong> {cv('lugar_expedicion')}</p>
                <p><strong>Fecha Nacimiento:</strong> {cv('fecha_nacimiento')}</p>
                <p><strong>Nacionalidad:</strong> {cv('nacionalidad')}</p>
                <p><strong>Estado Civil:</strong> {cv('estado_civil')}</p>
                <p><strong>Departamento/Estado:</strong> {cv('departamento_estado_provincia')}</p>
                <p><strong>Municipio:</strong> {cv('municipio')}</p>
                <p><strong>Dirección:</strong> {cv('direccion')}</p>
                <p><strong>Teléfono:</strong> {cv('telefono')}</p>
                <p><strong>Email:</strong> {cv('email')}</p>
              </div>
              {cv('frase_identificadora', '') && (
                <p className="mt-3 italic text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-2">
                  <strong>Frase Identificadora:</strong> {cv('frase_identificadora')}
                </p>
              )}
              {cv('descripcion_breve_ministerio_profesion', '') && (
                <p className="mt-2 italic text-gray-600 dark:text-gray-400">
                  <strong>Descripción Ministerio/Profesión:</strong> {cv('descripcion_breve_ministerio_profesion')}
                </p>
              )}
            </div>

            {/* NIVEL EDUCATIVO */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4">
              <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-3 text-lg border-b border-gray-200 dark:border-gray-600 pb-2">Nivel Educativo</h3>
              <p className="text-sm mb-2"><strong>Educación Básica:</strong> {cv('completa/incompleta', 'completa')}</p>
              {[1,2,3].map(n => cv(`nombreTitulo_${n}`, '') ? (
                <div key={n} className="text-sm mb-1">
                  <strong>Título {n}:</strong> {cv(`nombreTitulo_${n}`)}
                  {cv(`numero_aprobado_${n}`, '') && <span className="ml-2 text-gray-500">({cv(`numero_aprobado_${n}`)} semestres)</span>}
                </div>
              ) : null)}
            </div>

            {/* EXPERIENCIA LABORAL */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4">
              <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-3 text-lg border-b border-gray-200 dark:border-gray-600 pb-2">Experiencia Laboral</h3>
              {[
                { emp: 'empresa_actual', cargo: 'cargo_empresa', dir: 'direccion_empresa', depto: 'departamento_empresa', mun: 'municipio_empresa', tel: 'telefono_empresa', email: 'email_empresa', di: 'dia_inicio', mi: 'mes_inicio', ai: 'año_inicio', df: 'dia_fin', mf: 'mes_fin', af: 'año_fin', sector: 'sector_empresa' },
                { emp: 'empresa_dos', cargo: 'cargo_empresa2', dir: 'direccion_empresa2', depto: 'departamento_empresa2', mun: 'municipio_empresa2', tel: 'telefono_empresa2', email: 'email_empresa2', di: 'dia_inicio2', mi: 'mes_inicio2', ai: 'año_inicio2', df: 'dia_fin2', mf: 'mes_fin2', af: 'año_fin2', sector: 'sector_empresa2' },
                { emp: 'empresa_tres', cargo: 'cargo_empresa3', dir: 'direccion_empresa3', depto: 'departamento_empresa3', mun: 'municipio_empresa3', tel: 'telefono_empresa3', email: 'email_empresa3', di: 'dia_inicio3', mi: 'mes_inicio3', ai: 'año_inicio3', df: 'dia_fin3', mf: 'mes_fin3', af: 'año_fin3', sector: 'sector_empresa3' }
              ].map((exp, idx) => cv(exp.emp, '') ? (
                <div key={idx} className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-600 text-sm">
                  <p className="font-bold text-blue-800 dark:text-blue-400 mb-1">Empresa {idx + 1}: {cv(exp.emp)}</p>
                  <div className="grid grid-cols-2 gap-1">
                    <p><strong>Cargo:</strong> {cv(exp.cargo)}</p>
                    <p><strong>Sector:</strong> {cv(exp.sector)}</p>
                    <p><strong>Dirección:</strong> {cv(exp.dir)}</p>
                    <p><strong>Departamento:</strong> {cv(exp.depto)}</p>
                    <p><strong>Inicio:</strong> {[cv(exp.di,''), cv(exp.mi,''), cv(exp.ai,'')].filter(Boolean).join('/') || '---'}</p>
                    <p><strong>Fin:</strong> {[cv(exp.df,''), cv(exp.mf,''), cv(exp.af,'')].filter(Boolean).join('/') || '---'}</p>
                  </div>
                </div>
              ) : null)}
              {!cv('empresa_actual', '') && <p className="text-gray-400 italic text-sm">Sin experiencia laboral registrada</p>}
            </div>

            {/* DATOS IGLESIA */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4">
              <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-3 text-lg border-b border-gray-200 dark:border-gray-600 pb-2">Datos de la Iglesia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><strong>Nombre Iglesia:</strong> {cv('nombre_iglesia')}</p>
                <p><strong>Pastor:</strong> {cv('nombre_pastor')}</p>
                <p><strong>Teléfono Pastor:</strong> {cv('telefono_pastor')}</p>
                <p><strong>País:</strong> {cv('país_iglesia')}</p>
                <p><strong>Ciudad:</strong> {cv('ciudad_iglesia')}</p>
                <p><strong>Dirección:</strong> {cv('direccion_iglesia')}</p>
              </div>
            </div>

            {/* IDIOMAS */}
            {(cv('idioma_1', '') || cv('idioma_2', '') || cv('idioma_3', '')) && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4">
                <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-3 text-lg border-b border-gray-200 dark:border-gray-600 pb-2">Idiomas</h3>
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left py-1">Idioma</th><th>Habla</th><th>Lee</th><th>Escribe</th></tr></thead>
                  <tbody>
                    {[1,2,3].map(n => cv(`idioma_${n}`, '') ? (
                      <tr key={n} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-1 font-medium">{cv(`idioma_${n}`)}</td>
                        <td className="text-center">{cv(`habla_${n}`)}</td>
                        <td className="text-center">{cv(`lee_${n}`)}</td>
                        <td className="text-center">{cv(`escribe_${n}`)}</td>
                      </tr>
                    ) : null)}
                  </tbody>
                </table>
              </div>
            )}

            {/* CARGO */}
            {cv('cargo_en_FHISYL', '') && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 mb-4">
                <p className="text-sm"><strong>Cargo en FHIS&L:</strong> {cv('cargo_en_FHISYL')}</p>
                <p className="text-sm"><strong>Autoriza verificación:</strong> {cvData.autorizo_si ? 'Sí' : cvData.autorizo_no ? 'No' : '---'}</p>
              </div>
            )}

            {/* REFERENCIAS FAMILIARES */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4">
              <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-3 text-lg border-b border-gray-200 dark:border-gray-600 pb-2">Referencias Familiares</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[1,2,3].map(n => cv(`nombre_familia_${n}`, '') ? (
                  <div key={n} className="text-sm p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600">
                    <p className="font-bold">{cv(`nombre_familia_${n}`)}</p>
                    <p className="text-gray-500">Parentesco: {cv(`parentezco_${n}`)}</p>
                    <p className="text-gray-500">Profesión: {cv(`profesion_${n}`)}</p>
                    <p className="text-gray-500">Tel: {cv(`telefonofam_${n}`)}</p>
                  </div>
                ) : null)}
              </div>
            </div>

            {/* REFERENCIAS PERSONALES */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4">
              <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-3 text-lg border-b border-gray-200 dark:border-gray-600 pb-2">Referencias Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[1,2,3].map(n => cv(`nombre_personales_${n}`, '') ? (
                  <div key={n} className="text-sm p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600">
                    <p className="font-bold">{cv(`nombre_personales_${n}`)}</p>
                    <p className="text-gray-500">Profesión: {cv(`profesion_personal_${n}`)}</p>
                    <p className="text-gray-500">Tel: {cv(`telefonopers_${n}`)}</p>
                  </div>
                ) : null)}
              </div>
            </div>

            {/* FIRMA DIGITAL */}
            {getImgUrl(cvData.firma_digital) && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-3">Firma Digital</h3>
                <img src={getImgUrl(cvData.firma_digital)} alt="Firma Digital" className="max-h-24 mx-auto" />
              </div>
            )}
          </div>
        );

      case 'Entrevista':
        const entData = targetUser.fundacion?.entrevista?.respuestas || {};
        const entRes = typeof entData === 'object' && !Array.isArray(entData) ? entData : {};
        
        return (
          <div id="document-preview" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold uppercase tracking-tight text-blue-900 dark:text-blue-400 mb-1">
                ENTREVISTA FUNDACIONAL
              </h1>
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                Fundación Humanitaria Sol y Luna
              </h2>
            </div>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex gap-2">
                <span className="font-bold">Nombre:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{entRes.nombre || `${targetUser.nombres?.primero} ${targetUser.apellidos?.primero}`}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Fecha Nacimiento:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{entRes.fechaNacimiento || '---'}</span>
              </div>
              <div className="flex gap-2 md:col-span-2">
                <span className="font-bold">UPZ/Localidad:</span>
                <span className="border-b border-gray-300 dark:border-gray-600 flex-1">{entRes.upzLocalidad || '---'}</span>
              </div>
            </section>

            <div className="space-y-6">
              <section>
                <h3 className="bg-gray-100 dark:bg-gray-700 p-2 font-bold text-[16px] border-l-4 border-blue-900 dark:border-blue-400 mb-3 text-blue-900 dark:text-blue-100">Ministerio</h3>
                <div className="space-y-4 px-2">
                  <div>
                    <p className="font-bold text-sm text-blue-800 dark:text-blue-400">¿Cuál es su llamado?</p>
                    <p className="italic">{entRes.llamado || '---'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-blue-800 dark:text-blue-400">¿Qué es lo que más le gusta de servir?</p>
                    <p className="italic">{entRes.loQueMasGusta || '---'}</p>
                  </div>
                </div>
              </section>
              
              <section>
                <h3 className="bg-gray-100 dark:bg-gray-700 p-2 font-bold text-[16px] border-l-4 border-blue-900 dark:border-blue-400 mb-3 text-blue-900 dark:text-blue-100">Carácter</h3>
                <div className="space-y-4 px-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-sm text-blue-800 dark:text-blue-400">¿Qué dicen sus amigos?</p>
                      <p className="italic">{entRes.caracterAmigos || '---'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-blue-800 dark:text-blue-400">¿Qué dicen sus compañeros?</p>
                      <p className="italic">{entRes.caracterCompañeros || '---'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-blue-800 dark:text-blue-400">¿Cómo reacciona ante situaciones difíciles?</p>
                    <p className="italic">{entRes.situacionDificil || '---'}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="bg-gray-100 dark:bg-gray-700 p-2 font-bold text-[16px] border-l-4 border-blue-900 dark:border-blue-400 mb-3 text-blue-900 dark:text-blue-100">Compromiso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
                  <div>
                    <p className="font-bold text-sm text-blue-800 dark:text-blue-400">Tiempo pastoreando:</p>
                    <p className="italic">{entRes.tiempoPastoreando || '---'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-blue-800 dark:text-blue-400">Disponibilidad de tiempo:</p>
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
    <div className="max-w-5xl mx-auto px-4 pt-16 pb-8 md:py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <button onClick={() => navigate('/fundacion')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition-colors">
          <ChevronLeft size={20} />
          Volver a Fundación
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-2 sm:gap-3 w-full md:w-auto">
          {/* Botón Modificar - Solo visible si el usuario está viendo su propio documento */}
          {(targetUser?._id === user?._id) && (
            <button 
              onClick={() => {
                const routes = {
                  'Aplicativo': '/fundacion/documentacion-fhsyl',
                  'Entrevista': '/fundacion/entrevista',
                  'Hoja de Vida': '/fundacion/hoja-de-vida',
                  'HojaDeVida': '/fundacion/hoja-de-vida',
                  'Solicitud': '/fundacion/solicitud'
                };
                if (routes[type]) navigate(routes[type]);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 md:px-4 md:py-2 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200 transition text-sm md:text-base"
            >
              <Edit3 size={16} className="md:w-[18px]" />
              Modificar
            </button>
          )}
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 px-3 py-2 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition text-sm md:text-base"
          >
            <Printer size={16} className="md:w-[18px]" />
            <span className="hidden xs:inline">Imprimir</span>
            <span className="xs:hidden">PDF</span>
          </button>
          <button 
            onClick={handleDownloadWord}
            className="flex items-center justify-center gap-1.5 px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md shadow-blue-500/20 text-sm md:text-base col-span-2 sm:col-span-1"
          >
            <Download size={16} className="md:w-[18px]" />
            <span className="hidden xs:inline">Descargar Word</span>
            <span className="xs:hidden">Descargar</span>
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 relative max-h-[1000px] overflow-y-auto print:max-h-none print:overflow-visible text-gray-900"
      >
        {/* Marca de agua o estilo de hoja */}
        <div className="p-2 md:p-16 bg-gray-50/30 dark:bg-gray-800/20">
          <div className="bg-white dark:bg-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.05)] w-full max-w-4xl mx-auto min-h-[842px] p-5 md:p-20 border border-gray-100 dark:border-gray-700">
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
