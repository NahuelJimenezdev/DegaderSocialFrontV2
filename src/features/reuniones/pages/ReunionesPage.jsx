import React, { useState, useRef, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { MeetingHeader } from '../components/MeetingHeader';
import { MeetingViewToggle } from '../components/MeetingViewToggle';
import { MeetingCard } from '../components/MeetingCard';
import { MeetingEmptyState } from '../components/MeetingEmptyState';
import { CalendarView } from '../components/CalendarView';
import { CreateMeetingModal } from '../components/CreateMeetingModal';
import { useMeetings } from '../hooks/useMeetings';

/**
 * Componente principal para la vista de gestión de Reuniones.
 */
export function ReunionesPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('list'); // 'list', 'calendar' o 'history'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const meetingRefs = useRef({}); // Referencias a las cards de reuniones

  // 🎯 Obtener datos reales y funciones de API
  const {
    meetings,
    isLoading,
    error,
    createNewMeeting,
    cancelMeeting
  } = useMeetings();

  // Obtener ID del usuario actual
  const currentUserId = user?._id || user?.id;

  // 📊 Filtrar y ordenar reuniones según la vista
  const getFilteredMeetings = () => {
    let filtered = [];

    if (view === 'list') {
      // Vista Lista: Solo upcoming e in-progress
      filtered = meetings.filter(m =>
        m.status === 'upcoming' || m.status === 'in-progress'
      );
    } else if (view === 'history') {
      // Vista Historial: Solo completed y cancelled
      filtered = meetings.filter(m =>
        m.status === 'completed' || m.status === 'cancelled'
      );
    } else if (view === 'calendar') {
      // Vista Calendario: Todas las reuniones
      return meetings;
    }

    // Ordenar: in-progress primero, luego upcoming por fecha
    return filtered.sort((a, b) => {
      // in-progress siempre primero
      if (a.status === 'in-progress' && b.status !== 'in-progress') return -1;
      if (b.status === 'in-progress' && a.status !== 'in-progress') return 1;

      // Si ambos son del mismo tipo, ordenar por fecha
      return new Date(a.date) - new Date(b.date);
    });
  };

  const filteredMeetings = getFilteredMeetings();

  // Efecto para hacer scroll a una reunión específica desde notificación
  useEffect(() => {
    const scrollToMeetingId = location.state?.scrollToMeetingId;
    if (scrollToMeetingId && meetings.length > 0) {
      // Asegurarse de estar en vista de lista
      setView('list');

      // Esperar a que se renderice la vista
      setTimeout(() => {
        const meetingElement = meetingRefs.current[scrollToMeetingId];
        if (meetingElement) {
          meetingElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          // Resaltar la card brevemente
          meetingElement.classList.add('ring-4', 'ring-blue-400', 'ring-opacity-50');
          setTimeout(() => {
            meetingElement.classList.remove('ring-4', 'ring-blue-400', 'ring-opacity-50');
          }, 2000);
        }
      }, 100);

      // Limpiar el estado de navegación
      window.history.replaceState({}, document.title);
    }
  }, [location.state, meetings]);

  const handleCreateMeeting = async (meetingData) => {
    // Formatear la fecha en formato ISO para el backend
    const dateISO = new Date(`${meetingData.date}T${meetingData.time}:00`).toISOString();

    const dataToSend = {
      ...meetingData,
      date: dateISO,
      time: meetingData.time, // Mantener el time separado como espera el backend
    };

    const result = await createNewMeeting(dataToSend);

    if (result.success) {
      // Éxito
      setIsModalOpen(false);
      logger.log('Reunión creada y lista actualizada.');
    } else {
      // No cerramos el modal, dejamos que el modal maneje el error
      logger.error('Fallo la creación:', result.error);
    }

    // Retornar el resultado para que el modal lo maneje
    return result;
  };

  // Manejar selección de reunión desde el calendario
  const handleSelectMeeting = (meeting) => {
    // Cambiar a vista de lista
    setView('list');

    // Scroll a la card de la reunión después de un pequeño delay
    setTimeout(() => {
      const meetingElement = meetingRefs.current[meeting._id];
      if (meetingElement) {
        meetingElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Resaltar la card brevemente
        meetingElement.classList.add('ring-4', 'ring-blue-400', 'ring-opacity-50');
        setTimeout(() => {
          meetingElement.classList.remove('ring-4', 'ring-blue-400', 'ring-opacity-50');
        }, 2000);
      }
    }, 100);
  };

  // --- Estados de Carga y Error ---
  if (isLoading) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-gray-500">Cargando reuniones...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-red-600">Error: {error}</div>;
  }

  // 🖼️ Renderizado de contenido principal
  const renderContent = () => {
    // 1. Vista Calendario (Siempre visible)
    if (view === 'calendar') {
      return (
        <CalendarView
          meetings={meetings}
          currentMonth={currentMonth}
          onSelectMeeting={handleSelectMeeting}
        />
      );
    }

    // 2. Estado Vacío (Solo si no hay reuniones y no es calendario)
    if (meetings.length === 0) {
      return <MeetingEmptyState onCreateClick={() => setIsModalOpen(true)} />;
    }

    // 3. Vista Lista
    if (view === 'list') {
      if (filteredMeetings.length === 0) {
        return (
          <div className="text-center py-12 text-gray-500">
            No tienes reuniones próximas o en curso
          </div>
        );
      }
      return (
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting._id}
              ref={(el) => (meetingRefs.current[meeting._id] = el)}
              className="transition-all duration-300"
            >
              <MeetingCard
                meeting={meeting}
                onCancel={cancelMeeting}
                currentUserId={currentUserId}
              />
            </div>
          ))}
        </div>
      );
    }

    // 4. Vista Historial
    if (view === 'history') {
      if (filteredMeetings.length === 0) {
        return (
          <div className="text-center py-12 text-gray-500">
            No hay reuniones en el historial
          </div>
        );
      }
      return (
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting._id}
              ref={(el) => (meetingRefs.current[meeting._id] = el)}
              className="transition-all duration-300"
            >
              <MeetingCard
                meeting={meeting}
                onCancel={cancelMeeting}
                currentUserId={currentUserId}
              />
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="page-container">
      <div className='mb-mobile-30'>
        {/* 1. Encabezado y CTA: onNewMeeting abre el modal */}
        <MeetingHeader onNewMeeting={() => setIsModalOpen(true)} />

        <hr className="border-gray-100 mb-4" />

        {/* 2. Selector de Vista (Lista / Calendario) */}
        <MeetingViewToggle
          view={view}
          onViewChange={setView}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />

        {/* 3. Contenido Principal */}
        {renderContent()}

        {/* Modal: Controlado por el estado isModalOpen */}
        <CreateMeetingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateMeeting}
        />
      </div>
    </div>
  );
}
