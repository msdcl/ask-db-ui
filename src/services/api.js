import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, userType) =>
    api.post('/auth/register', { email, password, userType }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  getCurrentUser: () => api.get('/auth/me'),
};

export const databaseAPI = {
  getDatabases: () => api.get('/database-configs'),
  getTables: (databaseName) => api.get(`/databases/${databaseName}/tables`),
  getTableSchema: (databaseName, tableName) =>
    api.get(`/databases/${databaseName}/tables/${tableName}/schema`),
  getTableData: (databaseName, tableName, limit = 100, offset = 0) =>
    api.get(`/databases/${databaseName}/tables/${tableName}/data`, {
      params: { limit, offset },
    }),
  indexDatabase: (databaseName) => api.post(`/databases/${databaseName}/index`),
};

export const queryAPI = {
  executeQuery: (query, databaseConfigId) =>
    api.post('/query/execute', { query, databaseConfigId: parseInt(databaseConfigId) }),
  getQueryHistory: (limit = 20, offset = 0) =>
    api.get('/query/history', { params: { limit, offset } }),
};

export default api;
