export default function MedicamentoTabla({ medicamentos, puedeEditar, puedeEliminar, onEditar, onEliminar }) {
  if (medicamentos.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-10 text-center text-gray-500">
        No hay medicamentos registrados en esta farmacia todavía.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-emerald-100">
      <table className="min-w-full divide-y divide-emerald-100">
        <thead className="bg-emerald-100">
          <tr>
            {['ID', 'Medicamento', 'Laboratorio', 'Stock', 'Precio Unit.', 'Acciones'].map((titulo) => (
              <th key={titulo} className="px-6 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                {titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-emerald-50">
          {medicamentos.map((med) => (
            <tr key={med.CodMedicamento} className="hover:bg-emerald-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{med.CodMedicamento}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{med.descripcionMed}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {med.Laboratorio ? med.Laboratorio.razonSocial : 'Sin asignar'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${med.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {med.stock}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-700 font-semibold">S/ {med.precioVentaUni}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                {puedeEditar ? (
                  <button onClick={() => onEditar(med)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition">
                    Editar
                  </button>
                ) : null}
                {puedeEliminar ? (
                  <button onClick={() => onEliminar(med)}
                    className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition">
                    Eliminar
                  </button>
                ) : null}
                {!puedeEditar && !puedeEliminar ? <span className="text-gray-400 text-xs">Solo lectura</span> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
