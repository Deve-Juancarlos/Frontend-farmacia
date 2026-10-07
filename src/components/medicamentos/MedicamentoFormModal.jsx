import { useState } from 'react';
import api, { mensajeDeError } from '../../services/api';

const estadoInicial = {
  descripcionMed: '',
  Presentacion: '',
  Marca: '',
  stock: '',
  precioVentaUni: '',
  precioVentaPres: '',
  fechaFabricacion: '',
  fechaVencimiento: '',
};

const soloFecha = (valor) => (valor ? String(valor).slice(0, 10) : '');

// El componente se monta con una key distinta al abrir, por lo que basta
// con inicializar el formulario aquí (sin efectos).
const valoresDe = (item, modo) => (modo === 'editar' && item ? {
  descripcionMed: item.descripcionMed || '',
  Presentacion: item.Presentacion || '',
  Marca: item.Marca || '',
  stock: item.stock ?? '',
  precioVentaUni: item.precioVentaUni ?? '',
  precioVentaPres: item.precioVentaPres ?? '',
  fechaFabricacion: soloFecha(item.fechaFabricacion),
  fechaVencimiento: soloFecha(item.fechaVencimiento),
} : estadoInicial);

const inputClass =
  'mt-1 block w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition';

export default function MedicamentoFormModal({ modo, item, onCerrar, onGuardado }) {
  const [form, setForm] = useState(() => valoresDe(item, modo));
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validar = () => {
    if (form.descripcionMed.trim().length < 3) return 'La descripción debe tener al menos 3 caracteres.';
    if (form.stock === '' || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
      return 'El stock debe ser un entero mayor o igual a 0.';
    }
    if (form.precioVentaUni === '' || Number(form.precioVentaUni) < 0) {
      return 'El precio unitario debe ser un número mayor o igual a 0.';
    }
    if (form.fechaFabricacion && form.fechaVencimiento && form.fechaVencimiento < form.fechaFabricacion) {
      return 'La fecha de vencimiento debe ser posterior a la de fabricación.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorValidacion = validar();
    if (errorValidacion) return setError(errorValidacion);

    setGuardando(true);
    try {
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

      if (modo === 'editar') {
        await api.put(`/api/medicamentos/${item.CodMedicamento}`, payload);
      } else {
        await api.post('/api/medicamentos', payload);
      }
      onGuardado();
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100">
          <h3 className="text-lg font-bold text-emerald-800">
            {modo === 'editar' ? 'Editar medicamento' : 'Nuevo medicamento'}
          </h3>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 text-2xl leading-none" aria-label="Cerrar">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200" role="alert">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700">Descripción *</label>
            <input name="descripcionMed" type="text" className={inputClass}
              value={form.descripcionMed} onChange={handleChange} placeholder="Ej: Paracetamol 500mg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Presentación</label>
              <input name="Presentacion" type="text" className={inputClass}
                value={form.Presentacion} onChange={handleChange} placeholder="Caja x 20" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Marca</label>
              <input name="Marca" type="text" className={inputClass}
                value={form.Marca} onChange={handleChange} placeholder="Tylenol" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Stock *</label>
              <input name="stock" type="number" min="0" className={inputClass}
                value={form.stock} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">P. Unidad *</label>
              <input name="precioVentaUni" type="number" min="0" step="0.01" className={inputClass}
                value={form.precioVentaUni} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">P. Present.</label>
              <input name="precioVentaPres" type="number" min="0" step="0.01" className={inputClass}
                value={form.precioVentaPres} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">F. Fabricación</label>
              <input name="fechaFabricacion" type="date" className={inputClass}
                value={form.fechaFabricacion} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">F. Vencimiento</label>
              <input name="fechaVencimiento" type="date" className={inputClass}
                value={form.fechaVencimiento} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCerrar}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium">
              Cancelar
            </button>
            <button type="submit" disabled={guardando}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-70 transition font-semibold">
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
