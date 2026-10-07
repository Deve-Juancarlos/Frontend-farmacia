import { EmptyBoxIcon, SearchIcon, PlusIcon } from '../icons/DashboardIcons';

export default function EstadoVacio({ tipo, termino, puedeEditar, onCrear }) {
  const esSinResultados = tipo === 'sin-resultados';
  const Icono = esSinResultados ? SearchIcon : EmptyBoxIcon;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
        esSinResultados ? 'bg-gray-50' : 'bg-emerald-50'
      }`}>
        <Icono className={`h-10 w-10 ${esSinResultados ? 'text-gray-400' : 'text-emerald-400'}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {esSinResultados ? 'Sin resultados' : 'No hay medicamentos registrados'}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {esSinResultados
          ? `No se encontraron medicamentos que coincidan con "${termino}"`
          : 'Comienza agregando tu primer medicamento al inventario para gestionar el stock de la farmacia.'}
      </p>
      {!esSinResultados && puedeEditar && (
        <button
          onClick={onCrear}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition font-semibold shadow-md"
        >
          <PlusIcon className="h-5 w-5" />
          Agregar primer medicamento
        </button>
      )}
    </div>
  );
}
