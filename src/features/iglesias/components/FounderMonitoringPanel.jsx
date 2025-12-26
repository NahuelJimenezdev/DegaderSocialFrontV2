import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import useFounderMonitoring from '../hooks/useFounderMonitoring';
import './FounderMonitoringPanel.css';

const FounderMonitoringPanel = () => {
    const [isDark, setIsDark] = useState(false);

    const {
        solicitudes,
        loading,
        pagination,
        filters,
        aplicarFiltros,
        limpiarFiltros,
        cambiarPagina,
        recargar
    } = useFounderMonitoring();

    // Detectar dark mode
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        checkDarkMode();

        // Observer para detectar cambios en la clase dark
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    const handleFilterChange = (campo, valor) => {
        aplicarFiltros({ ...filters, [campo]: valor });
    };

    // Estilos condicionales para dark mode
    const getStyles = () => ({
        panel: {
            padding: '20px',
            background: isDark ? '#1F2937' : 'white',
            borderRadius: '8px',
            boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
        },
        header: {
            color: isDark ? '#F3F4F6' : '#333'
        },
        label: {
            fontSize: '14px',
            fontWeight: '600',
            color: isDark ? '#D1D5DB' : '#374151'
        },
        select: {
            padding: '10px 14px',
            border: `2px solid ${isDark ? '#374151' : '#E5E7EB'}`,
            borderRadius: '8px',
            fontSize: '14px',
            background: isDark ? '#374151' : 'white',
            cursor: 'pointer',
            fontWeight: '500',
            color: isDark ? '#F3F4F6' : '#374151',
            transition: 'all 0.2s',
            outline: 'none'
        },
        table: {
            background: isDark ? '#1F2937' : 'white',
            color: isDark ? '#E5E7EB' : '#555'
        },
        tableHeader: {
            background: isDark ? '#374151' : '#f8f9fa',
            color: isDark ? '#F3F4F6' : '#333'
        },
        tableRow: {
            borderBottom: `1px solid ${isDark ? '#374151' : '#dee2e6'}`
        },
        tableRowHover: {
            background: isDark ? '#374151' : '#f8f9fa'
        }
    });

    const styles = getStyles();

    const getEstadoBadge = (estado) => {
        const badges = {
            pendiente: {
                text: '🟡 Pendiente',
                style: {
                    background: 'linear-gradient(135deg, #FFA726 0%, #FF9800 100%)',
                    color: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(255, 152, 0, 0.2)',
                    letterSpacing: '0.3px'
                }
            },
            aprobado: {
                text: '🟢 Aprobado',
                style: {
                    background: isDark
                        ? 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)'
                        : 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)',
                    color: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: isDark
                        ? '0 2px 6px rgba(76, 175, 80, 0.3)'
                        : '0 2px 4px rgba(76, 175, 80, 0.2)',
                    letterSpacing: '0.3px'
                }
            },
            rechazado: {
                text: '🔴 Rechazado',
                style: {
                    background: isDark
                        ? 'linear-gradient(135deg, #E53935 0%, #C62828 100%)'
                        : 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)',
                    color: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: isDark
                        ? '0 2px 6px rgba(229, 57, 53, 0.3)'
                        : '0 2px 4px rgba(229, 57, 53, 0.2)',
                    letterSpacing: '0.3px'
                }
            }
        };
        return badges[estado] || badges.pendiente;
    };

    return (
        <div style={styles.panel}>
            <div className="panel-header">
                <h2 style={styles.header}>📊 Monitoreo Global de Solicitudes</h2>
                <button onClick={recargar} className="btn-refresh" disabled={loading}>
                    <RefreshCw className={loading ? 'spinning' : ''} size={18} />
                    Actualizar
                </button>
            </div>

            {/* Filtros */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                flexWrap: 'wrap',
                alignItems: 'flex-end'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px' }}>
                    <label style={{
                        ...styles.label,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <Filter size={16} />
                        Estado
                    </label>
                    <select
                        value={filters.estado}
                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                        style={styles.select}
                        onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                        onBlur={(e) => e.target.style.borderColor = isDark ? '#374151' : '#E5E7EB'}
                    >
                        <option value="">Todos</option>
                        <option value="pendiente">🟡 Pendiente</option>
                        <option value="aprobado">🟢 Aprobado</option>
                        <option value="rechazado">🔴 Rechazado</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px' }}>
                    <label style={styles.label}>Nivel</label>
                    <select
                        value={filters.nivel}
                        onChange={(e) => handleFilterChange('nivel', e.target.value)}
                        style={styles.select}
                        onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                        onBlur={(e) => e.target.style.borderColor = isDark ? '#374151' : '#E5E7EB'}
                    >
                        <option value="">Todos</option>
                        <option value="nacional">Nacional</option>
                        <option value="regional">Regional</option>
                        <option value="departamental">Departamental</option>
                        <option value="municipal">Municipal</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px' }}>
                    <label style={styles.label}>País</label>
                    <select
                        value={filters.pais}
                        onChange={(e) => handleFilterChange('pais', e.target.value)}
                        style={styles.select}
                        onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                        onBlur={(e) => e.target.style.borderColor = isDark ? '#374151' : '#E5E7EB'}
                    >
                        <option value="">Todos</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Venezuela">Venezuela</option>
                    </select>
                </div>

                <button
                    onClick={limpiarFiltros}
                    style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)',
                        height: '42px'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(99, 102, 241, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(99, 102, 241, 0.2)';
                    }}
                >
                    Limpiar Filtros
                </button>
            </div>

            {/* Tabla de Solicitudes */}
            <div className="table-container">
                {loading ? (
                    <div className="loading-state" style={{ color: isDark ? '#9CA3AF' : '#999' }}>Cargando...</div>
                ) : solicitudes.length === 0 ? (
                    <div className="empty-state" style={{ color: isDark ? '#9CA3AF' : '#999' }}>No se encontraron solicitudes</div>
                ) : (
                    <table className="solicitudes-table" style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Usuario</th>
                                <th style={styles.tableHeader}>Email</th>
                                <th style={styles.tableHeader}>Nivel</th>
                                <th style={styles.tableHeader}>Cargo</th>
                                <th style={styles.tableHeader}>País</th>
                                <th style={styles.tableHeader}>Estado</th>
                                <th style={styles.tableHeader}>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map((solicitud) => {
                                const badge = getEstadoBadge(solicitud.fundacion?.estadoAprobacion);
                                return (
                                    <tr
                                        key={solicitud._id}
                                        style={styles.tableRow}
                                        onMouseEnter={(e) => e.currentTarget.style.background = styles.tableRowHover.background}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ color: isDark ? '#E5E7EB' : '#555' }}>
                                            {solicitud.nombres?.primero} {solicitud.apellidos?.primero}
                                        </td>
                                        <td style={{ color: isDark ? '#E5E7EB' : '#555' }}>{solicitud.email}</td>
                                        <td className="capitalize" style={{ color: isDark ? '#E5E7EB' : '#555' }}>{solicitud.fundacion?.nivel}</td>
                                        <td style={{ color: isDark ? '#E5E7EB' : '#555' }}>{solicitud.fundacion?.cargo}</td>
                                        <td style={{ color: isDark ? '#E5E7EB' : '#555' }}>{solicitud.fundacion?.territorio?.pais || '-'}</td>
                                        <td>
                                            <span style={badge.style}>
                                                {badge.text}
                                            </span>
                                        </td>
                                        <td style={{ color: isDark ? '#E5E7EB' : '#555' }}>
                                            {new Date(solicitud.fundacion?.fechaIngreso).toLocaleDateString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Paginación */}
            {pagination.pages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => cambiarPagina(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="btn-page"
                    >
                        <ChevronLeft size={18} />
                        Anterior
                    </button>
                    <span className="page-info">
                        Página {pagination.page} de {pagination.pages} ({pagination.total} total)
                    </span>
                    <button
                        onClick={() => cambiarPagina(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="btn-page"
                    >
                        Siguiente
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FounderMonitoringPanel;
