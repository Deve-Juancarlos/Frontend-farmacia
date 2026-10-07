import { useState } from 'react';
import { mensajeDeError } from '../../services/api';
import { crearMedicamento, actualizarMedicamento } from '../../services/medicamentoService';
import { valoresDe, construirPayload, validarFormulario } from './medicamentoForm';
import CampoFormulario from './CampoFormulario';
import { PackageIcon, BeakerIcon, CloseIcon } from '../icons/DashboardIcons';
import {
  PillIcon,
  TagIcon,
  HashIcon,
  CurrencyIcon,
  CalendarIcon,
  SpinnerIcon,
} from '../icons/FormIcons';

const inputClass =
  'mt-1 block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 sm:text-sm';
const selectClass =
  'mt-1 block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 sm:text-sm appearance-none';
const icono = 'h-5 w-5 text-gray-400';

const ChevronDown = () => (
  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default function MedicamentoFormModal({ modo, item, labs = [], onCerrar, onGuardado }) {
  const [form, setForm] = useState(() => valoresDe(item, modo));
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorValidacion = validarFormulario(form);
    if (errorValidacion) return setError(errorValidacion);

    setGuardando(true);
    try {
      const payload = construirPayload(form);
      if (modo === 'editar') {
        await actualizarMedicamento(item.CodMedicamento, payload);
      } else {
        await crearMedicamento(payload);
      }
      onGuardado();
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <PillIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {modo === 'editar' ? 'Editar medicamento' : 'Registrar nuevo medicamento'}
            </h3>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200" role="alert">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <section className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Información Básica</h4>

            <CampoFormulario label="Descripción del medicamento" requerido icon={<PillIcon className={icono} />}>
              <input name="descripcionMed" type="text" className={inputClass} required
                value={form.descripcionMed} onChange={handleChange} placeholder="Ej: Paracetamol 500mg" />
            </CampoFormulario>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CampoFormulario label="Marca" icon={<TagIcon className={icono} />}>
                <input name="Marca" type="text" className={inputClass}
                  value={form.Marca} onChange={handleChange} placeholder="Ej: Tylenol" />
              </CampoFormulario>
              <CampoFormulario label="Presentación" icon={<PackageIcon className={icono} />}>
                <input name="Presentacion" type="text" className={inputClass}
                  value={form.Presentacion} onChange={handleChange} placeholder="Ej: Caja x 20 tabletas" />
              </CampoFormulario>
            </div>

            <CampoFormulario label="Laboratorio" icon={<BeakerIcon className={icono} />} trailing={<ChevronDown />}>
              <select name="CodLab" className={selectClass} value={form.CodLab} onChange={handleChange}>
                <option value="">Sin asignar</option>
                {labs.map((lab) => (
                  <option key={lab.CodLab} value={lab.CodLab}>{lab.razonSocial}</option>
                ))}
              </select>
            </CampoFormulario>
          </section>

          <hr className="border-gray-100" />

          <section className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inventario y Precios</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CampoFormulario label="Stock" requerido icon={<HashIcon className={icono} />}>
                <input name="stock" type="number" min="0" step="1" className={inputClass} required
                  value={form.stock} onChange={handleChange} placeholder="0" />
              </CampoFormulario>
              <CampoFormulario label="P. Unidad" requerido icon={<CurrencyIcon className={icono} />}>
                <input name="precioVentaUni" type="number" min="0" step="0.01" className={inputClass} required
                  value={form.precioVentaUni} onChange={handleChange} placeholder="0.00" />
              </CampoFormulario>
              <CampoFormulario label="P. Presentación" icon={<CurrencyIcon className={icono} />}>
                <input name="precioVentaPres" type="number" min="0" step="0.01" className={inputClass}
                  value={form.precioVentaPres} onChange={handleChange} placeholder="0.00" />
              </CampoFormulario>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fechas de Control</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CampoFormulario label="F. Fabricación" icon={<CalendarIcon className={icono} />}>
                <input name="fechaFabricacion" type="date" className={inputClass}
                  value={form.fechaFabricacion} onChange={handleChange} />
              </CampoFormulario>
              <CampoFormulario label="F. Vencimiento" icon={<CalendarIcon className={icono} />}>
                <input name="fechaVencimiento" type="date" className={inputClass}
                  value={form.fechaVencimiento} onChange={handleChange} />
              </CampoFormulario>
            </div>
          </section>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCerrar}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={guardando}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm shadow-md shadow-emerald-200">
              {guardando ? (<><SpinnerIcon className="h-4 w-4" />Guardando...</>) : ('Guardar Medicamento')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
