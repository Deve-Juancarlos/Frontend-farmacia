import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-emerald-700 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">💊</span>
        <h1 className="text-xl font-bold">Farmacia El Ahorro</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium bg-emerald-800 px-3 py-1 rounded-full">Hola, {user?.username} ({user?.rol})</span>
        
        {user?.rol === 'administrador' && (
          <button className="bg-amber-500 px-3 py-1 rounded-full text-sm hover:bg-amber-600 transition font-medium">Panel Admin</button>
        )}
        {user?.rol === 'moderador' && (
          <button className="bg-purple-500 px-3 py-1 rounded-full text-sm hover:bg-purple-600 transition font-medium">Moderar</button>
        )}
        
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded-full text-sm hover:bg-red-600 transition font-medium">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}