import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mensajeDeError } from '../../services/api';
import { registrar } from '../../services/authService';
import logoFarmacia from '../../assets/logo-farmacia.png';

const estadoInicial = {
  username: '',
  password: '',
  confirmPassword: '',
  rol: 'usuario',
  crearFarmacia: false,
  nombreTenant: '',
};

export default function Register() {
  const [formData, setFormData] = useState(estadoInicial);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'crearFarmacia' && !checked ? { nombreTenant: '' } : {}),
    }));
    if (error) setError('');
  };

  const validar = () => {
    if (formData.username.trim().length < 3) return 'El usuario debe tener al menos 3 caracteres.';
    if (formData.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    if (formData.password !== formData.confirmPassword) return 'Las contraseñas no coinciden.';
    if (formData.crearFarmacia && formData.nombreTenant.trim().length < 3) {
      return 'El nombre de la farmacia debe tener al menos 3 caracteres.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errorValidacion = validar();
    if (errorValidacion) return setError(errorValidacion);

    setIsLoading(true);
    try {
      const payload = {
        username: formData.username.trim(),
        password: formData.password,
        rol: formData.rol,
      };
      if (formData.crearFarmacia) payload.nombreTenant = formData.nombreTenant.trim();

      await registrar(payload);
      setSuccess('Registro exitoso. Redirigiendo al login...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'mt-1 block w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-emerald-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-emerald-600 rounded-2xl p-3 shadow-lg shadow-emerald-200 mb-3">
            <img src={logoFarmacia} alt="Logo Farmacia" className="h-12 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Crear cuenta</h2>
          <p className="text-sm text-gray-500 mt-1">Sistema de Gestión Farmacéutica</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200" role="alert">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200" role="status">
            <p className="text-emerald-700 text-sm font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">Usuario</label>
            <input id="username" name="username" type="text" autoComplete="username"
              className={inputClass} placeholder="Su usuario" value={formData.username} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Contraseña</label>
            <input id="password" name="password" type="password" autoComplete="new-password"
              className={inputClass} placeholder="Mínimo 6 caracteres" value={formData.password} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">Confirmar contraseña</label>
            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
              className={inputClass} placeholder="Repita la contraseña" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="rol" className="block text-sm font-semibold text-gray-700">Rol</label>
            <select id="rol" name="rol" className={inputClass} value={formData.rol} onChange={handleChange}
              disabled={formData.crearFarmacia}>
              <option value="usuario">Usuario</option>
              <option value="moderador">Moderador</option>
            </select>
          </div>

          <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input id="crearFarmacia" name="crearFarmacia" type="checkbox"
                className="h-4 w-4 text-emerald-600 border-gray-300 rounded"
                checked={formData.crearFarmacia} onChange={handleChange} />
              Registrar mi propia farmacia
            </label>
            {formData.crearFarmacia && (
              <>
                <input id="nombreTenant" name="nombreTenant" type="text"
                  className={inputClass} placeholder="Nombre de la farmacia"
                  value={formData.nombreTenant} onChange={handleChange} />
                <p className="text-xs text-emerald-700 mt-1">
                  Serás el administrador de esta farmacia.
                </p>
              </>
            )}
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full bg-emerald-600 text-white p-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transition font-semibold shadow-md">
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          ¿Ya tiene cuenta?{' '}
          <Link to="/" className="text-emerald-600 hover:underline font-medium">Inicie sesión</Link>
        </p>
      </div>
    </div>
  );
}
