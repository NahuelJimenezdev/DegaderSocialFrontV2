import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, HardDrive, Shield, Users, Building, File } from 'lucide-react';

const FolderHeader = ({
    carpeta,
    onUpload,
    uploading,
    tienePermisoEscritura,
    fileInputRef
}) => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            <button
                onClick={() => navigate('/Mis_carpetas')}
                className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors group"
            >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Volver a Mis Carpetas
            </button>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-2xl">
                {/* Top Row: Button on mobile/tablet */}
                <div className="flex lg:hidden justify-end mb-4">
                    {tienePermisoEscritura && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={onUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-white"
                            >
                                <Upload size={18} />
                                {uploading ? 'Subiendo...' : 'Subir Archivo'}
                            </button>
                        </>
                    )}
                </div>

                {/* Main Content Row */}
                <div className="flex items-start gap-5">
                    {/* Icon - Always Left */}
                    <div
                        className="flex-shrink-0 p-4 md:p-5 rounded-2xl border-2"
                        style={{
                            backgroundColor: carpeta.color + '10',
                            borderColor: carpeta.color
                        }}
                    >
                        <HardDrive style={{ color: carpeta.color }} size={40} />
                    </div>

                    {/* Center Content: Text + Badges */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">{carpeta.nombre}</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{carpeta.descripcion}</p>
                            </div>

                            {/* Button - Desktop Only (Top Right) */}
                            <div className="hidden lg:flex items-start">
                                {tienePermisoEscritura && (
                                    <>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={onUpload}
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-white whitespace-nowrap"
                                        >
                                            <Upload size={20} />
                                            {uploading ? 'Subiendo...' : 'Subir Archivo'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${carpeta.tipo === 'personal' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                carpeta.tipo === 'grupal' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                    'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30'
                                }`}>
                                {carpeta.tipo === 'personal' && <Shield size={14} className="mr-1.5" />}
                                {carpeta.tipo === 'grupal' && <Users size={14} className="mr-1.5" />}
                                {carpeta.tipo === 'institucional' && <Building size={14} className="mr-1.5" />}
                                {carpeta.tipo.charAt(0).toUpperCase() + carpeta.tipo.slice(1)}
                            </span>

                            {carpeta.visibilidadPorArea?.habilitado && (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 dark:text-indigo-300 border border-indigo-500/30">
                                    <Building size={14} className="mr-1.5" />
                                    {carpeta.visibilidadPorArea.areas[0]}
                                </span>
                            )}

                            {carpeta.visibilidadPorCargo?.habilitado && carpeta.visibilidadPorCargo.cargos.length > 0 && (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 dark:text-purple-300 border border-purple-500/30">
                                    <Users size={14} className="mr-1.5" />
                                    {carpeta.visibilidadPorCargo.cargos.join(', ')}
                                </span>
                            )}

                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-500/12 text-slate-400 dark:text-slate-300 border border-slate-500/25">
                                <File size={14} className="mr-1.5" />
                                {carpeta.archivos.length} archivo{carpeta.archivos.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FolderHeader;
