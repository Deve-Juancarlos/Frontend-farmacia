import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Adjunta el token guardado (localStorage o sessionStorage) a cada petición.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si la sesión expira (401), limpia y vuelve al login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/api/auth/login')) {
      ['token', 'user'].forEach((clave) => {
        localStorage.removeItem(clave);
        sessionStorage.removeItem(clave);
      });
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Extrae un mensaje de error legible de una respuesta de la API.
export function mensajeDeError(error) {
  const data = error.response?.data;
  if (data?.detalles?.length) return data.detalles.join(' · ');
  if (data?.error) return data.error;
  return 'Error de conexión con el servidor. Intente nuevamente.';
}

export default api;
