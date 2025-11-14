import api from './config';

const folderService = {
  // Obtener todas las carpetas del usuario
  getAllFolders: async (tipo = null) => {
    const params = tipo ? { tipo } : {};
    const response = await api.get('/folders', { params });
    return response.data;
  },

  // Obtener una carpeta específica
  getFolder: async (id) => {
    const response = await api.get(`/folders/${id}`);
    return response.data;
  },

  // Crear nueva carpeta
  createFolder: async (folderData) => {
    const response = await api.post('/folders', folderData);
    return response.data;
  },

  // Actualizar carpeta
  updateFolder: async (id, folderData) => {
    const response = await api.put(`/folders/${id}`, folderData);
    return response.data;
  },

  // Eliminar carpeta
  deleteFolder: async (id) => {
    const response = await api.delete(`/folders/${id}`);
    return response.data;
  },

  // Compartir carpeta con usuario
  shareFolder: async (id, userId, permisos = 'lectura') => {
    const response = await api.post(`/folders/${id}/share`, { userId, permisos });
    return response.data;
  },

  // Subir archivo a carpeta
  uploadFile: async (id, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('archivo', file);

    const response = await api.post(`/folders/${id}/archivos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  // Eliminar archivo de carpeta
  deleteFile: async (folderId, fileId) => {
    const response = await api.delete(`/folders/${folderId}/archivos/${fileId}`);
    return response.data;
  },

  // Descargar archivo
  downloadFile: async (folderId, fileId) => {
    const response = await api.get(`/folders/${folderId}/archivos/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default folderService;
