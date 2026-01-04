// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Pagination
export const DEFAULT_QUERY_HISTORY_LIMIT = 10;
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_TABLE_DATA_LIMIT = 100;

// Database defaults
export const DEFAULT_DATABASE_PORT = 5432;

// Chart colors
export const CHART_COLORS = [
  '#6366f1',
  '#818cf8',
  '#22c55e',
  '#4ade80',
  '#4f46e5',
  '#a5b4fc',
  '#16a34a',
  '#86efac',
];

// Chart dimensions
export const CHART_HEIGHT = 400;

// Form validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_PORT: 1,
  MAX_PORT: 65535,
};

// Toast durations (ms)
export const TOAST_DURATION = 4000;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please log in again.',
  VALIDATION: {
    EMAIL_REQUIRED: 'Email address is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_TOO_SHORT: `Password must be at least ${6} characters`,
    DATABASE_NAME_REQUIRED: 'Database name is required',
    HOST_REQUIRED: 'Host is required',
    PORT_INVALID: 'Port must be between 1 and 65535',
    USERNAME_REQUIRED: 'Username is required',
    QUERY_REQUIRED: 'Please enter a query',
    DATABASE_SELECTION_REQUIRED: 'Please select a database',
  },
  API: {
    FETCH_DATABASES: 'Failed to fetch databases. Please try again.',
    FETCH_TABLES: 'Failed to fetch tables. Please try again.',
    FETCH_SCHEMA: 'Failed to fetch table schema. Please try again.',
    ADD_DATABASE: 'Failed to add database. Please check your configuration.',
    INDEX_DATABASE: 'Failed to index database. Please try again.',
    UPDATE_DESCRIPTION: 'Failed to update description. Please try again.',
    EXECUTE_QUERY: 'Query execution failed. Please check your query.',
    LOAD_HISTORY: 'Failed to load query history.',
    LOGIN: 'Login failed. Please check your credentials.',
    TOKEN_REFRESH: 'Session expired. Please log in again.',
  },
};

// Success messages
export const SUCCESS_MESSAGES = {
  DATABASE_ADDED: 'Database added successfully!',
  DESCRIPTION_UPDATED: 'Description updated successfully!',
  QUERY_EXECUTED: 'Query executed successfully!',
  LOGIN: 'Welcome back!',
};
