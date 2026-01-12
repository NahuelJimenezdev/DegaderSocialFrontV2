import React from 'react';

const StepPreview = ({ formData, onSubmit, loading, errors }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Vista Previa de tu Anuncio
            </h3>

            {/* Grid de 2 columnas con estilo original */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Preview del anuncio */}
                <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Así se verá tu anuncio:
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="relative">
                            <img
                                src={formData.imagenUrl}
                                alt={formData.textoAlternativo || formData.nombreCliente}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 rounded text-white text-[10px] font-semibold">
                                PUBLICIDAD
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="text-gray-900 dark:text-white text-sm font-semibold mb-2">
                                {formData.nombreCliente}
                            </h4>
                            <button className="w-full py-2 bg-indigo-600 text-white rounded-md font-semibold text-sm hover:bg-indigo-700 transition-colors">
                                {formData.callToAction}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Resumen de configuración */}
                <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Resumen de Configuración:
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-sm shadow-sm">
                        <div className="mb-4">
                            <p className="text-gray-600 dark:text-gray-400 mb-1">Segmentación:</p>
                            <p className="text-gray-900 dark:text-white">
                                {formData.segmentacion.edadMin}-{formData.segmentacion.edadMax} años,
                                {' '}{formData.segmentacion.genero},
                                {' '}{formData.segmentacion.ubicacion.esGlobal ? 'Global' : 'Local'}
                            </p>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-600 dark:text-gray-400 mb-1">Fechas:</p>
                            <p className="text-gray-900 dark:text-white">
                                {formData.fechaInicio} al {formData.fechaFin}
                            </p>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-600 dark:text-gray-400 mb-1">Presupuesto Total:</p>
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                                {formData.presupuesto} DegaCoins
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={onSubmit}
                            disabled={loading}
                            className={`w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-base transition-colors ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer'
                                }`}
                        >
                            {loading ? 'Creando Campaña...' : 'Confirmar y Crear Campaña'}
                        </button>
                        {errors.submit && (
                            <p className="text-red-500 text-center mt-4 text-sm">
                                {errors.submit}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepPreview;
