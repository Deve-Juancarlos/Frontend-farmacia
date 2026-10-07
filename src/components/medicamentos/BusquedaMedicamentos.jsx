import { SearchIcon, CloseIcon } from '../icons/DashboardIcons';

export default function BusquedaMedicamentos({ valor, onCambiar, cantidad }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por código o descripción..."
          value={valor}
          onChange={(e) => onCambiar(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 shadow-sm"
        />
        {valor && (
          <button
            onClick={() => onCambiar('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Limpiar búsqueda"
          >
            <CloseIcon />
          </button>
        )}
      </div>
      {valor && (
        <p className="text-sm text-gray-500 mt-2">
          {cantidad} resultado{cantidad !== 1 ? 's' : ''} encontrado{cantidad !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
