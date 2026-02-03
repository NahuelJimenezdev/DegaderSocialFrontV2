import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Heart } from 'lucide-react';
import { useFundacion } from '../hooks/useFundacion';
import SolicitudesList from '../components/SolicitudesList';
import '../../../shared/styles/headers.style.css';

export default function FundacionPage() {
    const { user, updateUser } = useAuth();

    // Hook de Fundación
    const {
        loading,
        solicitudesPendientes,
        formData,
        setFormData,
        getAreasDisponibles,
        getSubAreasDisponibles,
        getProgramasDisponibles,
        getCargosDisponibles,
        getRolesDisponibles,
        getNivelesDisponibles,
        esDirectorGeneral,
        getPaisesDisponibles,
        getDivisionesTerritoriales,
        getNombreDivisionTerritorial,
        handleNivelChange,
        handleAreaChange,
        handleSubAreaChange,
        handleUpdateProfile,
        handleGestionarSolicitud
    } = useFundacion(user, updateUser);

    return (
        <div className="page-container">
            <div className="mb-mobile-30">
                {/* Header */}
                <div className="section-header">
                    <div className="section-header__icon-box">
                        <Heart className="section-header__icon" strokeWidth={2} />
                    </div>
                    <div className="section-header__content">
                        <h1 className="section-header__title section-header__title--heavy">
                            Fundación Sol y Luna
                        </h1>
                        <p className="section-header__subtitle">
                            Gestiona tu participación y perfil institucional
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        {/* Estado Actual */}
                        {user?.esMiembroFundacion && user?.fundacion && (
                            <div className={`p-4 rounded-lg mb-6 ${user.fundacion?.estadoAprobacion === 'aprobado' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                                user.fundacion?.estadoAprobacion === 'rechazado' ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                                    'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                                }`}>
                                <p className="font-semibold">
                                    Estado: {user.fundacion?.estadoAprobacion?.toUpperCase() || 'DESCONOCIDO'}
                                </p>
                                {user.fundacion?.estadoAprobacion === 'pendiente' && (
                                    <p className="text-sm mt-1">Tu solicitud está siendo revisada por un superior jerárquico.</p>
                                )}
                            </div>
                        )}

                        {/* Formulario */}
                        <form onSubmit={handleUpdateProfile} className="space-y-8">

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Definición de Perfil Institucional</h4>
                                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                                    <li>• ¿En qué nivel actúa? → <strong>Nivel</strong></li>
                                    <li>• ¿En qué área trabaja? → <strong>Área</strong></li>
                                    <li>• ¿Qué responsabilidad tiene? → <strong>Cargo</strong></li>
                                    <li>• ¿Qué función operativa cumple? → <strong>Rol</strong></li>
                                    <li>• ¿En qué unidad específica trabaja? → <strong>Unidad / Programa</strong></li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* 1. NIVEL */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        ¿En qué nivel actúa? <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.nivel}
                                        onChange={(e) => handleNivelChange(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="">Seleccionar Nivel Jerárquico</option>
                                        {getNivelesDisponibles().map(nivel => (
                                            <option key={nivel} value={nivel}>{nivel.replace(/_/g, ' ').toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 2. CARGO */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        ¿Qué responsabilidad tiene? (Cargo) <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.cargo}
                                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                        required
                                        disabled={!formData.nivel}
                                    >
                                        <option value="">{!formData.nivel ? 'Primero selecciona un nivel' : 'Seleccionar Cargo'}</option>
                                        {getCargosDisponibles().map(cargo => (
                                            <option key={cargo} value={cargo}>{cargo}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 3. LÓGICA CONDICIONAL: DIRECTOR GENERAL vs DIRECTOR DE ÁREA */}

                                {!esDirectorGeneral() ? (
                                    <>
                                        {/* ÁREA */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                ¿En qué área trabaja? <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.area}
                                                onChange={(e) => handleAreaChange(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                                required
                                                disabled={!formData.cargo}
                                            >
                                                <option value="">{!formData.cargo ? 'Primero selecciona un cargo' : 'Seleccionar Área'}</option>
                                                {getAreasDisponibles().map(area => (
                                                    <option key={area} value={area}>{area}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* SUB-ÁREA */}
                                        {formData.area && getSubAreasDisponibles().length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Sub-Área (Opcional)
                                                </label>
                                                <select
                                                    value={formData.subArea}
                                                    onChange={(e) => handleSubAreaChange(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="">Seleccionar Sub-Área (Opcional)</option>
                                                    {getSubAreasDisponibles().map(sub => (
                                                        <option key={sub} value={sub}>{sub}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* PROGRAMA */}
                                        {getProgramasDisponibles().length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Programa (Opcional)
                                                </label>
                                                <select
                                                    value={formData.programa}
                                                    onChange={(e) => setFormData({ ...formData, programa: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="">Seleccionar Programa (Opcional)</option>
                                                    {getProgramasDisponibles().map(prog => (
                                                        <option key={prog} value={prog}>{prog}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    // ========== DIRECTORES GENERALES (Pastores con Territorio) ==========
                                    <div className="md:col-span-2 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <strong>Director General:</strong> Gobierna un territorio geográfico completo (no un área funcional específica). Solo pastores pueden ocupar este cargo.
                                        </p>
                                    </div>
                                )}

                                {/* TERRITORIO */}
                                {((esDirectorGeneral() && formData.nivel === 'nacional') || formData.nivel === 'regional' || formData.nivel === 'departamental' || formData.nivel === 'municipal') && (
                                    <>
                                        {/* PAÍS */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                País <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.pais}
                                                onChange={(e) => setFormData({ ...formData, pais: e.target.value, region: '', departamento: '', municipio: '' })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                                required
                                            >
                                                <option value="">Seleccionar País</option>
                                                {getPaisesDisponibles().map(pais => (
                                                    <option key={pais} value={pais}>{pais}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* PROVINCIA/DEPARTAMENTO */}
                                        {formData.pais && formData.nivel !== 'nacional' && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {getNombreDivisionTerritorial()} <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={formData.region || formData.departamento || formData.municipio}
                                                    onChange={(e) => {
                                                        if (formData.nivel === 'regional') {
                                                            setFormData({ ...formData, region: e.target.value, departamento: '', municipio: '' });
                                                        } else if (formData.nivel === 'departamental') {
                                                            setFormData({ ...formData, departamento: e.target.value, municipio: '', region: '' });
                                                        } else {
                                                            setFormData({ ...formData, municipio: e.target.value, departamento: '', region: '' });
                                                        }
                                                    }}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                                    required
                                                >
                                                    <option value="">Seleccionar {getNombreDivisionTerritorial()}</option>
                                                    {getDivisionesTerritoriales().map(div => (
                                                        <option key={div} value={div}>{div}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* 4. ROL FUNCIONAL */}
                                {!esDirectorGeneral() && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            ¿Qué función operativa cumple? (Rol) <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.rolFuncional}
                                            onChange={(e) => setFormData({ ...formData, rolFuncional: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="">Seleccionar Rol Funcional</option>
                                            {getRolesDisponibles().map(rol => (
                                                <option key={rol} value={rol}>{rol.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {esDirectorGeneral() && <div></div>}

                                {/* SECCIÓN TERRITORIAL (Solo para Directores de Área) */}
                                {!esDirectorGeneral() && (
                                    <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-2 mb-4">
                                            <h5 className="font-medium text-gray-900 dark:text-white">Jurisdicción Territorial (Opcional)</h5>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">(Para roles con alcance regional/local)</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* País */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    País
                                                </label>
                                                <select
                                                    value={formData.pais}
                                                    onChange={(e) => setFormData({ ...formData, pais: e.target.value, region: '', departamento: '', municipio: '' })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="">Sin restricción territorial</option>
                                                    {getPaisesDisponibles().map(pais => (
                                                        <option key={pais} value={pais}>{pais}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* División Territorial */}
                                            {formData.pais && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Provincia/Región
                                                    </label>
                                                    <select
                                                        value={formData.region || formData.departamento}
                                                        onChange={(e) => setFormData({ ...formData, region: e.target.value, departamento: '', municipio: '' })}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="">Todo el país</option>
                                                        {getDivisionesTerritoriales().map(div => (
                                                            <option key={div} value={div}>{div}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Botón Submit */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? 'Guardando...' : 'Guardar Perfil'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Panel de Aprobaciones */}
                    {(user?.fundacion?.estadoAprobacion === 'aprobado' || user?.seguridad?.rolSistema === 'Founder') && (
                        <SolicitudesList
                            solicitudes={solicitudesPendientes}
                            onGestionarSolicitud={handleGestionarSolicitud}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
