import React from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { useProfileContext } from '../context/ProfileContext';

/**
 * Componente para crear nuevas publicaciones
 */
const PostComposer = () => {
  const {
    user,
    avatarUrl,
    newPost,
    setNewPost,
    imagePreviews,
    posting,
    postError,
    setPostError,
    handleImageSelect,
    handleRemoveImage,
    handleCreatePost
  } = useProfileContext();

  const fullName = `${user?.nombres?.primero || ''} ${user?.apellidos?.primero || ''}`.trim() || user?.email?.split('@')[0] || 'Usuario';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex gap-3">
        <div className="flex gap-3 items-start w-full">
          <img
            src={avatarUrl}
            alt={fullName}
            className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff&size=128`;
            }}
          />
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900 dark:text-white mb-2">{fullName}</p>
            {/* Mensaje de error */}
            {postError && (
              <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{postError}</span>
                </p>
              </div>
            )}

            <textarea
              placeholder="¿Qué estás pensando?"
              className="w-full bg-transparent resize-none focus:outline-none text-sm md:text-base text-gray-900 dark:text-white placeholder-gray-400"
              rows="3"
              value={newPost}
              onChange={(e) => {
                setNewPost(e.target.value);
                if (postError) setPostError('');
              }}
            />

            {/* Vista previa de imágenes y videos */}
            {imagePreviews.length > 0 && (
              <div className="mt-3">
                {imagePreviews.length === 1 ? (
                  <div className="relative">
                    {imagePreviews[0].startsWith('data:video/') ? (
                      <video
                        src={imagePreviews[0]}
                        controls
                        className="w-full rounded-lg max-h-96"
                      />
                    ) : (
                      <img
                        src={imagePreviews[0]}
                        alt="Preview"
                        className="w-full rounded-lg max-h-96 object-cover"
                      />
                    )}
                    <button
                      onClick={() => handleRemoveImage(0)}
                      className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white p-1.5 rounded-full hover:bg-opacity-90 transition z-10"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className={`grid gap-1 ${imagePreviews.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {imagePreviews.slice(0, 4).map((preview, idx) => (
                      <div key={idx} className="relative">
                        {preview.startsWith('data:video/') ? (
                          <video
                            src={preview}
                            controls
                            className="w-full h-60 rounded-lg object-cover"
                          />
                        ) : (
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-60 rounded-lg object-cover"
                          />
                        )}
                        <button
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white p-1.5 rounded-full hover:bg-opacity-90 transition z-10"
                        >
                          <X size={16} />
                        </button>
                        {idx === 3 && imagePreviews.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center pointer-events-none">
                            <span className="text-white text-2xl font-bold">+{imagePreviews.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <label className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer transition" title="Subir imágenes o videos (múltiples archivos, máx. 10MB cada uno)">
                  <ImageIcon size={18} className="text-gray-500" />
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              </div>
              <button
                onClick={handleCreatePost}
                disabled={(!newPost.trim() && imagePreviews.length === 0) || posting}
                className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {posting ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComposer;
