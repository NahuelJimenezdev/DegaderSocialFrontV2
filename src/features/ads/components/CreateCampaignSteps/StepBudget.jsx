import React from 'react';

const StepBudget = ({ formData, updateField, errors, currentBalance }) => {
    return (
        <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Configuración de Campaña
            </h3>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                        Fecha de Inicio *
                    </label>
                    <input
                        type="date"
                        value={formData.fechaInicio}
                        onChange={(e) => updateField('fechaInicio', e.target.value)}
                        className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                        Fecha de Fin *
                    </label>
                    <input
                        type="date"
                        value={formData.fechaFin}
                        onChange={(e) => updateField('fechaFin', e.target.value)}
                        className={`w-full px-3 py-3 bg-white dark:bg-gray-800 border ${errors.fechaFin ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                    {errors.fechaFin && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.fechaFin}
                        </p>
                    )}
                </div>
            </div>

            {/* Presupuesto */}
            <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Presupuesto (DegaCoins) *
                </label>
                <input
                    type="number"
                    min="1"
                    value={formData.presupuesto}
                    onChange={(e) => updateField('presupuesto', parseInt(e.target.value))}
                    className={`w-full px-3 py-3 bg-white dark:bg-gray-800 border ${errors.presupuesto ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                <div className="flex justify-between mt-1">
                    {errors.presupuesto && (
                        <p className="text-red-500 text-xs">
                            {errors.presupuesto}
                        </p>
                    )}
                    <p className="text-gray-500 dark:text-gray-400 text-xs ml-auto">
                        Balance disponible: {currentBalance} DegaCoins
                    </p>
                </div>
            </div>

            {/* Máximo de impresiones por usuario */}
            <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Máximo de Impresiones por Usuario
                </label>
                <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxImpresionesUsuario}
                    onChange={(e) => updateField('maxImpresionesUsuario', parseInt(e.target.value))}
                    className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                    Recomendado: 3 (evita saturar a los usuarios)
                </p>
            </div>

            {/* Prioridad */}
            <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Prioridad
                </label>
                <select
                    value={formData.prioridad}
                    onChange={(e) => updateField('prioridad', e.target.value)}
                    className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    <option value="basica">Básica</option>
                    <option value="premium">Premium</option>
                    <option value="destacada">Destacada</option>
                </select>
            </div>
        </div>
    );
};

export default StepBudget;
