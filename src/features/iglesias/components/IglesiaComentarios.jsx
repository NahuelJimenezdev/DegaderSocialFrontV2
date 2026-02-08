import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getAvatarUrl } from '../../../shared/utils/avatarUtils';
import iglesiaService from '../../../api/iglesiaService';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';

const IglesiaComentarios = ({ iglesiaData }) => {
    const { user } = useAuth();
    const [testimonios, setTestimonios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comentarioPropio, setComentarioPropio] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', variant: 'warning', onConfirm: null });

    // Verificar si es miembro
    const esMiembro = iglesiaData?.miembros?.some(m => {
        const memberId = m._id || m;
        return memberId.toString() === user?._id?.toString();
    }) || iglesiaData?.pastorPrincipal?._id === user?._id || iglesiaData?.pastorPrincipal === user?._id;

    useEffect(() => {
        fetchTestimonios();
    }, [iglesiaData]);

    const fetchTestimonios = async () => {
        try {
            const data = await iglesiaService.getTestimonios(iglesiaData._id);
            setTestimonios(data);

            const propio = data.find(t => t.usuario._id === user._id);
            if (propio) {
                setComentarioPropio(propio);
                setNuevoMensaje(propio.mensaje);
            }
        } catch (error) {
            console.error('Error fetching testimonios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim()) return;

        try {
            if (comentarioPropio) {
                // Actualizar
                const updated = await iglesiaService.updateTestimonio(iglesiaData._id, comentarioPropio._id, nuevoMensaje);
                setTestimonios(prev => prev.map(t => t._id === updated.data._id ? updated.data : t));
                setComentarioPropio(updated.data);
                setModoEdicion(false);
                setAlertConfig({ isOpen: true, variant: 'success', message: 'Comentario actualizado correctamente' });
            } else {
                // Crear
                const created = await iglesiaService.createTestimonio(iglesiaData._id, nuevoMensaje);
                setTestimonios(prev => [created.data, ...prev]);
                setComentarioPropio(created.data);
                setAlertConfig({ isOpen: true, variant: 'success', message: 'Comentario publicado correctamente' });
            }
        } catch (error) {
            console.error('Error saving testimonio:', error);
            setAlertConfig({ isOpen: true, variant: 'error', message: error.response?.data?.message || 'Error al guardar comentario' });
        }
    };

    const executeDelete = async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        if (!comentarioPropio) return;

        try {
            await iglesiaService.deleteTestimonio(iglesiaData._id, comentarioPropio._id);
            setTestimonios(prev => prev.filter(t => t._id !== comentarioPropio._id));
            setComentarioPropio(null);
            setNuevoMensaje('');
            setAlertConfig({ isOpen: true, variant: 'success', message: 'Comentario eliminado correctamente' });
        } catch (error) {
            console.error('Error deleting testimonio:', error);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al eliminar comentario' });
        }
    };

    const handleDelete = () => {
        if (!comentarioPropio) return;

        setConfirmConfig({
            isOpen: true,
            title: 'Eliminar comentario',
            message: '¿Estás seguro de que deseas eliminar tu comentario? Esta acción no se puede deshacer.',
            variant: 'danger',
            onConfirm: executeDelete
        });
    };



    const getRolUsuario = (usuario) => {
        if (usuario._id === (iglesiaData.pastorPrincipal._id || iglesiaData.pastorPrincipal)) return 'Pastor Principal';
        // Se podría expandir con lógica de roles eclesiásticos si estuvieran poblados
        return 'Miembro';
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Cargando comentarios...</div>;
    }

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-500">forum</span>
                        Comentarios de la Comunidad
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Lo que dicen nuestros miembros sobre nuestra casa.
                    </p>
                </div>

                {/* Sección de Acción para Miembros */}
                {esMiembro && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-900/30">
                        {!comentarioPropio || modoEdicion ? (
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {modoEdicion ? 'Editar tu comentario' : 'Deja tu comentario'}
                                </h3>
                                <textarea
                                    value={nuevoMensaje}
                                    onChange={(e) => setNuevoMensaje(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 dark:text-gray-200 resize-none"
                                    rows="4"
                                    placeholder="Comparte tu experiencia con la comunidad..."
                                    maxLength={500}
                                />
                                <div className="flex justify-end gap-3 mt-4">
                                    {modoEdicion && (
                                        <button
                                            type="button"
                                            onClick={() => setModoEdicion(false)}
                                            className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={!nuevoMensaje.trim()}
                                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                                    >
                                        {modoEdicion ? 'Guardar Cambios' : 'Publicar Comentario'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tu comentario</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ya has compartido tu opinión con la comunidad.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setModoEdicion(true)}
                                        className="p-2 colorMarcaDegader hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                        <span className="hidden md:inline">Editar</span>
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                        <span className="hidden md:inline">Borrar</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Lista de Comentarios */}
                <div className="space-y-4">
                    {testimonios.length > 0 ? (
                        testimonios.map((testimonio) => (
                            <div
                                key={testimonio._id}
                                className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm relative border ${testimonio.usuario._id === user._id ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-gray-100 dark:border-gray-700'}`}
                            >
                                <span className="absolute top-4 right-4 text-4xl text-indigo-100 dark:text-indigo-900/50 font-serif">"</span>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 italic leading-relaxed">
                                    {testimonio.mensaje}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center overflow-hidden">
                                        {testimonio.usuario.social?.fotoPerfil ? (
                                            <img src={getAvatarUrl(testimonio.usuario.social.fotoPerfil)} alt={testimonio.usuario.nombres.primero} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="colorMarcaDegader dark:text-indigo-400 font-bold">
                                                {testimonio.usuario.nombres.primero.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">
                                            {testimonio.usuario.nombres.primero} {testimonio.usuario.apellidos.primero}
                                        </h5>
                                        <p className="text-xs colorMarcaDegader dark:text-indigo-400 font-medium">
                                            {getRolUsuario(testimonio.usuario)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">chat_bubble_outline</span>
                            <p className="text-gray-500 dark:text-gray-400">Aún no hay comentarios. {esMiembro && '¡Sé el primero!'}</p>
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                variant={alertConfig.variant}
                message={alertConfig.message}
            />

            <ConfirmDialog
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                variant={confirmConfig.variant}
            />
        </div>
    );
};

export default IglesiaComentarios;
