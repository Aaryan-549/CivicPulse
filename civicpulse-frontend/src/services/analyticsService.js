import api from '../config/api';

export const analyticsService = {
  getHeatmapData: async (params = {}) => {
    const response = await api.get('/analytics/heatmap', { params });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getTrends: async (days = 30) => {
    const response = await api.get('/analytics/trends', { params: { days } });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/analytics/categories');
    return response.data;
  },
};
