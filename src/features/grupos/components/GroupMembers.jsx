import UserItem from '../../../shared/components/UserItem/UserItem'
import mockMembers from '../../../shared/data/groups/mockGroupMembers.json'

const GroupMembers = ({ groupData }) => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-[#1F2937] dark:text-[#F9FAFB]">
        Miembros del Grupo
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-[#1F2937] p-2 rounded-lg shadow-md"
          >
            <UserItem
              user={member}
              subtitle={member.rol}
              onClick={() => console.log('Ver perfil:', member.nombre)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupMembers