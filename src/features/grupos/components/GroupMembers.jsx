// src/features/grupos/components/GroupMembers.jsx
const GroupMembers = ({ groupData }) => {
  const members = [
    { id: 1, name: 'Juan Pérez', role: 'Administrador', avatar: 'https://i.pravatar.cc/50?img=1' },
    { id: 2, name: 'María García', role: 'Miembro', avatar: 'https://i.pravatar.cc/50?img=2' },
    { id: 3, name: 'Carlos López', role: 'Miembro', avatar: 'https://i.pravatar.cc/50?img=3' },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Miembros del Grupo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-[#1F2937] p-4 rounded-lg shadow-md flex items-center gap-4"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupMembers;