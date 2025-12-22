import api from './config';

const notificationService = {
  /**
   * Get all notifications for current user
   * @returns {Promise<Array>} Array of notifications
   */
  getAllNotifications: async () => {
    const response = await api.get('/notificaciones');
    return response.data;
  },

  /**
   * Get unread notifications
   * @returns {Promise<Array>} Array of unread notifications
   */
  getUnreadNotifications: async () => {
    const response = await api.get('/notificaciones/unread');
    return response.data;
  },

  /**
   * Get unread notification count
   * @returns {Promise<Object>} Object with count
   */
  getUnreadCount: async () => {
    const response = await api.get('/notificaciones/unread-count');
    return response.data;
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Response data
   */
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notificaciones/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} Response data
   */
  markAllAsRead: async () => {
    const response = await api.put('/notificaciones/mark-all-read');
    return response.data;
  },

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Response data
   */
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notificaciones/${notificationId}`);
    return response.data;
  },
};

export default notificationService;


