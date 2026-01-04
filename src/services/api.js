import axios from 'axios';
import {
  API_BASE_URL,
  DEFAULT_PAGE_SIZE,
  DEFAULT_TABLE_DATA_LIMIT,
  DEFAULT_QUERY_HISTORY_LIMIT,
  ERROR_MESSAGES,
} from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
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

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 errors and if we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      // If no refresh token, redirect to login
      if (!refreshToken) {
        clearAuthAndRedirect();
        return Promise.reject(new Error(ERROR_MESSAGES.UNAUTHORIZED));
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Store new tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect
        clearAuthAndRedirect();

        // Return a more descriptive error
        const errorMessage =
          refreshError.response?.data?.error || ERROR_MESSAGES.API.TOKEN_REFRESH;
        return Promise.reject(new Error(errorMessage));
      }
    }

    // For non-401 errors or already retried requests, reject with original error
    return Promise.reject(error);
  }
);

/**
 * Clears authentication data and redirects to login
 */
function clearAuthAndRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  // Only redirect if not already on login page
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
}

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
  getTableData: (databaseName, tableName, limit = DEFAULT_TABLE_DATA_LIMIT, offset = 0) =>
    api.get(`/databases/${databaseName}/tables/${tableName}/data`, {
      params: { limit, offset },
    }),
  indexDatabase: (databaseName) => api.post(`/databases/${databaseName}/index`),
};

export const queryAPI = {
  executeQuery: (query, databaseConfigId) =>
    api.post('/query/execute', { query, databaseConfigId: parseInt(databaseConfigId, 10) }),
  getQueryHistory: (limit = DEFAULT_QUERY_HISTORY_LIMIT, offset = 0) =>
    api.get('/query/history', { params: { limit, offset } }),
};

export default api;
