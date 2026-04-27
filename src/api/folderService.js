import api from './config';

const folderService = {
  /**
   * Obtener estructura de jerarquía (Areas, Cargos, Niveles)
   */
  getHierarchy: async () => {
    const response = await api.get('/folders/jerarquia');
    return response.data;
  },

  /**
   * Obtener todas las carpetas con filtros opcionales
   * @param {Object} params - Filtros: tipo, area, cargo, pais, etc.
   */
  getAllFolders: async (params = {}) => {
    // Si params es string (legacy), lo convertimos a objeto
    const queryParams = typeof params === 'string' ? { tipo: params } : params;

    const response = await api.get('/folders', { params: queryParams });
    return response.data;
  },

  /**
   * Obtener una carpeta por ID
   */
  getFolderById: async (id) => {
    const response = await api.get(`/folders/${id}`);
    return response.data;
  },

  /**
   * Crear una nueva carpeta
   * @param {Object} folderData
   */
  createFolder: async (folderData) => {
    const response = await api.post('/folders', folderData);
    return response.data;
  },

  /**
   * Actualizar una carpeta
   */
  updateFolder: async (id, folderData) => {
    const response = await api.put(`/folders/${id}`, folderData);
    return response.data;
  },

  /**
   * Eliminar una carpeta
   */
  deleteFolder: async (id) => {
    const response = await api.delete(`/folders/${id}`);
    return response.data;
  },

  /**
   * Compartir carpeta con un usuario
   */
  shareFolder: async (id, data) => {
    const response = await api.post(`/folders/${id}/share`, data);
    return response.data;
  },

  /**
   * Compartir carpeta masivamente
   * @param {string} id - ID de la carpeta
   * @param {Object} data - { usuarios: [], permisos: string }
   */
  shareFolderBulk: async (id, data) => {
    const response = await api.post(`/folders/${id}/share/bulk`, data);
    return response.data;
  },

  /**
   * Subir archivo a una carpeta
   */
  uploadFile: async (id, file) => {
    const formData = new FormData();
    formData.append('archivo', file);

    const response = await api.post(`/folders/${id}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Eliminar archivo de una carpeta
   */
  deleteFile: async (folderId, fileId) => {
    const response = await api.delete(`/folders/${folderId}/files/${fileId}`);
    return response.data;
  },

  /**
   * Salir de una carpeta compartida
   */
  leaveFolder: async (id) => {
    const response = await api.post(`/folders/${id}/leave`);
    return response.data;
  },

  /**
   * Descargar archivo (vía proxy del servidor para asegurar Content-Disposition)
   * @param {string} folderId 
   * @param {Object} file - Objeto archivo completo
   */
  downloadFile: async (folderId, file) => {
    try {
      const response = await api.get(`/folders/${folderId}/files/${file._id}/download`, {
        responseType: 'blob'
      });
      
      // Crear un link temporal para la descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalName);
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      throw error;
    }
  }
};

export default folderService;


