import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, CheckCircle2, ChevronRight, MapPin, Briefcase, UserCircle, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { useFundacion } from '../../hooks/useFundacion';
import '../../../../shared/styles/headers.style.css';

const FormularioSolicitud = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const {
        loading,
        formData,
        setFormData,
        getAreasDisponibles,
        getSubAreasDisponibles,
        getProgramasDisponibles,
        getCargosDisponibles,
        getRolesDisponibles,
        getNivelesDisponibles,
        getPaisesDisponibles,
        getDivisionesTerritoriales,
        getNombreDivisionTerritorial,
        handleNivelChange,
        handleCargoChange,
        handleAreaChange,
        handleSubAreaChange,
        handleUpdateProfile,
        requiereUbicacionExacta,
        necesitaRolFuncional
    } = useFundacion(user, updateUser);

    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleUpdateProfile(e);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
    };

    // Standardized selector classes for theme consistency
    const selectClasses = "w-full p-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 dark:text-gray-100 disabled:opacity-50";
    const inputClasses = "w-full p-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 dark:text-gray-100";

    return (
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-8 md:py-8">
            {/* Botón Volver */}
            <button 
                onClick={() => navigate('/fundacion')} 
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 font-medium transition-colors"
            >
                <ChevronLeft size={20} />
                Volver a Fundación
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                {/* Header Profile Style - Fixed background and text visibility */}
                <div className="bg-blue-600 bg-gradient-to-r from-blue-600 to-indigo-700 p-5 md:p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/30">
                            <Briefcase size={40} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Solicitud de Ingreso</h1>
                            <p className="text-blue-50 mt-1 text-lg">Perfil Institucional y Jerárquico</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                             {/* Nivel Jerárquico */}
                             <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                    <UserCircle size={18} className="text-blue-500" />
                                    Nivel Jerárquico
                                </label>
                                <select 
                                    className={selectClasses}
                                    value={formData.nivel}
                                    onChange={(e) => handleNivelChange(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione Nivel</option>
                                    {getNivelesDisponibles().map(n => (
                                        <option key={n} value={n}>{n.replace(/_/g, ' ').toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Cargo */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Cargo Institucional</label>
                                <select 
                                    className={selectClasses}
                                    value={formData.cargo}
                                    onChange={(e) => handleCargoChange(e.target.value)}
                                    disabled={!formData.nivel}
                                    required
                                >
                                    <option value="">Seleccione Cargo</option>
                                    {getCargosDisponibles().map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Área */}
                            {getAreasDisponibles().length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Área / Dirección</label>
                                    <select 
                                        className={selectClasses}
                                        value={formData.area}
                                        onChange={(e) => handleAreaChange(e.target.value)}
                                        disabled={!formData.cargo}
                                    >
                                        <option value="">Seleccione Área</option>
                                        {getAreasDisponibles().map(a => (
                                            <option key={a} value={a}>{a}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* SubÁrea */}
                            {getSubAreasDisponibles().length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Sub-Área</label>
                                    <select 
                                        className={selectClasses}
                                        value={formData.subArea}
                                        onChange={(e) => handleSubAreaChange(e.target.value)}
                                        disabled={!formData.area}
                                    >
                                        <option value="">Seleccione Sub-Área</option>
                                        {getSubAreasDisponibles().map(sa => ( sa &&
                                            <option key={sa} value={sa}>{sa}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Programa */}
                            {getProgramasDisponibles().length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Programa / Proyecto</label>
                                    <select 
                                        className={selectClasses}
                                        value={formData.programa}
                                        onChange={(e) => setFormData({...formData, programa: e.target.value})}
                                        disabled={!formData.subArea && getSubAreasDisponibles().length > 0}
                                    >
                                        <option value="">Seleccione Programa</option>
                                        {getProgramasDisponibles().map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Rol Funcional */}
                            {necesitaRolFuncional() && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Rol Funcional</label>
                                    <select 
                                        className={selectClasses}
                                        value={formData.rolFuncional}
                                        onChange={(e) => setFormData({...formData, rolFuncional: e.target.value})}
                                        required
                                    >
                                        <option value="">Seleccione Rol</option>
                                        {getRolesDisponibles().map(r => (
                                            <option key={r} value={r}>{r.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Ubicación Dinámica */}
                            {requiereUbicacionExacta() && (
                                <>
                                    {/* País */}
                                    <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                    <MapPin size={18} className="text-red-500" />
                                    País de Trabajo
                                </label>
                                <select 
                                    className={selectClasses}
                                    value={formData.pais}
                                    onChange={(e) => setFormData({...formData, pais: e.target.value})}
                                    required
                                >
                                    {getPaisesDisponibles().map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            {/* División Territorial (Departamento/Provincia) */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{getNombreDivisionTerritorial()}</label>
                                <select 
                                    className={selectClasses}
                                    value={formData.departamento}
                                    onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                                    required
                                >
                                    <option value="">Seleccione {getNombreDivisionTerritorial()}</option>
                                    {getDivisionesTerritoriales().map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Municipio / Ciudad */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Municipio / Ciudad</label>
                                <input 
                                    type="text"
                                    className={inputClasses}
                                    placeholder="Nombre del municipio"
                                    value={formData.municipio}
                                    onChange={(e) => setFormData({...formData, municipio: e.target.value})}
                                    required
                                />
                            </div>

                            {/* Barrio / Localidad */}
                            {requiereUbicacionExacta() && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Barrio / Vereda</label>
                                    <input 
                                        type="text"
                                        className={inputClasses}
                                        placeholder="Nombre del barrio"
                                        value={formData.barrio}
                                        onChange={(e) => setFormData({...formData, barrio: e.target.value})}
                                        required
                                    />
                                </div>
                            )}
                                </>
                            )}
                        </div>

                    <div className="pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            {success && (
                                <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl border border-green-100 dark:border-green-800 animate-slideUp">
                                    <CheckCircle2 size={20} />
                                    ¡Solicitud guardada con éxito!
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button 
                                type="submit"
                                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg active:scale-95 flex-1 md:flex-none flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : (
                                    <>
                                        <Save size={20} />
                                        Enviar Solicitud
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 flex items-start gap-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <CheckCircle2 size={20} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Esta información es fundamental para asignar tu rol dentro de la Estructura Jerárquica de la Fundación. Tu solicitud será revisada por un Director o Coordinador de tu zona.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FormularioSolicitud;
