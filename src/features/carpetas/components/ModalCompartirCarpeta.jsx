import { useState, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import { X, UserPlus, Shield, Check, Search, User } from 'lucide-react';
import userService from '../../../api/userService';
import { getAvatarUrl, handleImageError } from '../../../shared/utils/avatarUtils';

const PERMISOS = [
  { valor: 'lectura', label: 'Lectura', desc: 'Puede ver y descargar archivos' },
  { valor: 'escritura', label: 'Escritura', desc: 'Puede subir y eliminar archivos' },
  { valor: 'admin', label: 'Administrador', desc: 'Control total sobre la carpeta' },
];

const ModalCompartirCarpeta = ({ isOpen, onClose, onCompartir, carpeta }) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [permiso, setPermiso] = useState('lectura');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Debounce para búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (busqueda.trim().length >= 2 && !usuarioSeleccionado) {
        setSearching(true);
        try {
          const res = await userService.searchUsers(busqueda);
          // La respuesta del backend viene en res.data
          const users = Array.isArray(res) ? res : (res.data || []);
          setResultados(users);
        } catch (error) {
          logger.error("Error buscando usuarios:", error);
          setResultados([]);
        } finally {
          setSearching(false);
        }
      } else {
        setResultados([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda, usuarioSeleccionado]);

  const handleSelectUser = (user) => {
    setUsuarioSeleccionado(user);
    setBusqueda('');
    setResultados([]);
  };

  const handleClearUser = () => {
    setUsuarioSeleccionado(null);
    setBusqueda('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioSeleccionado) return;

    setLoading(true);
    setMensaje(null);

    try {
      const result = await onCompartir(carpeta._id, {
        usuarioId: usuarioSeleccionado._id,
        permisos: permiso
      });

      if (result.success) {
        setMensaje({ type: 'success', text: 'Carpeta compartida exitosamente' });
        setUsuarioSeleccionado(null);
        setTimeout(() => {
          onClose();
          setMensaje(null);
        }, 1500);
      } else {
        setMensaje({ type: 'error', text: result.error || 'Error al compartir' });
      }
    } catch (error) {
      setMensaje({ type: 'error', text: 'Error inesperado' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !carpeta) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-indigo-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <UserPlus size={24} />
            <div>
              <h2 className="text-lg font-bold">Compartir Carpeta</h2>
              <p className="text-indigo-100 text-xs truncate max-w-[200px]">{carpeta.nombre}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Buscador de Usuario */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar Usuario
            </label>

            {!usuarioSeleccionado ? (
              <div className="relative">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre o correo..."
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />

                {/* Resultados de búsqueda */}
                {(resultados.length > 0 || searching) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                    {searching && (
                      <div className="p-3 text-center text-sm text-gray-500">Buscando...</div>
                    )}
                    {!searching && resultados.map(user => (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <img
                          src={getAvatarUrl(user.social?.fotoPerfil)}
                          onError={handleImageError}
                          alt={user.nombres?.primero}
                          className="w-8 h-8 rounded-full object-cover bg-gray-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.nombres?.primero} {user.apellidos?.primero}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarUrl(usuarioSeleccionado.social?.fotoPerfil)}
                    onError={handleImageError}
                    alt={usuarioSeleccionado.nombres?.primero}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {usuarioSeleccionado.nombres?.primero} {usuarioSeleccionado.apellidos?.primero}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {usuarioSeleccionado.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearUser}
                  className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Selector Permisos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permisos
            </label>
            <div className="space-y-2">
              {PERMISOS.map((p) => (
                <label
                  key={p.valor}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${permiso === p.valor
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="permiso"
                    value={p.valor}
                    checked={permiso === p.valor}
                    onChange={() => setPermiso(p.valor)}
                    className="mt-1 colorMarcaDegader focus:ring-indigo-500"
                  />
                  <div>
                    <span className="block font-medium text-gray-900 dark:text-white text-sm">
                      {p.label}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {p.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Feedback Message */}
          {mensaje && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${mensaje.type === 'success'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
              {mensaje.type === 'success' && <Check size={16} />}
              {mensaje.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !usuarioSeleccionado}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? 'Compartiendo...' : 'Compartir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCompartirCarpeta;



