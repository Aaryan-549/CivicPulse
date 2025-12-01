import api from '../config/api';

export const workerService = {
  getAll: async (params = {}) => {
    const response = await api.get('/workers', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/workers/${id}`);
    return response.data;
  },

  create: async (workerData) => {
    const response = await api.post('/workers', workerData);
    return response.data;
  },

  update: async (id, workerData) => {
    const response = await api.put(`/workers/${id}`, workerData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/workers/${id}/status`, { status });
    return response.data;
  },

  getComplaints: async (id) => {
    const response = await api.get(`/workers/${id}/complaints`);
    return response.data;
  },
};
