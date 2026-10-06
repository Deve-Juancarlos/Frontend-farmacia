import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/medicamentos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMedicamentos(res.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-700 font-medium">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-emerald-50">
      <Navbar />
      <main className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-3xl">📦</span>
          <h2 className="text-2xl font-bold text-emerald-800">Inventario de Medicamentos</h2>
        </div>
        
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-emerald-100">
          <table className="min-w-full divide-y divide-emerald-100">
            <thead className="bg-emerald-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Medicamento</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Laboratorio</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Precio Unit.</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}