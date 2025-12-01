import api from '../config/api';

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getComplaints: async (id) => {
    const response = await api.get(`/users/${id}/complaints`);
    return response.data;
  },
};
