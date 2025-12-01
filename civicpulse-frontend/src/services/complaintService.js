import api from '../config/api';

export const complaintService = {
  getAll: async (params = {}) => {
    const response = await api.get('/complaints', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  assignWorker: async (id, workerId) => {
    const response = await api.put(`/complaints/${id}/assign`, { workerId });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/complaints/${id}/status`, { status });
    return response.data;
  },

  reject: async (id, reason) => {
    const response = await api.post(`/complaints/${id}/reject`, { reason });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/complaints/stats');
    return response.data;
  },

  getByCategory: async (category) => {
    const response = await api.get(`/complaints/category/${category}`);
    return response.data;
  },
};
