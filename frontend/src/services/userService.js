import api from './api';

export const userService = {
  // Получить всех пользователей
  async getUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Ошибка при получении пользователей');
    }
  },

  // Получить пользователя по ID
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Ошибка при получении пользователя');
    }
  },

  // Создать пользователя
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Ошибка при создании пользователя');
    }
  },

  // Обновить пользователя
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Ошибка при обновлении пользователя');
    }
  },

  // Удалить пользователя
  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Ошибка при удалении пользователя');
    }
  }
};