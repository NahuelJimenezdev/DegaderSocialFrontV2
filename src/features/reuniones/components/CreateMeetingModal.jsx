import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, Users, Link, Video, Tag, Check, Send, Plus, Globe, BookOpen, UsersRound } from 'lucide-react';
import { useUserSearch } from '../hooks/useUserSearch';
import api from '../../../api/config';

// Tipos para contexto GLOBAL
const globalMeetingTypes = [
  { value: 'publica',     label: 'Pública',       icon: Globe,       color: 'text-sky-600',  desc: 'Visible para todos tus amigos. Sin notificación al crearla.' },
  { value: 'privado',    label: 'Privado',       icon: BookOpen,    color: 'text-teal-600', desc: 'Visible para amigos. Notifica a los usuarios que selecciones.' },
  { value: 'grupal',      label: 'Grupal',         icon: UsersRound,  color: 'text-pink-600', desc: 'Solo visible para miembros de un grupo. Notifica a los miembros.' },
];

// Tipos para contexto IGLESIA
const churchMeetingTypes = [
  { value: 'oracion',           label: 'Oración',              color: 'text-purple-600' },
  { value: 'estudio_biblico',   label: 'Estudio de la Palabra', color: 'text-blue-600' },
  { value: 'culto',             label: 'Culto General',         color: 'colorMarcaDegader' },
  { value: 'escuela_dominical', label: 'Escuela Dominical',     color: 'text-orange-600' },
  { value: 'privado',           label: 'Privado',               color: 'text-teal-600' },
  { value: 'grupal',            label: 'Grupal',                color: 'text-pink-600' },
];

const meetingDurations = ['30 minutos', '1 hora', '1.5 horas', '2 horas', '3 horas', 'Más de 3 horas'];

const MINISTERIOS = [
  "musica", "caballeros", "damas", "escuela_dominical", "evangelismo",
  "limpieza", "cocina", "medios", "juventud", "intercesion",
  "consejeria", "visitacion", "seguridad", "protocolo"
];
const formatMinistryName = (name) =>
  name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    .replace('Musica', 'Música').replace('Intercesion', 'Intercesión')
    .replace('Consejeria', 'Consejería').replace('Visitacion', 'Visitación');

