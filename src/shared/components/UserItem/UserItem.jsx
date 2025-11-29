import { getNombreCompleto } from '../../utils/userUtils';

const UserItem = ({
  user,
  subtitle,
  actions,
  onClick,
  variant = 'default'
}) => {
  const nombreCompleto = user.displayName || getNombreCompleto(user);

  return (
    <article
      className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <img
        src={user.avatar}
        alt={nombreCompleto}
        className="w-10 h-10 rounded-full object-cover"
        onError={e => { e.currentTarget.src = '/avatars/default-avatar.png' }}
      />
      <div className="flex-1">
        <div className="font-bold text-sm text-[#1F2937] dark:text-[#F9FAFB]">
          {nombreCompleto}
        </div>
        {subtitle && (
          <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            {subtitle}
          </div>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {actions}
        </div>
      )}
    </article>
  )
}

export default UserItem
