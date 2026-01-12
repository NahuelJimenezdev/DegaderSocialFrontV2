import React from 'react';

const StepBasicInfo = ({ formData, updateField, errors }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Información Básica del Anuncio
            </h3>

            <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Nombre del Cliente/Empresa *
                </label>
                <input
                    type="text"
                    value={formData.nombreCliente}
                    onChange={(e) => updateField('nombreCliente', e.target.value)}
                    placeholder="Ej: Librería Cristiana Esperanza"
                    className={`w-full px-3 py-3 bg-white dark:bg-gray-800 border ${errors.nombreCliente ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.nombreCliente && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.nombreCliente}
                    </p>
                )}
            </div>

            <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Call to Action (Texto del Botón) *
                </label>
                <input
                    type="text"
                    value={formData.callToAction}
                    onChange={(e) => updateField('callToAction', e.target.value)}
                    placeholder="Ej: ¡Compra Ahora!"
                    maxLength={30}
                    className={`w-full px-3 py-3 bg-white dark:bg-gray-800 border ${errors.callToAction ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                <div className="flex justify-between mt-1">
                    {errors.callToAction && (
                        <p className="text-red-500 text-xs">
                            {errors.callToAction}
                        </p>
                    )}
                    <p className="text-gray-500 dark:text-gray-400 text-xs ml-auto">
                        {formData.callToAction.length}/30
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Link de Destino *
                </label>
                <input
                    type="url"
                    value={formData.linkDestino}
                    onChange={(e) => updateField('linkDestino', e.target.value)}
                    placeholder="https://ejemplo.com/producto"
                    className={`w-full px-3 py-3 bg-white dark:bg-gray-800 border ${errors.linkDestino ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.linkDestino && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.linkDestino}
                    </p>
                )}
            </div>

            <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Texto Alternativo (Opcional)
                </label>
                <input
                    type="text"
                    value={formData.textoAlternativo}
                    onChange={(e) => updateField('textoAlternativo', e.target.value)}
                    placeholder="Descripción de la imagen para accesibilidad"
                    className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>
        </div>
    );
};

export default StepBasicInfo;
