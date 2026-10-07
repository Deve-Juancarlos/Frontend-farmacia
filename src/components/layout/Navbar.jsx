import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import logoFarmacia from '../../assets/logo-farmacia.png';

const COLORES_ROL = {
  administrador: 'bg-amber-500',
  moderador: 'bg-purple-500',
  usuario: 'bg-emerald-800',
};

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-emerald-700 text-white px-4 py-3 flex flex-wrap justify-between items-center gap-3 shadow-md">
      <div className="flex items-center space-x-3">
        <img
          src={logoFarmacia}
          alt="Logo Farmacia"
          className="h-10 w-auto object-contain bg-white/10 rounded-lg p-1"
        />
        <h1 className="text-xl font-bold hidden sm:block">Farmacia El Ahorro</h1>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${COLORES_ROL[user?.rol] || 'bg-emerald-800'}`}>
          {user?.username} · {user?.rol}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded-full text-sm hover:bg-red-600 transition font-medium"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}
