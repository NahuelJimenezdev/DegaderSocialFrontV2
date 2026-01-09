import React, { useState, useEffect } from 'react';
import { Grid, List, Star, User } from 'lucide-react';
import { logger } from '../../../shared/utils/logger';
import favoritosService from '../../../api/favoritosService';
import FavoriteUserCard from '../components/FavoriteUserCard';
import { useToast } from '../../../shared/components/Toast/ToastProvider';

const FavoritosPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const toast = useToast();

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const response = await favoritosService.getFavoriteUsers();
            if (response.success) {
                setFavorites(response.data);
            }
        } catch (error) {
            logger.error('Error al cargar favoritos:', error);
            toast.error('Error al cargar favoritos');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (userId) => {
        try {
            await favoritosService.toggleFavoriteUser(userId);
            setFavorites(prev => prev.filter(f => f._id !== userId));
            toast.success('Eliminado de favoritos');
        } catch (error) {
            toast.error('Error al eliminar de favoritos');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-500/10 rounded-full">
                        <Star className="text-yellow-500 w-6 h-6 fill-yellow-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white">Favoritos</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {favorites.length} {favorites.length === 1 ? 'usuario' : 'usuarios'} guardados
                        </p>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                            ? 'bg-white dark:bg-gray-700 text-purple-500 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                            ? 'bg-white dark:bg-gray-700 text-purple-500 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {favorites.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                        <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No tienes favoritos aún
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        Agrega usuarios a tus favoritos desde el menú de opciones de sus publicaciones para verlos aquí.
                    </p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {favorites.map(user => (
                                <FavoriteUserCard
                                    key={user._id}
                                    user={user}
                                    onRemove={handleRemoveFavorite}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {favorites.map(user => (
                                <div key={user._id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-500/50 transition-colors">
                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.href = `/informacionUsuario/${user.username || user._id}`}>
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                            <img
                                                src={user.social?.fotoPerfil || `https://ui-avatars.com/api/?name=${user.nombres?.primero}+${user.apellidos?.primero}`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold dark:text-white">
                                                {user.nombres?.primero} {user.apellidos?.primero}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                @{user.username || 'usuario'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFavorite(user._id)}
                                        className="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                    >
                                        Quitar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FavoritosPage;
