import React, { useState, useEffect } from 'react';
import { churchColors } from '../utils/colors';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Video, Users } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getChurchEvents, createChurchEvent, updateChurchEvent } from '../services/churchEventService';
import meetingService from '../../reuniones/services/meetingService';
import CreateChurchEventModal from './CreateChurchEventModal';
import { CreateMeetingModal } from '../../reuniones/components/CreateMeetingModal';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import { MeetingCard } from '../../reuniones/components/MeetingCard';
import api from '../../../api/config';

// Helper wrapper until added to service
const getChurchMeetings = async (iglesiaId) => {
  try {
    const res = await api.get(`/reuniones/iglesia/${iglesiaId}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    return [];
  }
}

const IglesiaEvents = ({ iglesiaData }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // State for Editing
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchData = async () => {
    if (!iglesiaData?._id) return;
    setLoading(true);
    try {
      const [eventsData, meetingsData] = await Promise.all([
        getChurchEvents(iglesiaData._id),
        getChurchMeetings(iglesiaData._id)
      ]);
      setEvents(eventsData || []);
      setMeetings(meetingsData || []);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [iglesiaData?._id]);

  const handleCreateMeeting = async (data) => {
    try {
      await meetingService.createMeeting({ ...data, iglesia: iglesiaData._id });
      toast.success('Reunión creada exitosamente');
      setShowMeetingModal(false);
      fetchData();
      return { success: true };
    } catch (error) {
      console.error(error);
      return { error: 'Error al crear la reunión' };
    }
  };

  const handleSaveEvent = async (data) => {
    let result;
    if (editingEvent) {
      result = await updateChurchEvent(editingEvent._id, data);
    } else {
      result = await createChurchEvent(iglesiaData._id, data);
    }

    if (result.success) {
      toast.success(editingEvent ? 'Evento actualizado exitosamente' : 'Evento creado exitosamente');
      setShowEventModal(false);
      setEditingEvent(null);
      fetchData();
    }
    return result;
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (event) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar este evento? Esta acción no se puede deshacer.')) {
      // Dynamic import not needed here since we can export it or just use api directly if service import is circular (it shouldn't be)
      // Check imports above: import { deleteChurchEvent } from '../services/churchEventService';
      // Wait, I need to make sure deleteChurchEvent is imported.
      // It's not imported in the top list currently in my composed content below? 
      // Let's check imports. Yes, I missed adding deleteChurchEvent to the import list.
      // I will fix that now.
      const { deleteChurchEvent } = await import('../services/churchEventService');
      const result = await deleteChurchEvent(event._id);
      if (result.success) {
        toast.success('Evento cancelado exitosamente');
        fetchData();
      } else {
        toast.error(result.error);
      }
    }
  };

  const handleDismissEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e._id !== eventId));
  };

  // Combine and Sort
  const combinedItems = [
    ...events.map(e => ({ ...e, type: 'event', sortDate: e.dates[0] ? new Date(e.dates[0]) : new Date() })),
    ...meetings.map(m => ({ ...m, type: 'meeting', sortDate: new Date(m.date) }))
  ].sort((a, b) => a.sortDate - b.sortDate);

  const upcomingItems = combinedItems.filter(i => new Date(i.sortDate) >= new Date().setHours(0, 0, 0, 0));

  const canCreateContent = () => {
    if (!user?.esMiembroIglesia || !user?.eclesiastico) return false;
    const role = user.eclesiastico.rolPrincipal;
    const allowed = ['pastor_principal', 'lider', 'sublider', 'adminIglesia', 'director', 'coordinador'];
    if (allowed.includes(role)) return true;

    return user.eclesiastico.ministerios?.some(m =>
      m.activo && ['lider', 'sublider'].includes(m.cargo)
    );
  };

  const hasPermission = canCreateContent();

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className={`${churchColors.cardBg} rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Calendario de Iglesia
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Reuniones y eventos de la congregación
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowSelectionModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={20} />
              <span>Crear</span>
            </button>
            <button
              onClick={() => navigate('/Mis_reuniones')}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <Calendar size={20} />
              <span>Ver calendario completo</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center p-12"><span className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></span></div>
        ) : upcomingItems.length === 0 ? (
          <div className={`${churchColors.cardBg} rounded-xl shadow-lg p-12 text-center`}>
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">
              event_busy
            </span>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              No hay actividades programadas próximamente
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {upcomingItems.map((item) => (
              item.type === 'event' ? (
                <EventCard
                  key={item._id}
                  event={item}
                  isOnline={false}
                  onDismiss={handleDismissEvent}
                  onEdit={() => handleEditEvent(item)}
                  onCancel={() => handleDeleteEvent(item)}
                />
              ) : (
                <MeetingCard
                  key={item._id}
                  meeting={item}
                />
              )
            ))}
          </div>
        )}

      </div>

      {/* Selection Modal */}
      {showSelectionModal && (
        <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowSelectionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <Plus size={24} className="rotate-45" />
            </button>

            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white text-center">¿Qué deseas crear?</h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  if (hasPermission) {
                    setShowSelectionModal(false);
                    setShowMeetingModal(true);
                  } else {
                    toast.error('No tienes permisos para crear reuniones.');
                  }
                }}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all group ${hasPermission ? 'border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer' : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'}`}
              >
                <div className={`p-3 rounded-full transition-transform ${hasPermission ? 'bg-blue-100 text-blue-600 group-hover:scale-110' : 'bg-gray-100 text-gray-400'}`}>
                  <Video size={24} />
                </div>
                <span className={`font-semibold ${hasPermission ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>Reunión</span>
                {!hasPermission && <span className="text-xs text-red-500 text-center">(Requiere Liderazgo)</span>}
              </button>

              <button
                onClick={() => {
                  if (hasPermission) {
                    setShowSelectionModal(false);
                    setShowEventModal(true);
                  } else {
                    toast.error('No tienes permisos para crear eventos.');
                  }
                }}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all group ${hasPermission ? 'border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer' : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'}`}
              >
                <div className={`p-3 rounded-full transition-transform ${hasPermission ? 'bg-purple-100 text-purple-600 group-hover:scale-110' : 'bg-gray-100 text-gray-400'}`}>
                  <Users size={24} />
                </div>
                <span className={`font-semibold ${hasPermission ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>Evento</span>
                {!hasPermission && <span className="text-xs text-red-500 text-center">(Requiere Liderazgo)</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modals */}
      <CreateMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onCreate={handleCreateMeeting}
        isChurchContext={true}
      />

      <CreateChurchEventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        onCreate={handleSaveEvent}
        initialData={editingEvent}
      />

    </div>
  );
};

export default IglesiaEvents;
