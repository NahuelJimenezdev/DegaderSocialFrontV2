import React from 'react';

const StepBasicInfo = ({ formData, updateField, errors, isFounderView }) => {
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

            {isFounderView && (
                <div className="mb-6 rounded-xl border-2 border-emerald-500/50 bg-[#0f172a] shadow-[0_0_20px_rgba(16,185,129,0.15)] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 blur-sm pointer-events-none transition-transform duration-700 group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div className="p-5 relative z-10">
                        <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                            <span className="bg-emerald-500/20 p-1.5 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></span>
                            Seguridad de Sistema: Modo Administrador
                        </h4>
                        
                        <div className="mb-5 bg-gray-900/40 p-4 rounded-lg border border-gray-800">
                            <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Asignar Pertenencia (Email Target)</label>
                            <input
                                type="email"
                                value={formData.overrideClienteEmail || ''}
                                onChange={(e) => updateField('overrideClienteEmail', e.target.value)}
                                placeholder="usuario@degadersocial.com"
                                className="w-full px-3 py-2.5 bg-[#0b0f19] border border-gray-700/50 rounded-lg text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                            />
                            {formData.overrideClienteEmail ? (
                                <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                    Buscando y vinculando a <b>{formData.overrideClienteEmail}</b>
                                </p>
                            ) : (
                                <p className="text-[11px] text-amber-500 mt-2 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    Campaña Institucional: Se registrará como Identidad Global de DegaderSocial
                                </p>
                            )}
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-all">
                            <input 
                                type="checkbox" 
                                checked={formData.esGratuito} 
                                onChange={(e) => updateField('esGratuito', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                            />
                            <div>
                                <span className="text-emerald-100 text-sm font-bold block leading-none mb-1">Activar Patrocinio Gratuito</span>
                                <span className="text-emerald-400/80 text-[10px] leading-tight block">Fuerza Costo Cero (0). Omite validación y deducción de DegaCoins.</span>
                            </div>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepBasicInfo;
