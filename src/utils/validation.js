import { VALIDATION, ERROR_MESSAGES } from '../config/constants';

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.EMAIL_REQUIRED };
  }
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.EMAIL_INVALID };
  }
  return { isValid: true, error: null };
}

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED };
  }
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT };
  }
  return { isValid: true, error: null };
}

/**
 * Validates login form data
 * @param {{ email: string, password: string }} formData
 * @returns {{ isValid: boolean, errors: { email?: string, password?: string } }}
 */
export function validateLoginForm(formData) {
  const errors = {};

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates database configuration form
 * @param {object} config - Database configuration
 * @returns {{ isValid: boolean, errors: object }}
 */
export function validateDatabaseConfig(config) {
  const errors = {};

  if (!config.databaseName || !config.databaseName.trim()) {
    errors.databaseName = ERROR_MESSAGES.VALIDATION.DATABASE_NAME_REQUIRED;
  }

  if (!config.host || !config.host.trim()) {
    errors.host = ERROR_MESSAGES.VALIDATION.HOST_REQUIRED;
  }

  const port = parseInt(config.port, 10);
  if (isNaN(port) || port < VALIDATION.MIN_PORT || port > VALIDATION.MAX_PORT) {
    errors.port = ERROR_MESSAGES.VALIDATION.PORT_INVALID;
  }

  if (!config.username || !config.username.trim()) {
    errors.username = ERROR_MESSAGES.VALIDATION.USERNAME_REQUIRED;
  }

  if (!config.password) {
    errors.password = ERROR_MESSAGES.VALIDATION.PASSWORD_REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates query form
 * @param {{ query: string, databaseId: string }} data
 * @returns {{ isValid: boolean, errors: object }}
 */
export function validateQueryForm(data) {
  const errors = {};

  if (!data.databaseId) {
    errors.databaseId = ERROR_MESSAGES.VALIDATION.DATABASE_SELECTION_REQUIRED;
  }

  if (!data.query || !data.query.trim()) {
    errors.query = ERROR_MESSAGES.VALIDATION.QUERY_REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Gets the first error message from an errors object
 * @param {object} errors
 * @returns {string | null}
 */
export function getFirstError(errors) {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
}
