import api from './api';

// Centraliza las rutas del recurso medicamentos y su catálogo asociado.
const base = '/api/medicamentos';

export const listarMedicamentos = () =>
  api.get(base).then((res) => res.data);

export const crearMedicamento = (payload) =>
  api.post(base, payload).then((res) => res.data);

export const actualizarMedicamento = (id, payload) =>
  api.put(`${base}/${id}`, payload).then((res) => res.data);

export const eliminarMedicamento = (id) =>
  api.delete(`${base}/${id}`).then((res) => res.data);

export const listarLaboratorios = () =>
  api.get('/api/laboratorios').then((res) => res.data);
