import React from 'react';

const StepTargeting = ({ formData, updateSegmentation, errors }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Segmentación de Audiencia
            </h3>

            {/* Rango de Edad */}
            <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Rango de Edad
                </label>
                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <input
                            type="number"
                            min="13"
                            max="100"
                            value={formData.segmentacion.edadMin}
                            onChange={(e) => updateSegmentation('edadMin', parseInt(e.target.value))}
                            className={`w-full px-3 py-3 bg-white dark:bg-gray-800 border ${errors.edadMin ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                } rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        />
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Mínima</p>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                    <div className="flex-1">
                        <input
                            type="number"
                            min="13"
                            max="100"
                            value={formData.segmentacion.edadMax}
                            onChange={(e) => updateSegmentation('edadMax', parseInt(e.target.value))}
                            className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Máxima</p>
                    </div>
                </div>
                {errors.edadMin && (
                    <p className="text-red-500 text-xs mt-2">
                        {errors.edadMin}
                    </p>
                )}
            </div>

            {/* Género */}
            <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Género
                </label>
                <div className="flex gap-4">
                    {['todos', 'masculino', 'femenino'].map((genero) => (
                        <label key={genero} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="genero"
                                value={genero}
                                checked={formData.segmentacion.genero === genero}
                                onChange={(e) => updateSegmentation('genero', e.target.value)}
                                className="w-4 h-4 colorMarcaDegader focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className="text-gray-900 dark:text-white text-sm capitalize">
                                {genero}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Intereses */}
            <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Intereses (Opcional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {['religión', 'deportes', 'tecnología', 'música', 'arte', 'educación'].map((interes) => (
                        <label key={interes} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.segmentacion.intereses.includes(interes)}
                                onChange={(e) => {
                                    const newIntereses = e.target.checked
                                        ? [...formData.segmentacion.intereses, interes]
                                        : formData.segmentacion.intereses.filter(i => i !== interes);
                                    updateSegmentation('intereses', newIntereses);
                                }}
                                className="w-4 h-4 colorMarcaDegader rounded focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className="text-gray-900 dark:text-white text-sm capitalize">
                                {interes}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Ubicación Global */}
            <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.segmentacion.ubicacion.esGlobal}
                        onChange={(e) => updateSegmentation('ubicacion', {
                            ...formData.segmentacion.ubicacion,
                            esGlobal: e.target.checked
                        })}
                        className="w-4 h-4 colorMarcaDegader rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-gray-900 dark:text-white text-sm">
                        Mostrar a nivel global (sin restricciones geográficas)
                    </span>
                </label>
            </div>
        </div>
    );
};

export default StepTargeting;
