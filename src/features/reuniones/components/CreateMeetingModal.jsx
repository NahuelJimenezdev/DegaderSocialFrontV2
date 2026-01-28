import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, Users, Link, Video, Tag, Check, Send, Plus } from 'lucide-react';
import { useUserSearch } from '../hooks/useUserSearch';

// Opciones para contexto de IGLESIA
const churchMeetingTypes = [
  { value: 'oracion', label: 'Oración', color: 'text-purple-600' },
  { value: 'estudio_biblico', label: 'Estudio de la Palabra', color: 'text-blue-600' },
  { value: 'culto', label: 'Culto General', color: 'text-indigo-600' },
  { value: 'escuela_dominical', label: 'Escuela Dominical', color: 'text-orange-600' },
  { value: 'capacitacion', label: 'Capacitación', color: 'text-teal-600' },
  { value: 'grupal', label: 'Grupal', color: 'text-pink-600' },
];

// Opciones para contexto GLOBAL (Mis Reuniones)
const globalMeetingTypes = [
  { value: 'personal', label: 'Personal', color: 'text-gray-600' },
  { value: 'capacitacion', label: 'Capacitación', color: 'text-teal-600' },
  { value: 'grupal', label: 'Grupal', color: 'text-pink-600' },
  { value: 'comercial', label: 'Comercial', color: 'text-emerald-600' },
];

const meetingDurations = [
  '30 minutos', '1 hora', '1.5 horas', '2 horas', '3 horas', 'Más de 3 horas'
];