export function CreateMeetingModal({ isOpen, onClose, onCreate, isChurchContext = false }) {
  if (!isOpen) return null;

  const availableTypes = isChurchContext ? churchMeetingTypes : globalMeetingTypes;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '10:00',
    duration: meetingDurations[1],
    type: availableTypes[0].value,
    meetLink: 'https://meet.google.com/',
    attendees: [],   // IDs de invitados (capacitacion)
    group: '',       // ID de grupo (grupal)
    targetMinistry: 'todos',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myGroups, setMyGroups] = useState([]);

  const { searchResults, searchLoading, searchError, searchParticipants } = useUserSearch();

  // Resetear al abrir
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, type: availableTypes[0].value, attendees: [], group: '' }));
      setSubmitError(null);
    }
  }, [isOpen, isChurchContext]);

  // Cargar grupos del usuario cuando el tipo es grupal
  useEffect(() => {
    if (formData.type === 'grupal') {
      api.get('/grupos/mis-grupos').then(r => setMyGroups(r.data?.data || [])).catch(() => setMyGroups([]));
    }
  }, [formData.type]);

  // Búsqueda de usuarios con debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.length >= 2) searchParticipants(searchTerm);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectAttendee = (user) => {
    setFormData(prev => {
      const isSelected = prev.attendees.some(u => u.id === user.id);
      return {
        ...prev,
        attendees: isSelected
          ? prev.attendees.filter(u => u.id !== user.id)
          : [...prev.attendees, user]
      };
    });
    setSearchTerm('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    // Validación de grupo
    if (formData.type === 'grupal' && !formData.group) {
      setSubmitError('Debes seleccionar un grupo para este tipo de reunión.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        attendees: formData.attendees.map(u => u.id),
        group: formData.group || null,
      };
      const result = await onCreate(payload);
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

  const selectedType = globalMeetingTypes.find(t => t.value === formData.type);
  const showUserSearch = !isChurchContext && (formData.type === 'privado');
  const showGroupSelect = !isChurchContext && formData.type === 'grupal';

  return (
    <div className="fixed inset-0 z-[10000] bg-black bg-opacity-40 flex items-center justify-center p-4 text-gray-700 dark:text-gray-300" style={{ margin: 0, padding: '1rem' }}>
      <div className="bg-white dark:bg-[#1a1f3a] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col border dark:border-gray-700">

        {/* Encabezado */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-[#1a1f3a]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Programar Reunión {isChurchContext ? '(Eclesiástica)' : ''}</span>
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 scrollbar-hide">

          {/* Tipo de reunión — como cards visuales (solo contexto global) */}
          {!isChurchContext && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Tag className="w-4" /> Tipo de Reunión
              </label>
              <div className="grid grid-cols-3 gap-2">
                {globalMeetingTypes.map(t => {
                  const Icon = t.icon;
                  const isSelected = formData.type === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: t.value, attendees: [], group: '' }))}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`text-xs font-semibold ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {selectedType && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedType.desc}</p>
              )}
            </div>
          )}

          {/* Tipo iglesia — select simple */}
          {isChurchContext && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Tag className="w-4" /> Tipo
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-[#0a0e27] dark:text-white outline-none"
              >
                {churchMeetingTypes.map(t => (
                  <option key={t.value} value={t.value} className="dark:bg-[#1a1f3a]">{t.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Título */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título de la Reunión</label>
            <input name="title" type="text" value={formData.title} onChange={handleChange}
              placeholder="Ej: Reunión Mensual de Capacitación" required
              className="w-full border dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-[#0a0e27] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción (Opcional)</label>
            <textarea name="description" rows="2" value={formData.description} onChange={handleChange}
              placeholder="Agenda o propósito" maxLength={2000}
              className="w-full border dark:border-gray-700 rounded-lg p-3 resize-none bg-white dark:bg-[#0a0e27] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>

          {/* Fecha - Hora - Duración */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"><Calendar className="w-4" /> Fecha</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} required
                className="w-full border dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-[#0a0e27] dark:text-white outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"><Clock className="w-4" /> Hora</label>
              <input name="time" type="time" value={formData.time} onChange={handleChange} required
                className="w-full border dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-[#0a0e27] dark:text-white outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duración</label>
              <select name="duration" value={formData.duration} onChange={handleChange}
                className="w-full border dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-[#0a0e27] dark:text-white outline-none">
                {meetingDurations.map(d => <option key={d} className="dark:bg-[#1a1f3a]">{d}</option>)}
              </select>
            </div>
          </div>

          {/* Enlace */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"><Link className="w-4" /> Enlace de reunión</label>
            <input name="meetLink" type="url" value={formData.meetLink} onChange={handleChange} required
              className="w-full border dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-[#0a0e27] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none" />
          </div>

          {/* Selector de ministerio (iglesia) */}
          {isChurchContext && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Users className="w-4" /> Dirigido A:
              </label>
              <select name="targetMinistry" value={formData.targetMinistry || 'todos'} onChange={handleChange}
                className="w-full border rounded-lg p-3 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-medium outline-none">
                <option value="todos" className="dark:bg-[#1a1f3a]">Todos</option>
                <optgroup label="Ministerios" className="dark:bg-[#1a1f3a]">
                  {MINISTERIOS.map(m => <option key={m} value={m} className="dark:bg-[#1a1f3a]">{formatMinistryName(m)}</option>)}
                </optgroup>
              </select>
            </div>
          )}

          {/* Selector de grupo (solo tipo grupal) */}
          {showGroupSelect && (
            <div className="space-y-2 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
              <h3 className="flex items-center font-semibold text-pink-800 dark:text-pink-300">
                <UsersRound className="w-4 mr-2" /> Seleccionar Grupo
              </h3>
              {myGroups.length === 0 ? (
                <p className="text-sm text-pink-600 dark:text-pink-400">No pertenecés a ningún grupo todavía.</p>
              ) : (
                <select name="group" value={formData.group} onChange={handleChange}
                  className="w-full border border-pink-300 dark:border-pink-700 rounded-lg p-3 bg-white dark:bg-[#0a0e27] dark:text-white outline-none">
                  <option value="">Seleccioná un grupo...</option>
                  {myGroups.map(g => <option key={g._id} value={g._id} className="dark:bg-[#1a1f3a]">{g.nombre}</option>)}
                </select>
              )}
            </div>
          )}

          {/* Buscador de usuarios (solo tipo capacitacion) */}
          {showUserSearch && (
            <div className="space-y-3 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
              <h3 className="flex items-center font-semibold text-teal-800 dark:text-teal-300">
                <Users className="w-4 mr-2" /> Invitar usuarios específicos ({formData.attendees.length})
              </h3>
              <input type="text" placeholder="Buscar por nombre (min 2 letras)..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full border dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-[#1a1f3a] dark:text-white placeholder-gray-400 outline-none" />

              <div className="max-h-32 overflow-y-auto space-y-1 scrollbar-hide">
                {searchLoading && <p className="text-sm text-blue-500">Buscando...</p>}
                {searchError && <p className="text-sm text-red-500">{searchError}</p>}
                {searchResults?.filter(u => !formData.attendees.some(a => a.id === u.id)).map(user => (
                  <div key={user.id}
                    className="flex justify-between p-2 rounded cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-800/30 text-gray-700 dark:text-gray-300"
                    onClick={() => handleSelectAttendee(user)}>
                    <span className="text-sm">{user.name}</span>
                    <Plus className="w-4 text-teal-600" />
                  </div>
                ))}
                {!searchLoading && searchTerm.length >= 2 && searchResults?.length === 0 && (
                  <p className="text-sm text-gray-500 text-center">No se encontraron usuarios.</p>
                )}
              </div>

              {/* Chips de seleccionados */}
              {formData.attendees.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-teal-200 dark:border-teal-800">
                  {formData.attendees.map(user => (
                    <span key={user.id} onClick={() => handleSelectAttendee(user)}
                      className="px-3 py-1 bg-teal-500 dark:bg-teal-600 text-white rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-red-500 dark:hover:bg-red-600 transition-colors">
                      {user.name}<X className="w-3" />
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* Botones */}
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose}
              className="px-6 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-6 py-3 rounded-lg shadow-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <Send className="w-5" />
              {isSubmitting ? 'Creando...' : 'Programar Reunión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
