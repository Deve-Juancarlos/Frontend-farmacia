export const estadoInicial = {
  descripcionMed: '',
  Presentacion: '',
  Marca: '',
  stock: '',
  precioVentaUni: '',
  precioVentaPres: '',
  fechaFabricacion: '',
  fechaVencimiento: '',
  CodLab: '',
};

export const soloFecha = (valor) => (valor ? String(valor).slice(0, 10) : '');

export const valoresDe = (item, modo) => (modo === 'editar' && item ? {
  descripcionMed: item.descripcionMed || '',
  Presentacion: item.Presentacion || '',
  Marca: item.Marca || '',
  stock: item.stock ?? '',
  precioVentaUni: item.precioVentaUni ?? '',
  precioVentaPres: item.precioVentaPres ?? '',
  fechaFabricacion: soloFecha(item.fechaFabricacion),
  fechaVencimiento: soloFecha(item.fechaVencimiento),
  CodLab: item.CodLab ?? '',
} : estadoInicial);

// Normaliza el formulario al contrato del backend (null para quitar laboratorio).
export const construirPayload = (form) => {
  const payload = {
    descripcionMed: form.descripcionMed.trim(),
    Presentacion: form.Presentacion.trim(),
    Marca: form.Marca.trim(),
    stock: Number(form.stock),
    precioVentaUni: Number(form.precioVentaUni),
  };
  if (form.precioVentaPres !== '') payload.precioVentaPres = Number(form.precioVentaPres);
  if (form.fechaFabricacion) payload.fechaFabricacion = form.fechaFabricacion;
  if (form.fechaVencimiento) payload.fechaVencimiento = form.fechaVencimiento;
  payload.CodLab = form.CodLab === '' ? null : Number(form.CodLab);
  return payload;
};

export const validarFormulario = (form) => {
  if (form.descripcionMed.trim().length < 3) return 'La descripción debe tener al menos 3 caracteres.';
  if (form.stock === '' || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
    return 'El stock debe ser un número entero mayor o igual a 0.';
  }
  if (form.precioVentaUni === '' || Number(form.precioVentaUni) < 0) {
    return 'El precio unitario debe ser un número mayor o igual a 0.';
  }
  if (form.fechaFabricacion && form.fechaVencimiento && form.fechaVencimiento < form.fechaFabricacion) {
    return 'La fecha de vencimiento debe ser posterior a la de fabricación.';
  }
  return null;
};
