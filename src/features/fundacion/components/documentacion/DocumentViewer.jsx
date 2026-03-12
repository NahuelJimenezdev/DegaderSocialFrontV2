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
            "body { font-family: 'Arial', sans-serif; padding: 20px; }"+
            "h1, h2, h3 { color: #1e3a8a; }"+
            ".section { background: #f3f4f6; padding: 5px; margin-top: 20px; font-weight: bold; }"+
            "table { width: 100%; border-collapse: collapse; }"+
            "td, th { border: 1px solid #ddd; padding: 8px; }"+
            "</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Documento_${type}_${user.nombres.primero}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (type) {
      case 'Aplicativo':
      case 'Solicitud':
        const appData = user.fundacion?.documentacionFHSYL || {};
        return (
          <div id="document-preview" className="space-y-6 text-gray-800">
            <h1 className="text-2xl font-bold text-center border-b pb-4 text-blue-900">APLICATIVO COORDINACIÓN<br/>Fundación Humanitaria Internacional Sol y Luna</h1>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <p><strong>Nombre Completo:</strong> {user.nombres?.primero} {user.apellidos?.primero}</p>
              <p><strong>Dirección:</strong> {user.personal?.direccion || '---'}</p>
              <p><strong>Localidad:</strong> {user.personal?.ubicacion?.ciudad || '---'}</p>
              <p><strong>Barrio/UPZ:</strong> {user.personal?.ubicacion?.barrio || '---'} / {appData.upz || '---'}</p>
              <p><strong>Ocupación:</strong> {appData.ocupacion || '---'}</p>
              <p><strong>Estado Civil:</strong> {appData.estadoCivil || '---'}</p>
            </section>

            <section className="space-y-4 pt-4 border-t">
              <h2 className="text-lg font-bold bg-gray-100 p-2">1. Testimonio y Conversión</h2>
              <p className="whitespace-pre-wrap">{appData.testimonioConversion || 'No especificado'}</p>
              
              <h2 className="text-lg font-bold bg-gray-100 p-2">2. Llamado Pastoral</h2>
              <p className="whitespace-pre-wrap">{appData.llamadoPastoral || 'No especificado'}</p>

              <h2 className="text-lg font-bold bg-gray-100 p-2">3. Virtudes y Áreas de Mejora</h2>
              <p><strong>Virtudes:</strong> {appData.virtudes?.join(', ') || '---'}</p>
              <p><strong>Áreas de Mejora:</strong> {appData.areasMejora?.join(', ') || '---'}</p>
            </section>

            <section className="space-y-4 pt-4 border-t">
               <h2 className="text-lg font-bold bg-gray-100 p-2">4. Información de Congregación</h2>
               <p><strong>Nombre Congregación:</strong> {appData.nombreCongregacionPastorea || '---'}</p>
               <p><strong>Alianza de Pastores:</strong> {appData.alianzaPastores || '---'}</p>
            </section>
          </div>
        );

      case 'Entrevista':
        const entData = user.fundacion?.entrevista?.respuestas || {};
        return (
          <div id="document-preview" className="space-y-6 text-gray-800">
            <h1 className="text-2xl font-bold text-center border-b pb-4 text-blue-900">ENTREVISTA FUNDACIONAL<br/>Fundación Humanitaria Internacional Sol y Luna</h1>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Nombre:</strong> {entData.nombre || '---'}</p>
              <p><strong>Fecha Nacimiento:</strong> {entData.fechaNacimiento || '---'}</p>
              <p><strong>UPZ/Localidad:</strong> {entData.upzLocalidad || '---'}</p>
            </section>

            <section className="space-y-4 pt-4 border-t">
              <h2 className="text-lg font-bold bg-gray-100 p-2">Ministerio</h2>
              <p><strong>Llamado:</strong> {entData.llamado}</p>
              <p><strong>Lo que más le gusta:</strong> {entData.loQueMasGusta}</p>
              
              <h2 className="text-lg font-bold bg-gray-100 p-2">Carácter</h2>
              <p><strong>Amigos dicen:</strong> {entData.caracterAmigos}</p>
              <p><strong>Compañeros dicen:</strong> {entData.caracterCompañeros}</p>
              <p><strong>Situación difícil:</strong> {entData.situacionDificil}</p>

              <h2 className="text-lg font-bold bg-gray-100 p-2">Compromiso</h2>
              <p><strong>Tiempo pastoreando:</strong> {entData.tiempoPastoreando}</p>
              <p><strong>Disponibilidad tiempo:</strong> {entData.disponibilidadTiempo}</p>
            </section>
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

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative max-h-[1000px] overflow-y-auto">
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
        }
      `}</style>
    </div>
  );
}
