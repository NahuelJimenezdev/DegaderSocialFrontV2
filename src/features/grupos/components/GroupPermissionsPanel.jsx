/**
 * Componente para la sección de permisos y roles del grupo
 */
const GroupPermissionsPanel = ({ groupData }) => {
    return (
        <div className="rounded-lg shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ color: '#ffffff' }}>
                    <span className="material-symbols-outlined" style={{ color: '#ffffff' }}>admin_panel_settings</span>
                    Permisos y Roles
                </h3>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-main)' }}>
                    <div>
                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Permitir que miembros inviten a otros</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Los miembros regulares pueden enviar invitaciones</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Aprobar nuevos miembros</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Requiere aprobación de admin para unirse</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={groupData?.tipo !== 'publico'} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default GroupPermissionsPanel;
