import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim()) return setError('El usuario es obligatorio');
    if (!formData.password.trim()) return setError('La contraseña es obligatoria');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/login`, formData);
      login(res.data.usuario, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-emerald-100">
        <div className="flex justify-center mb-4">
          <div className="bg-emerald-600 text-white rounded-full p-3 text-2xl">💊</div>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center text-emerald-700">Farmacia</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Sistema de Gestión</p>
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" className="mt-1 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white p-2.5 rounded-lg hover:bg-emerald-700 transition font-medium shadow-md">Iniciar Sesión</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta? <Link to="/registro" className="text-emerald-600 hover:underline font-medium">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}