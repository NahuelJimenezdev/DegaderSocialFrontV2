import { useState, useEffect, useCallback } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import userService from '../../../api/userService';
import folderService from '../../../api/folderService';
import fundacionService from '../../../api/fundacionService';
import { getPaisesOrdenados, getDivisionesPais, getTipoDivision } from '../../../data/paisesProvincias';
import { getSocket } from '../../../shared/lib/socket';

/**
 * Custom hook para manejar la lógica de la fundación
 * @param {Object} user - Usuario actual
 * @param {Function} updateUser - Función para actualizar usuario
 * @returns {Object} Estado y funciones para manejar fundación
 */
export const useFundacion = (user, updateUser) => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    // ==========================================
    // 🔹 ESTRUCTURA JERÁRQUICA (Nivel → Área → SubÁrea → Programa)
    // ==========================================

    const ESTRUCTURA_FUNDACION = {
        // Niveles Globales (Directivo General, Órgano Control, Internacional)
        directivo_general: {
            areas: {
                "Dirección Ejecutiva": { subAreas: {}, programas: {} },
                "Secretaría Ejecutiva": { subAreas: {}, programas: {} },
                "Junta Directiva": { subAreas: {}, programas: {} }
            }
        },
        organo_control: {
            areas: {
                "Dirección de Control Interno y Seguimiento": {
                    subAreas: {
                        "Interventoría Interna": { programas: {} },
                        "Interventoría Externa": { programas: {} }
                    }
                },
                "Dirección de Asuntos Éticos": { subAreas: {}, programas: {} }
            }
        },
        organismo_internacional: {
            areas: {
                "Salvación Mundial": { subAreas: {}, programas: {} },
                "Misión Internacional de Paz": { subAreas: {}, programas: {} }
            }
        },

        // Niveles Operativos (Nacional, Regional, Departamental, Municipal)
        nacional: {
            areas: {
                "Dirección de Planeación Estratégica y Proyectos": {
                    subAreas: {},
                    programas: { "Banco de Proyectos": true }
                },
                "Dirección de Asuntos Étnicos": { subAreas: {}, programas: {} },
                "Dirección de Infraestructura": { subAreas: {}, programas: {} },
                "Dirección de Sostenibilidad Ambiental": { subAreas: {}, programas: {} },
                "Dirección de Recursos Humanos y Seguridad Laboral": {
                    subAreas: {},
                    programas: {
                        "Programas de Asuntos y Competencia Laboral": true,
                        "Programas de Bienestar y Seguridad Laboral": true,
                        "Programa de Gestión Documental y Almacén": true
                    }
                },
                "Dirección Jurídica": {
                    subAreas: {},
                    programas: {
                        "Contratación": true,
                        "Banco de Oferentes": true,
                        "Programa de Jueces de Paz": true
                    }
                },
                "Dirección de Salud": {
                    subAreas: {
                        "Dirección Psicosocial": {
                            programas: {
                                "Programas de Salud Mental": true,
                                "Programas de Salud Sexual y Reproductiva": true,
                                "Programas de Acompañamiento Productivo": true
                            }
                        },
                        "Gerencia Clínica": {
                            programas: { "Programas de Salud": true }
                        },
                        "Dirección de Protección Animal": {
                            programas: {
                                "Programas de Promoción y Prevención en la Salud Animal": true
                            }
                        },
                        "Gerencia Clínica Veterinaria": { programas: {} }
                    }
                },
                "Dirección de Educación": {
                    subAreas: {},
                    programas: {
                        "Programas de Educación": true,
                        "Programas de Cultura y Turismo": true,
                        "Gerencias Universitarias": true
                    }
                },
                "Dirección Financiera": {
                    subAreas: {},
                    programas: {
                        "Programas de Tesorería": true,
                        "Programas de Contabilidad": true
                    }
                },
                "Dirección de Imagen Corporativa y Comunicación": {
                    subAreas: {},
                    programas: {
                        "Comunicaciones de Prensa": true,
                        "Programas de Radio y Televisión": true,
                        "Programa de Conexión y Desarrollo Informático": true
                    }
                },
                "Dirección de Seguridad": { subAreas: {}, programas: {} }
            }
        },
        regional: {
            areas: {
                "Dirección de Planeación Estratégica y Proyectos": {
                    subAreas: {},
                    programas: { "Banco de Proyectos": true }
                },
                "Dirección de Asuntos Étnicos": { subAreas: {}, programas: {} },
                "Dirección de Infraestructura": { subAreas: {}, programas: {} },
                "Dirección de Sostenibilidad Ambiental": { subAreas: {}, programas: {} },
                "Dirección de Recursos Humanos y Seguridad Laboral": {
                    subAreas: {},
                    programas: {
                        "Programas de Asuntos y Competencia Laboral": true,
                        "Programas de Bienestar y Seguridad Laboral": true,
                        "Programa de Gestión Documental y Almacén": true
                    }
                },
                "Dirección Jurídica": {
                    subAreas: {},
                    programas: {
                        "Contratación": true,
                        "Banco de Oferentes": true,
                        "Programa de Jueces de Paz": true
                    }
                },
                "Dirección de Salud": {
                    subAreas: {
                        "Dirección Psicosocial": {
                            programas: {
                                "Programas de Salud Mental": true,
                                "Programas de Salud Sexual y Reproductiva": true,
                                "Programas de Acompañamiento Productivo": true
                            }
                        },
                        "Gerencia Clínica": {
                            programas: { "Programas de Salud": true }
                        },
                        "Dirección de Protección Animal": {
                            programas: {
                                "Programas de Promoción y Prevención en la Salud Animal": true
                            }
                        },
                        "Gerencia Clínica Veterinaria": { programas: {} }
                    }
                },
                "Dirección de Educación": {
                    subAreas: {},
                    programas: {
                        "Programas de Educación": true,
                        "Programas de Cultura y Turismo": true,
                        "Gerencias Universitarias": true
                    }
                },
                "Dirección Financiera": {
                    subAreas: {},
                    programas: {
                        "Programas de Tesorería": true,
                        "Programas de Contabilidad": true
                    }
                },
                "Dirección de Imagen Corporativa y Comunicación": {
                    subAreas: {},
                    programas: {
                        "Comunicaciones de Prensa": true,
                        "Programas de Radio y Televisión": true,
                        "Programa de Conexión y Desarrollo Informático": true
                    }
                },
                "Dirección de Seguridad": { subAreas: {}, programas: {} }
            }
        },
        departamental: {
            areas: {
                "Coordinación de Planeación Estratégica y Proyectos": {
                    subAreas: {},
                    programas: { "Banco de Proyectos": true }
                },
                "Coordinación de Asuntos Étnicos": { subAreas: {}, programas: {} },
                "Coordinación de Infraestructura": { subAreas: {}, programas: {} },
                "Coordinación de Sostenibilidad Ambiental": { subAreas: {}, programas: {} },
                "Coordinación de Recursos Humanos y Seguridad Laboral": {
                    subAreas: {},
                    programas: {
                        "Programas de Asuntos y Competencia Laboral": true,
                        "Programas de Bienestar y Seguridad Laboral": true,
                        "Programa de Gestión Documental y Almacén": true
                    }
                },
                "Coordinación Jurídica": {
                    subAreas: {},
                    programas: {
                        "Contratación": true,
                        "Banco de Oferentes": true,
                        "Programa de Jueces de Paz": true
                    }
                },
                "Coordinación de Salud": {
                    subAreas: {
                        "Dirección Psicosocial": {
                            programas: {
                                "Programas de Salud Mental": true,
                                "Programas de Salud Sexual y Reproductiva": true,
                                "Programas de Acompañamiento Productivo": true
                            }
                        },
                        "Gerencia Clínica": {
                            programas: { "Programas de Salud": true }
                        },
                        "Dirección de Protección Animal": {
                            programas: {
                                "Programas de Promoción y Prevención en la Salud Animal": true
                            }
                        },
                        "Gerencia Clínica Veterinaria": { programas: {} }
                    }
                },
                "Coordinación de Educación": {
                    subAreas: {},
                    programas: {
                        "Programas de Educación": true,
                        "Programas de Cultura y Turismo": true,
                        "Gerencias Universitarias": true
                    }
                },
                "Coordinación Financiera": {
                    subAreas: {},
                    programas: {
                        "Programas de Tesorería": true,
                        "Programas de Contabilidad": true
                    }
                },
                "Coordinación de Imagen Corporativa y Comunicación": {
                    subAreas: {},
                    programas: {
                        "Comunicaciones de Prensa": true,
                        "Programas de Radio y Televisión": true,
                        "Programa de Conexión y Desarrollo Informático": true
                    }
                },
                "Coordinación de Seguridad": { subAreas: {}, programas: {} }
            }
        },
        municipal: {
            areas: {
                "Coordinación de Planeación Estratégica y Proyectos": {
                    subAreas: {},
                    programas: { "Banco de Proyectos": true }
                },
                "Coordinación de Asuntos Étnicos": { subAreas: {}, programas: {} },
                "Coordinación de Infraestructura": { subAreas: {}, programas: {} },
                "Coordinación de Sostenibilidad Ambiental": { subAreas: {}, programas: {} },
                "Coordinación de Recursos Humanos y Seguridad Laboral": {
                    subAreas: {},
                    programas: {
                        "Programas de Asuntos y Competencia Laboral": true,
                        "Programas de Bienestar y Seguridad Laboral": true,
                        "Programa de Gestión Documental y Almacén": true
                    }
                },
                "Coordinación Jurídica": {
                    subAreas: {},
                    programas: {
                        "Contratación": true,
                        "Banco de Oferentes": true,
                        "Programa de Jueces de Paz": true
                    }
                },
                "Coordinación de Salud": {
                    subAreas: {
                        "Dirección Psicosocial": {
                            programas: {
                                "Programas de Salud Mental": true,
                                "Programas de Salud Sexual y Reproductiva": true,
                                "Programas de Acompañamiento Productivo": true
                            }
                        },
                        "Gerencia Clínica": {
                            programas: { "Programas de Salud": true }
                        },
                        "Dirección de Protección Animal": {
                            programas: {
                                "Programas de Promoción y Prevención en la Salud Animal": true
                            }
                        },
                        "Gerencia Clínica Veterinaria": { programas: {} }
                    }
                },
                "Coordinación de Educación": {
                    subAreas: {},
                    programas: {
                        "Programas de Educación": true,
                        "Programas de Cultura y Turismo": true,
                        "Gerencias Universitarias": true
                    }
                },
                "Coordinación Financiera": {
                    subAreas: {},
                    programas: {
                        "Programas de Tesorería": true,
                        "Programas de Contabilidad": true
                    }
                },
                "Coordinación de Imagen Corporativa y Comunicación": {
                    subAreas: {},
                    programas: {
                        "Comunicaciones de Prensa": true,
                        "Programas de Radio y Televisión": true,
                        "Programa de Conexión y Desarrollo Informático": true
                    }
                },
                "Coordinación de Seguridad": { subAreas: {}, programas: {} }
            }
        }
    };

    const CARGOS_POR_NIVEL = {
        directivo_general: ["Director Ejecutivo", "Secretario Ejecutivo", "Miembro de Junta Directiva"],
        organo_control: ["Auditor", "Secretario/a", "Miembro Comité Ético"],
        organismo_internacional: ["Delegado Internacional", "Secretario/a"],
        nacional: ["Director", "Secretario/a", "Director General (Pastor)"],
        regional: ["Director", "Secretario/a", "Director General (Pastor)"],
        departamental: ["Director", "Coordinador", "Secretario/a", "Director General (Pastor)"],
        municipal: ["Coordinador", "Secretario/a", "Director General (Pastor)"],
        local: ["Coordinador", "Secretario/a", "Director General (Pastor)"],
        barrial: ["Coordinador", "Secretario/a", "Director General (Pastor)"]
    };

    const ROLES_FUNCIONALES = ["profesional", "encargado", "asistente", "secretario/a", "voluntario", "pastor"];

    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
    const [formData, setFormData] = useState({
        nivel: '',
        area: '',
        subArea: '',
        programa: '',
        cargo: '',
        rolFuncional: '',
        pais: 'Colombia',
        region: '',
        departamento: '',
        municipio: '',
        barrio: ''
    });

    // ==========================================
    // 🔹 LÓGICA DE FILTRADO DINÁMICO
    // ==========================================

    const getAreasDisponibles = () => {
        if (!formData.nivel) return [];
        return Object.keys(ESTRUCTURA_FUNDACION[formData.nivel]?.areas || {});
    };

    const getSubAreasDisponibles = () => {
        if (!formData.nivel || !formData.area) return [];
        const areaData = ESTRUCTURA_FUNDACION[formData.nivel]?.areas[formData.area];
        return Object.keys(areaData?.subAreas || {});
    };

    const getProgramasDisponibles = () => {
        if (!formData.nivel || !formData.area) return [];

        const areaData = ESTRUCTURA_FUNDACION[formData.nivel]?.areas[formData.area];

        // Si tiene subárea seleccionada, buscar programas de la subárea
        if (formData.subArea && areaData?.subAreas[formData.subArea]) {
            return Object.keys(areaData.subAreas[formData.subArea].programas || {});
        }

        // Si no tiene subárea, buscar programas directos del área
        return Object.keys(areaData?.programas || {});
    };

    const getCargosDisponibles = () => {
        if (!formData.nivel) return [];
        const cargos = CARGOS_POR_NIVEL[formData.nivel] || [];

        // Ajustar género para "Secretario/a"
        return cargos.map(cargo => {
            if (cargo === "Secretario/a") {
                const genero = user?.personal?.genero;
                if (genero === 'M') return "Secretario";
                if (genero === 'F') return "Secretaria";
                return "Secretario/a";
            }
            return cargo;
        });
    };

    // ==========================================
    // 🔹 FUNCIONES PARA DIRECTORES GENERALES (TERRITORIOS)
    // ==========================================

    const esDirectorGeneral = () => {
        return formData.cargo === "Director General (Pastor)";
    };

    const getPaisesDisponibles = () => {
        return getPaisesOrdenados();
    };

    const getDivisionesTerritoriales = () => {
        if (!formData.pais) return [];
        return getDivisionesPais(formData.pais);
    };

    const getNombreDivisionTerritorial = () => {
        if (!formData.pais) return "Provincia/Departamento";
        const tipo = getTipoDivision(formData.pais);
        return tipo.charAt(0).toUpperCase() + tipo.slice(1);
    };

    // Limpiar campos dependientes cuando cambia un nivel superior
    const handleNivelChange = (nuevoNivel) => {
        setFormData({
            ...formData,
            nivel: nuevoNivel,
            area: '',
            subArea: '',
            programa: '',
            cargo: ''
        });
    };

    const handleAreaChange = (nuevaArea) => {
        setFormData({
            ...formData,
            area: nuevaArea,
            subArea: '',
            programa: ''
        });
    };

    const handleSubAreaChange = (nuevaSubArea) => {
        setFormData({
            ...formData,
            subArea: nuevaSubArea,
            programa: ''
        });
    };

    const cargarSolicitudesPendientes = useCallback(async () => {
        try {
            // Founder NO debe usar este endpoint, usa monitoreo global
            if (user?.seguridad?.rolSistema === 'Founder') {
                return;
            }

            logger.log('🔍 Cargando solicitudes pendientes...');
            logger.log('👤 Usuario actual:', {
                id: user?._id,
                nivel: user?.fundacion?.nivel,
                area: user?.fundacion?.area,
                estadoAprobacion: user?.fundacion?.estadoAprobacion
            });

            const response = await fundacionService.getPendingRequests();

            logger.log('📦 Respuesta del backend:', response);
            logger.log(`✅ Solicitudes cargadas: ${response.data?.solicitudes?.length || 0}`);

            if (response.data?.solicitudes) {
                logger.log('📋 Solicitudes:', response.data.solicitudes);
            }

            setSolicitudesPendientes(response.data?.solicitudes || []);
        } catch (error) {
            logger.error('❌ Error cargando solicitudes:', error);
            logger.error('❌ Error completo:', error.response?.data || error.message);
        }
    }, [user]);

    // Actualizar perfil
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Para Director General (Pastor), área puede estar vacía
            const esDirectorGen = formData.cargo === "Director General (Pastor)";

            const updatedData = {
                esMiembroFundacion: true,
                fundacion: {
                    activo: true,
                    nivel: formData.nivel,
                    area: esDirectorGen && !formData.area ? undefined : formData.area,
                    subArea: formData.subArea || undefined,
                    programa: formData.programa || undefined,
                    cargo: formData.cargo,
                    rolFuncional: formData.rolFuncional,
                    territorio: {
                        pais: formData.pais,
                        region: formData.region,
                        departamento: formData.departamento,
                        municipio: formData.municipio,
                        barrio: formData.barrio
                    }
                }
            };

            const response = await userService.updateProfile(updatedData);

            updateUser({ ...user, ...response.data });
            toast.success('Solicitud enviada. Tu estado ahora es PENDIENTE de aprobación.');
        } catch (error) {
            logger.error('Error actualizando perfil:', error);
            toast.error('Error al enviar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    // Gestionar solicitud
    const handleGestionarSolicitud = async (userId, accion) => {
        try {
            if (accion === 'aprobar') {
                await fundacionService.approveRequest(userId);
                toast.success('Solicitud aprobada correctamente');
            } else {
                await fundacionService.rejectRequest(userId, 'No cumple requisitos');
                toast.info('Solicitud rechazada');
            }
            cargarSolicitudesPendientes();
        } catch (error) {
            logger.error('Error gestionando solicitud:', error);
            toast.error('Error al gestionar solicitud');
        }
    };

    // Inicializar datos cuando cambia el usuario
    useEffect(() => {
        if (user?.fundacion) {
            setFormData(prev => ({
                ...prev,
                nivel: user.fundacion.nivel || '',
                area: user.fundacion.area || '',
                subArea: user.fundacion.subArea || '',
                programa: user.fundacion.programa || '',
                cargo: user.fundacion.cargo || '',
                rolFuncional: user.fundacion.rolFuncional || '',
                pais: user.fundacion.territorio?.pais || 'Colombia',
                region: user.fundacion.territorio?.region || '',
                departamento: user.fundacion.territorio?.departamento || '',
                municipio: user.fundacion.territorio?.municipio || '',
                barrio: user.fundacion.territorio?.barrio || ''
            }));

            if (user.fundacion.estadoAprobacion === 'aprobado') {
                cargarSolicitudesPendientes();
            }
        }
    }, [user]);

    // Auto-seleccionar rol "pastor" cuando se elige Director General
    useEffect(() => {
        if (formData.cargo === "Director General (Pastor)" && formData.rolFuncional !== "pastor") {
            setFormData(prev => ({ ...prev, rolFuncional: "pastor" }));
        }
    }, [formData.cargo]);

    // 📡 Escuchar actualizaciones en tiempo real de solicitudes
    useEffect(() => {
        const socket = getSocket();
        if (!socket) {
            logger.warn('⚠️ Socket no disponible para fundacion:solicitudActualizada');
            return;
        }

        const handleSolicitudActualizada = (data) => {
            logger.log('📡 Solicitud actualizada en tiempo real:', data);

            // Actualizar lista de solicitudes pendientes
            setSolicitudesPendientes(prev => {
                // Si fue aprobada o rechazada, removerla de pendientes
                if (data.accion === 'aprobada' || data.accion === 'rechazada') {
                    return prev.filter(s => s._id !== data.userId);
                }
                return prev;
            });

            // Recargar solicitudes para mantener sincronizado
            if (user?.fundacion?.estadoAprobacion === 'aprobado') {
                cargarSolicitudesPendientes();
            }
        };

        socket.on('fundacion:solicitudActualizada', handleSolicitudActualizada);
        logger.log('✅ Listener fundacion:solicitudActualizada registrado');

        return () => {
            socket.off('fundacion:solicitudActualizada', handleSolicitudActualizada);
        };
    }, [user, cargarSolicitudesPendientes]);

    // 📡 Escuchar cuando llega una NUEVA solicitud (notificación)
    useEffect(() => {
        const socket = getSocket();

        logger.log('🔌 Verificando socket para newNotification:', {
            socketExists: !!socket,
            socketConnected: socket?.connected,
            userAprobado: user?.fundacion?.estadoAprobacion === 'aprobado'
        });

        if (!socket || !user) {
            logger.warn('⚠️ Socket o usuario no disponible para newNotification');
            return;
        }

        const handleNewNotification = (notification) => {
            logger.log('📨 Nueva notificación recibida en useFundacion:', notification);

            // Si es una solicitud de fundación, recargar la lista
            if (notification.tipo === 'solicitud_fundacion' && user?.fundacion?.estadoAprobacion === 'aprobado') {
                logger.log('🔄 Recargando solicitudes por nueva solicitud de fundación...');
                cargarSolicitudesPendientes();
            }
        };

        socket.on('newNotification', handleNewNotification);
        logger.log('✅ Listener newNotification registrado en useFundacion');

        return () => {
            socket.off('newNotification', handleNewNotification);
            logger.log('🔇 Listener newNotification removido de useFundacion');
        };
    }, [user, cargarSolicitudesPendientes]);

    // 📡 Escuchar cuando el PROPIO usuario es aprobado/rechazado
    useEffect(() => {
        const socket = getSocket();

        logger.log('🔌 Verificando socket para fundacion:solicitudActualizada:', {
            socketExists: !!socket,
            socketConnected: socket?.connected,
            userId: user?._id
        });

        if (!socket || !user) {
            logger.warn('⚠️ Socket o usuario no disponible para actualización de estado');
            return;
        }

        const handleMiSolicitudActualizada = (data) => {
            logger.log('📡 Evento fundacion:solicitudActualizada recibido:', data);
            logger.log('👤 Usuario actual ID:', user._id);
            logger.log('🆔 Data userId:', data.userId);

            // Verificar si la actualización es para el usuario actual
            if (data.userId === user._id) {
                logger.log('✅ Mi solicitud fue actualizada:', data.accion);

                // Actualizar el contexto del usuario con el nuevo estado
                const updatedUser = {
                    ...user,
                    fundacion: {
                        ...user.fundacion,
                        estadoAprobacion: data.solicitud.fundacion.estadoAprobacion,
                        fechaAprobacion: data.solicitud.fundacion.fechaAprobacion,
                        aprobadoPor: data.solicitud.fundacion.aprobadoPor,
                        motivoRechazo: data.solicitud.fundacion.motivoRechazo
                    }
                };

                logger.log('🔄 Actualizando usuario con:', updatedUser.fundacion);
                updateUser(updatedUser);
            } else {
                logger.log('⚠️ La actualización NO es para este usuario');
            }
        };

        socket.on('fundacion:solicitudActualizada', handleMiSolicitudActualizada);
        logger.log('✅ Listener fundacion:solicitudActualizada registrado');

        return () => {
            socket.off('fundacion:solicitudActualizada', handleMiSolicitudActualizada);
            logger.log('🔇 Listener fundacion:solicitudActualizada removido');
        };
    }, [user, updateUser]);

    return {
        // Estado
        loading,
        solicitudesPendientes,
        formData,

        // Setters
        setFormData,

        // Funciones de filtrado dinámico
        getAreasDisponibles,
        getSubAreasDisponibles,
        getProgramasDisponibles,
        getCargosDisponibles,
        getRolesDisponibles: () => ROLES_FUNCIONALES,
        getNivelesDisponibles: () => Object.keys(ESTRUCTURA_FUNDACION),

        // Funciones para Directores Generales (Territorios)
        esDirectorGeneral,
        getPaisesDisponibles,
        getDivisionesTerritoriales,
        getNombreDivisionTerritorial,

        // Handlers con limpieza automática
        handleNivelChange,
        handleAreaChange,
        handleSubAreaChange,

        // Funciones
        cargarSolicitudesPendientes,
        handleUpdateProfile,
        handleGestionarSolicitud
    };
};
