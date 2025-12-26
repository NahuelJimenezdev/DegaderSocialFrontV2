import React from 'react';
import { Calendar, List, ChevronLeft, ChevronRight, History } from 'lucide-react';

export function MeetingViewToggle({
  view,
  onViewChange,
  currentMonth,
  onMonthChange
}) {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const monthNamesShort = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const handleToday = () => {
    onMonthChange(new Date());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 sm:p-4">
      {/* Layout Mobile: Stack vertical */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* Botones de Vista - RESPONSIVE */}
        <div className="flex space-x-1.5 sm:space-x-2">
          <button
            onClick={() => onViewChange('list')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base flex-1 sm:flex-initial active:scale-95 ${view === 'list'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Lista</span>
          </button>
          <button
            onClick={() => onViewChange('calendar')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base flex-1 sm:flex-initial active:scale-95 ${view === 'calendar'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Calendario</span>
          </button>
          <button
            onClick={() => onViewChange('history')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base flex-1 sm:flex-initial active:scale-95 ${view === 'history'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Historial</span>
          </button>
        </div>

        {/* Navegación de Mes (solo visible en vista calendario) - RESPONSIVE */}
        {view === 'calendar' && (
          <div className="flex items-center justify-between w-full sm:grid sm:grid-cols-3 sm:items-center">

            <div className="sm:col-start-1 sm:justify-self-start">
              <button
                onClick={handleToday}
                className="px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm text-green-600 dark:text-green-400 font-bold hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
              >
                Hoy
              </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 sm:col-start-3 sm:justify-self-end">

              <button
                onClick={handlePrevMonth}
                className="p-1.5 sm:p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </button>

              {/* Mes y año - versión corta en mobile, completa en desktop */}
              <div className="min-w-[80px] sm:min-w-[140px] text-center text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
                {/* Mobile: versión corta */}
                <span className="block sm:hidden">
                  {monthNamesShort[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                {/* Desktop: versión completa */}
                <span className="hidden sm:block">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
              </div>

              <button
                onClick={handleNextMonth}
                className="p-1.5 sm:p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


