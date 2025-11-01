const GroupEvents = ({ groupData }) => {
  const events = [
    { id: 1, title: 'Reunión Mensual', date: '25 Oct 2024', time: '10:00 AM' },
    { id: 2, title: 'Retiro Espiritual', date: '5 Nov 2024', time: '9:00 AM' },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Eventos Destacados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-[#1F2937] p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-3xl">event</span>
              <h3 className="font-bold text-xl">{event.title}</h3>
            </div>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                {event.date}
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {event.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupEvents;
