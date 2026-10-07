import api from './api';

// Punto único de acceso a los endpoints de autenticación.
// Los componentes no deben conocer las rutas ni la forma de la respuesta.
export const registrar = (payload) =>
  api.post('/api/auth/registro', payload).then((res) => res.data);

export const iniciarSesion = (credenciales) =>
  api.post('/api/auth/login', credenciales).then((res) => res.data);
