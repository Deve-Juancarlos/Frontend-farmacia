import { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { mensajeDeError } from '../../services/api';
import {
  listarMedicamentos,
  listarLaboratorios,
  eliminarMedicamento,
} from '../../services/medicamentoService';
import { AuthContext } from '../../context/authContext';
import Navbar from '../layout/Navbar';
import MedicamentoTabla from './MedicamentoTabla';
import MedicamentoFormModal from './MedicamentoFormModal';
import StatCard from './StatCard';
import TableSkeleton from './TableSkeleton';
import BusquedaMedicamentos from './BusquedaMedicamentos';
import EstadoVacio from './EstadoVacio';
import {
  PackageIcon,
  PlusIcon,
  BeakerIcon,
  ChartIcon,
  AlertIcon,
} from '../icons/DashboardIcons';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [medicamentos, setMedicamentos] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState({ abierto: false, modo: 'crear', item: null });

  const puedeEditar = user?.rol === 'administrador' || user?.rol === 'moderador';
  const puedeEliminar = user?.rol === 'administrador';

  const cargar = useCallback(async () => {
    try {
      const data = await listarMedicamentos();
      setMedicamentos(data);
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
        const [meds, labsData] = await Promise.all([
          listarMedicamentos(),
          listarLaboratorios(),
        ]);
        if (activo) {
          setMedicamentos(meds);
          setLabs(labsData);
        }
      } catch (err) {
        if (activo) setError(mensajeDeError(err));
      } finally {
        if (activo) setLoading(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  const medicamentosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return medicamentos;
    const term = searchTerm.toLowerCase();
    return medicamentos.filter(
      (m) =>
        m.descripcionMed?.toLowerCase().includes(term) ||
        m.CodMedicamento?.toString().includes(term)
    );
  }, [medicamentos, searchTerm]);

  const stats = useMemo(() => {
    const conLaboratorio = new Set(
      medicamentos.filter((m) => m.CodLab).map((m) => m.CodLab)
    ).size;
    const stockBajo = medicamentos.filter((m) => m.stock <= 10).length;
    return { total: medicamentos.length, conLaboratorio, stockBajo };
  }, [medicamentos]);

  const abrirCrear = () => setModal({ abierto: true, modo: 'crear', item: null });
  const abrirEditar = (item) => setModal({ abierto: true, modo: 'editar', item });
  const cerrarModal = () => setModal({ abierto: false, modo: 'crear', item: null });

  const eliminar = async (item) => {
    if (!window.confirm(`¿Eliminar "${item.descripcionMed}"? Esta acción no se puede deshacer.`)) return;
    try {
      await eliminarMedicamento(item.CodMedicamento);
      await cargar();
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <Navbar />

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-200">
              <PackageIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                Inventario de Medicamentos
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Gestiona el catálogo de productos farmacéuticos
              </p>
            </div>
          </div>

          {puedeEditar && (
            <button
              onClick={abrirCrear}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-200 font-semibold shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300"
            >
              <PlusIcon className="h-5 w-5" />
              Nuevo medicamento
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3" role="alert">
            <AlertIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 text-sm font-medium">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-xs text-red-600 hover:text-red-800 mt-1 underline"
              >
                Descartar
              </button>
            </div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<PackageIcon className="h-6 w-6" />}
              label="Total Medicamentos"
              value={stats.total}
              color="emerald"
            />
            <StatCard
              icon={<BeakerIcon className="h-6 w-6" />}
              label="Con Laboratorio"
              value={stats.conLaboratorio}
              color="blue"
            />
            <StatCard
              icon={<ChartIcon className="h-6 w-6" />}
              label="Catálogo Labs"
              value={labs.length}
              color="purple"
            />
            <StatCard
              icon={<AlertIcon className="h-6 w-6" />}
              label="Stock Bajo"
              value={stats.stockBajo}
              color="amber"
            />
          </div>
        )}

        {!loading && medicamentos.length > 0 && (
          <BusquedaMedicamentos
            valor={searchTerm}
            onCambiar={setSearchTerm}
            cantidad={medicamentosFiltrados.length}
          />
        )}

        {loading ? (
          <TableSkeleton />
        ) : medicamentos.length === 0 ? (
          <EstadoVacio tipo="sin-datos" puedeEditar={puedeEditar} onCrear={abrirCrear} />
        ) : medicamentosFiltrados.length === 0 ? (
          <EstadoVacio tipo="sin-resultados" termino={searchTerm} />
        ) : (
          <MedicamentoTabla
            medicamentos={medicamentosFiltrados}
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
          onGuardado={async () => {
            cerrarModal();
            await cargar();
          }}
        />
      )}
    </div>
  );
}
