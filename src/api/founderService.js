import api from './config';

/**
 * Servicio para gestión de usuarios (solo Founder)
 */

// Obtener todos los usuarios con filtros
export const getAllUsers = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.rol) params.append('rol', filters.rol);
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.verificado !== undefined) params.append('verificado', filters.verificado);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/founder/users?${params.toString()}`);
    return response.data;
};

// Crear usuario con rol específico
export const createUserWithRole = async (userData) => {
    const response = await api.post('/founder/users', userData);
    return response.data;
};

// Obtener usuario por ID
export const getUserById = async (userId) => {
    const response = await api.get(`/founder/users/${userId}`);
    return response.data;
};

// Actualizar rol de usuario
export const updateUserRole = async (userId, roleData) => {
    const response = await api.put(`/founder/users/${userId}/role`, roleData);
    return response.data;
};

// Eliminar usuario
export const deleteUser = async (userId) => {
    const response = await api.delete(`/founder/users/${userId}`);
    return response.data;
};

// Enviar alerta de seguridad
export const sendSecurityAlert = async (data) => {
    try {
        await api.post('/founder/security-alert', data);
    } catch (error) {
        console.error('Security alert failed:', error);
    }
};

export default {
    getAllUsers,
    createUserWithRole,
    getUserById,
    updateUserRole,
    deleteUser,
    sendSecurityAlert
};