export function CreateMeetingModal({ isOpen, onClose, onCreate, isChurchContext = false }) {
  if (!isOpen) return null;

  // Determinar qué tipos usar
  const availableTypes = isChurchContext ? churchMeetingTypes : globalMeetingTypes;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '10:00',
    duration: meetingDurations[1],
    type: availableTypes[0].value,
    meetLink: 'https://meet.google.com/',
    attendees: [],
    targetMinistry: 'todos', // Default para iglesias
  });

  // Resetear el tipo cuando cambia el contexto o se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        type: availableTypes[0].value
      }));
    }
  }, [isOpen, isChurchContext]);

  const [searchTerm, setSearchTerm] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook REAL - obtiene searchResults del custom hook
  const {
    searchResults,
    searchLoading,
    searchError,
    searchParticipants
  } = useUserSearch();

  // Buscar usuarios reales cada 500ms
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.length >= 2) searchParticipants(searchTerm);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Enviar solo los IDs
      const payload = {
        ...formData,
        attendees: formData.attendees.map(u => u.id)
      };

      const result = await onCreate(payload);

      // Solo cerrar si fue exitoso
      if (result && result.success !== false) {
        onClose();
      } else if (result && result.error) {
        setSubmitError(result.error);
      }
    } catch (error) {
      setSubmitError(error.message || 'Error al crear la reunión');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Selección de usuarios REALES del backend
  // En src/features/reuniones/components/CreateMeetingModal.jsx

  const handleSelectAttendee = (user) => {
    setFormData(prev => {
      const isSelected = prev.attendees.some(u => u.id === user.id);

      if (isSelected) {
        // Eliminar usuario
        return {
          ...prev,
          attendees: prev.attendees.filter(u => u.id !== user.id)
        };
      } else {
        // Agregar usuario completo
        return {
          ...prev,
          attendees: [...prev.attendees, user]
        };
      }
    });
    // Limpiar el input de búsqueda
    setSearchTerm('');
  };




  const selectedTypeColor = availableTypes.find(t => t.value === formData.type)?.color || 'text-gray-600';

  // Lista de ministerios definidos en el sistema
  const MINISTERIOS = [
    "musica", "caballeros", "damas", "escuela_dominical", "evangelismo",
    "limpieza", "cocina", "medios", "juventud", "intercesion",
    "consejeria", "visitacion", "seguridad", "protocolo"
  ];

  /* 
   * Formatear nombre del ministerio para mostrar
   * musica -> Música
   * escuela_dominical -> Escuela Dominical
   */
  const formatMinistryName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace('Musica', 'Música')
      .replace('Intercesion', 'Intercesión')
      .replace('Consejeria', 'Consejería')
      .replace('Visitacion', 'Visitación');
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black bg-opacity-40 flex items-center justify-center p-4 text-gray-700" style={{ margin: 0, padding: '1rem' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col">

        {/* Encabezado - FIJO */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Video className="w-5 h-5 text-blue-600" />
            <span>Programar Nueva Reunión {isChurchContext ? '(Eclesiástica)' : ''}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario - CON SCROLL */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 scrollbar-hide">

          {/* Título */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Título de la Reunión</label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Reunión Mensual de Directores"
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Descripción (Opcional)</label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Agenda o propósito"
              className="w-full border rounded-lg p-3 resize-none"
            />
          </div>

          {/* Fecha - Hora - Duración */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-1"><Calendar className="w-4" /> Fecha</label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-1"><Clock className="w-4" /> Hora</label>
              <input
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Duración</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                {meetingDurations.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Enlace y Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-1"><Link className="w-4" /> Enlace</label>
              <input
                name="meetLink"
                type="url"
                value={formData.meetLink}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-1"><Tag className="w-4" /> Tipo</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 ${selectedTypeColor}`}
              >
                {availableTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Selector de Ministerio (SOLO SI HAY IGLESIA) */}
          {/* Asumimos que parentId o similar indica contexto de Iglesia, o pasamos prop isChurchContext */}
          {/* Voy a agregar un campo "targetMinistry" al formData siempre, pero visible solo si se requiere */}

          {isChurchContext && (
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-1">
                <Users className="w-4" /> Dirigido A:
              </label>
              <select
                name="targetMinistry"
                value={formData.targetMinistry || 'todos'}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 bg-blue-50 border-blue-200 text-blue-800 font-medium"
              >
                <option value="todos">Todos</option>
                <optgroup label="Ministerios">
                  {MINISTERIOS.map(m => (
                    <option key={m} value={m}>{formatMinistryName(m)}</option>
                  ))}
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.targetMinistry && formData.targetMinistry !== 'todos'
                  ? `Se notificará solo a los miembros del ministerio de ${formatMinistryName(formData.targetMinistry)}.`
                  : 'Se notificará a toda la congregación.'}
              </p>
            </div>
          )}

          {/* Participantes */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
            <h3 className="flex items-center font-semibold"><Users className="w-5 mr-2" /> Participantes ({formData.attendees.length})</h3>

            {/* Búsqueda */}
            <input
              type="text"
              placeholder="Buscar usuarios (min 2 letras)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            {/* Resultados */}
            <div className="max-h-32 overflow-y-auto space-y-1">
              {searchLoading && <p className="text-sm text-blue-500">Buscando...</p>}
              {searchError && <p className="text-sm text-red-500">{searchError}</p>}

              {(searchResults && searchResults.length > 0) && (
                searchResults
                  // Filtrar los que NO estén seleccionados
                  .filter(user => !(formData?.attendees || []).some(a => a.id === user.id))
                  .map(user => (
                    <div
                      key={user.id}
                      className={`flex justify-between p-2 rounded cursor-pointer
          ${(formData?.attendees || []).some(a => a.id === user.id)
                          ? 'bg-blue-100 border border-blue-400'
                          : 'hover:bg-gray-200'}
        `}
                      onClick={() => {
                        handleSelectAttendee(user);
                        setSearchTerm('');
                      }}
                    >
                      <span className="text-sm">{user.name}</span>

                      {(formData?.attendees || []).some(a => a.id === user.id)
                        ? <Check className="w-4 text-blue-600" />
                        : <Plus className="w-4 text-gray-500" />}
                    </div>
                  ))
              )}


              {!searchLoading && searchTerm.length >= 2 && searchResults.length === 0 && (
                <p className="text-sm text-gray-500 text-center">No se encontraron usuarios.</p>
              )}
            </div>

            {/* Chips reales */}
            <div className="flex flex-wrap gap-2 pt-3 border-t">
              {formData.attendees.map(user => (
                <span
                  key={user.id}
                  onClick={() => handleSelectAttendee(user)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-red-500"
                >
                  {user.name}
                  <X className="w-3" />
                </span>
              ))}
            </div>

          </div>

          {/* Mensaje de error */}
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* Botón */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-100 font-semibold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-yellow-500 text-black-700 px-6 py-3 rounded-lg shadow-lg text-lg font-semibold hover:from-blue-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Send className="w-5" />
              {isSubmitting ? 'Creando...' : 'Programar Reunión'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}


