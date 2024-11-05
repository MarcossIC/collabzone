import axios from 'axios';
import Cookies from 'js-cookie';
import { ERROR_MESSAGES } from './errors';
import { API_URL } from './config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 199999,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    /*if (response.data?.token) {
      Cookies.set('token', response.data.token, {
        expires: 7, // Token expires in 7 days
        secure: import.meta.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
      });
    } */
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      //originalRequest._retry = true;
      Cookies.remove('token');
      localStorage.removeItem('AUTH');
      window.location.href = '/signin';
      console.error(ERROR_MESSAGES.UNAUTHORIZED);
      console.info(ERROR_MESSAGES.REDIRECT_SIGNIN);

      return Promise.reject(refreshError);
    } else if (error.response.status === 500) {
      console.error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }

    // Handle other errors
    let errorMessage = 'An error occurred';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = ERROR_MESSAGES.REQUEST_ERROR(error.message);
    }
    console.error('API Error:', errorMessage);

    return Promise.reject(error);
  }
);

const handleRequest = async request => {
  try {
    const response = await request();
    return [undefined, response.data];
  } catch (error) {
    return [handleError(error), undefined];
  }
};
const handleError = error => {
  if (error.response) {
    // El servidor respondió con un status diferente de 2xx
    const status = error.response.status;

    if (status === 401) {
      // No autorizado
      return { error: ERROR_MESSAGES.UNAUTHORIZED };
    } else if (status === 403) {
      // Prohibido
      return { error: ERROR_MESSAGES.FORBIDDEN };
    } else if (status === 404) {
      // No encontrado
      return { error: ERROR_MESSAGES.NOT_FOUND };
    } else if (status >= 500) {
      // Errores del servidor
      return { error: ERROR_MESSAGES.SERVER_ERROR };
    } else {
      // Otros errores
      return { error: error.response.data?.message || ERROR_MESSAGES.GENERIC_ERROR };
    }
  } else if (error.request) {
    // La solicitud fue hecha pero no hubo respuesta
    return { error: ERROR_MESSAGES.NETWORK_ERROR };
  } else {
    // Algo pasó al hacer la solicitud
    return { error: ERROR_MESSAGES.REQUEST_ERROR(error.message) };
  }
};

export const apiService = {
  async userLogin(credentials) {
    return handleRequest(() => api.post('/user/login', credentials));
  },
  async enterpriseLogin(credentials) {
    return handleRequest(() => api.post('/emp/login', credentials));
  },

  async get(url, config = {}) {
    return handleRequest(() => api.get(url, config));
  },

  async post(url, data, config = {}) {
    return handleRequest(() => api.post(url, data, config));
  },

  async put(url, data, config = {}) {
    return handleRequest(() => api.put(url, data, config));
  },

  async delete(url, config = {}) {
    return handleRequest(() => api.delete(url, config));
  },

  // notifications

  async unreadNotifications() {
    return handleRequest(() => api.get('/notifications/unread'));
  },

  async readNotification(notificationId) {
    return handleRequest(() =>
      api.put(`/notifications/${notificationId}`, { isRead: true })
    );
  },

  async acceptInvitation(token) {
    return handleRequest(() => api.put('/notifications/accept', { token }));
  },
};

export default api;
