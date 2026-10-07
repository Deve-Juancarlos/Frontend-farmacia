import { useCallback, useContext, useEffect, useState } from 'react';
import api, { mensajeDeError } from '../../services/api';
import { AuthContext } from '../../context/authContext';
import Navbar from '../layout/Navbar';
import MedicamentoTabla from './MedicamentoTabla';
import MedicamentoFormModal from './MedicamentoFormModal';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [medicamentos, setMedicamentos] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ abierto: false, modo: 'crear', item: null });

  const puedeEditar = user?.rol === 'administrador' || user?.rol === 'moderador';
  const puedeEliminar = user?.rol === 'administrador';

  const cargar = useCallback(async () => {
    try {
      const res = await api.get('/api/medicamentos');
      setMedicamentos(res.data);
      setError('');
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const [resMeds, resLabs] = await Promise.all([
          api.get('/api/medicamentos'),
          api.get('/api/laboratorios'),
        ]);
        if (activo) {
          setMedicamentos(resMeds.data);
          setLabs(resLabs.data);
        }
      } catch (err) {
        if (activo) setError(mensajeDeError(err));
      } finally {
        if (activo) setLoading(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  const abrirCrear = () => setModal({ abierto: true, modo: 'crear', item: null });
  const abrirEditar = (item) => setModal({ abierto: true, modo: 'editar', item });
  const cerrarModal = () => setModal({ abierto: false, modo: 'crear', item: null });

  const eliminar = async (item) => {
    if (!window.confirm(`¿Eliminar "${item.descripcionMed}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/api/medicamentos/${item.CodMedicamento}`);
      await cargar();
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <Navbar />
      <main className="p-8 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📦</span>
            <h2 className="text-2xl font-bold text-emerald-800">Inventario de Medicamentos</h2>
          </div>
          {puedeEditar && (
            <button onClick={abrirCrear}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-semibold shadow-md">
              + Nuevo medicamento
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200" role="alert">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center text-emerald-700 font-medium py-10">Cargando datos...</div>
        ) : (
          <MedicamentoTabla
            medicamentos={medicamentos}
            puedeEditar={puedeEditar}
            puedeEliminar={puedeEliminar}
            onEditar={abrirEditar}
            onEliminar={eliminar}
          />
        )}
      </main>

      {modal.abierto && (
        <MedicamentoFormModal
          key={`${modal.modo}-${modal.item?.CodMedicamento ?? 'nuevo'}`}
          modo={modal.modo}
          item={modal.item}
          labs={labs}
          onCerrar={cerrarModal}
          onGuardado={async () => { cerrarModal(); await cargar(); }}
        />
      )}
    </div>
  );
}
