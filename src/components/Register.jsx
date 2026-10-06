import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', rol: 'usuario' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.username.length < 3) return setError('El usuario debe tener al menos 3 caracteres');
    if (formData.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/registro`, formData);
      setSuccess('Registro exitoso. Redirigiendo al login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-emerald-100">
        <div className="flex justify-center mb-4">
          <div className="bg-emerald-600 text-white rounded-full p-3 text-2xl">📋</div>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center text-emerald-700">Registro</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Crea tu cuenta de acceso</p>
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
        {success && <p className="text-emerald-600 text-sm mb-4 text-center bg-emerald-50 p-2 rounded-lg">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })}>
              <option value="usuario">Usuario</option>
              <option value="moderador">Moderador</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white p-2.5 rounded-lg hover:bg-emerald-700 transition font-medium shadow-md">Registrarse</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to="/" className="text-emerald-600 hover:underline font-medium">Volver al Login</Link>
        </p>
      </div>
    </div>
  );
}