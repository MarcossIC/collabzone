export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized: Please log in again.',
  FORBIDDEN: 'Forbidden: You do not have permission to access this resource.',
  NOT_FOUND: 'Not Found: The requested resource does not exist.',
  SERVER_ERROR: 'Server error: Please try again later.',
  GENERIC_ERROR: 'An error occurred.',
  NETWORK_ERROR: 'Network Error: No response received from server.',
  REQUEST_ERROR: message => `Request error: ${message}`,
  INTERNAL_SERVER_ERROR: 'Internal server error',
  REDIRECT_SIGNIN: 'Redirecting to sign in page...',
};
