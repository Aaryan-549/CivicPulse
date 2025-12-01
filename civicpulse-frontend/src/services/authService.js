import api from '../config/api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/admin/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('adminToken', response.data.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.data.admin));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
};
