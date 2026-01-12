import React from 'react';

const StepCreative = ({ formData, updateField, errors }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Imagen del Anuncio
            </h3>

            <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    URL de la Imagen *
                </label>
                <input
                    type="url"
                    value={formData.imagenUrl}
                    onChange={(e) => updateField('imagenUrl', e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className={`w-full px-3 py-3 bg-white dark:bg-gray-800 border ${errors.imagenUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.imagenUrl && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.imagenUrl}
                    </p>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                    Formatos soportados: JPG, PNG, WebP, GIF. Dimensiones recomendadas: 400x300px
                </p>
            </div>

            {/* Preview de la imagen */}
            {formData.imagenUrl && !errors.imagenUrl && (
                <div className="mt-8">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        Vista Previa:
                    </p>
                    <div className="w-full max-w-md h-72 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                        <img
                            src={formData.imagenUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+imagen';
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepCreative;
