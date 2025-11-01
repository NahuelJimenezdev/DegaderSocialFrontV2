const GroupInfo = ({ groupData }) => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Información del Grupo</h2>
      <div className="bg-white dark:bg-[#1F2937] p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Nombre</h3>
            <p className="text-gray-600 dark:text-gray-400">{groupData.title}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Descripción</h3>
            <p className="text-gray-600 dark:text-gray-400">{groupData.desc}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Miembros</h3>
            <p className="text-gray-600 dark:text-gray-400">{groupData.members}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Fecha de creación</h3>
            <p className="text-gray-600 dark:text-gray-400">{groupData.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;