import React, { useState, useMemo } from 'react';
import { DayEventsModal } from './DayEventsModal';

export function CalendarView({ meetings, currentMonth, onSelectMeeting }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // -------------------------------------------------------
  // Obtener días del mes
  // -------------------------------------------------------
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // Domingo = 0

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  // -------------------------------------------------------
  // Agrupar reuniones por día
  // -------------------------------------------------------
  const meetingsByDay = useMemo(() => {
    const grouped = {};

    meetings.forEach((meeting) => {
      const meetingDate = new Date(meeting.date);
      const key = `${meetingDate.getFullYear()}-${meetingDate.getMonth()}-${meetingDate.getDate()}`;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(meeting);
    });

    // Ordenar por hora
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
    });

    return grouped;
  }, [meetings]);

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  // -------------------------------------------------------
  // Generar días del calendario
  // -------------------------------------------------------
  const calendarDays = [];

  // Días vacíos antes del día 1
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push({ isEmpty: true, key: `empty-${i}` });
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${month}-${day}`;
    const dayMeetings = meetingsByDay[key] || [];
    const isToday =
      new Date().getDate() === day &&
      new Date().getMonth() === month &&
      new Date().getFullYear() === year;

    calendarDays.push({
      day,
      dayKey: key,
      meetings: dayMeetings,
      isToday,
      isEmpty: false,
      key: `day-${day}`,
    });
  }

  // -------------------------------------------------------
  // Eventos al seleccionar día
  // -------------------------------------------------------
  const handleDayClick = (dayData) => {
    if (dayData.isEmpty || dayData.meetings.length === 0) return;

    if (dayData.meetings.length === 1) {
      onSelectMeeting(dayData.meetings[0]);
    } else {
      setSelectedDay(dayData);
      setIsModalOpen(true);
    }
  };

  const handleMeetingSelect = (meeting) => {
    setIsModalOpen(false);
    setSelectedDay(null);
    onSelectMeeting(meeting);
  };

  // -------------------------------------------------------
  // Determinar color del día según estados de reuniones
  // -------------------------------------------------------
  const getDayColor = (meetings) => {
    if (!meetings || meetings.length === 0) return null;

    // Prioridad: in-progress > upcoming > completed > cancelled
    const hasInProgress = meetings.some(m => m.status === 'in-progress');
    const hasUpcoming = meetings.some(m => m.status === 'upcoming');
    const hasCompleted = meetings.some(m => m.status === 'completed');
    const hasCancelled = meetings.some(m => m.status === 'cancelled');

    if (hasInProgress) {
      return {
        border: 'border-green-500',
        bg: 'bg-green-50',
        textDay: 'text-green-700',
        dot: 'bg-green-500',
        label: 'En curso'
      };
    }

    if (hasUpcoming) {
      return {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        textDay: 'text-blue-700',
        dot: 'bg-blue-500',
        label: 'Próxima'
      };
    }

    if (hasCompleted) {
      return {
        border: 'border-slate-400',
        bg: 'bg-slate-50',
        textDay: 'text-slate-700',
        dot: 'bg-slate-400',
        label: 'Completada'
      };
    }

    if (hasCancelled) {
      return {
        border: 'border-red-400',
        bg: 'bg-red-50',
        textDay: 'text-red-700',
        dot: 'bg-red-400',
        label: 'Cancelada'
      };
    }

    return null;
  };

  // -------------------------------------------------------
  // Días de la semana
  // -------------------------------------------------------
  const weekDays = [
    { short: 'D', medium: 'Dom', full: 'Domingo' },
    { short: 'L', medium: 'Lun', full: 'Lunes' },
    { short: 'M', medium: 'Mar', full: 'Martes' },
    { short: 'X', medium: 'Mié', full: 'Miércoles' },
    { short: 'J', medium: 'Jue', full: 'Jueves' },
    { short: 'V', medium: 'Vie', full: 'Viernes' },
    { short: 'S', medium: 'Sáb', full: 'Sábado' },
  ];

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6">

        {/* Encabezado */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
          {weekDays.map((d, index) => (
            <div
              key={index}
              className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-1 sm:py-2"
            >
              <span className="block sm:hidden">{d.short}</span>
              <span className="hidden sm:block lg:hidden">{d.medium}</span>
              <span className="hidden lg:block">{d.full}</span>
            </div>
          ))}
        </div>

        {/* Calendario */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((dayData) => {
            if (dayData.isEmpty) {
              return (
                <div
                  key={dayData.key}
                  className="aspect-square bg-gray-100 rounded-md opacity-40"
                />
              );
            }

            const hasEvents = dayData.meetings.length > 0;
            const dayColor = getDayColor(dayData.meetings);

            // Determinar clases de color
            let borderClass = 'border-gray-200';
            let bgClass = '';
            let textClass = 'text-gray-700';
            let dotClass = 'bg-blue-600';

            if (dayData.isToday && !hasEvents) {
              // Día de HOY sin eventos
              borderClass = 'border-green-500';
              bgClass = 'bg-green-50';
              textClass = 'text-green-600';
            } else if (dayColor) {
              // Día con eventos - usar color según estado
              borderClass = dayColor.border;
              bgClass = dayColor.bg;
              textClass = dayColor.textDay;
              dotClass = dayColor.dot;
            } else if (dayData.isToday) {
              // Día de hoy CON eventos (fallback)
              borderClass = 'border-green-500';
              bgClass = 'bg-green-50';
              textClass = 'text-green-600';
            }

            return (
              <div
                key={dayData.key}
                onClick={() => handleDayClick(dayData)}
                className={`
                  aspect-square rounded-md border
                  p-1 sm:p-1.5 md:p-2
                  transition-all duration-300 relative cursor-pointer
                  ${borderClass} ${bgClass}
                  hover:shadow-md hover:scale-105
                `}
              >
                {/* Número del día */}
                <div className={`text-xs sm:text-sm md:text-base font-bold ${textClass}`}>
                  {dayData.day}
                </div>

                {/* Indicador en PC */}
                {hasEvents && (
                  <div className="hidden sm:flex mt-1">
                    <div className={`w-2 h-2 rounded-full ${dotClass}`}></div>
                  </div>
                )}

                {/* Indicador dots en mobile - un dot por reunión (max 4) */}
                {hasEvents && (
                  <div className="sm:hidden flex gap-0.5 mt-1 flex-wrap">
                    {dayData.meetings.slice(0, 4).map((m, i) => {
                      // Cada dot con su propio color según el estado de la reunión
                      let meetingDotColor = 'bg-blue-500';
                      if (m.status === 'in-progress') meetingDotColor = 'bg-green-500';
                      else if (m.status === 'completed') meetingDotColor = 'bg-slate-400';
                      else if (m.status === 'cancelled') meetingDotColor = 'bg-red-400';
                      else if (m.status === 'upcoming') meetingDotColor = 'bg-blue-500';

                      return (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${meetingDotColor}`}></div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedDay && (
        <DayEventsModal
          isOpen={isModalOpen}
          day={selectedDay.day}
          month={month}
          year={year}
          meetings={selectedDay.meetings}
          onClose={() => setIsModalOpen(false)}
          onSelectMeeting={handleMeetingSelect}
        />
      )}
    </>
  );
}
