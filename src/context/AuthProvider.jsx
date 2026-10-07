import { useState } from 'react';
import { AuthContext } from './authContext';

// Lee de localStorage (sesión recordada) o sessionStorage (sesión temporal).
const leerSesion = (clave) => localStorage.getItem(clave) || sessionStorage.getItem(clave);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => leerSesion('token'));
  const [user, setUser] = useState(() => {
    const guardado = leerSesion('user');
    if (!guardado) return null;
    try {
      return JSON.parse(guardado);
    } catch {
      return null;
    }
  });

  // recordar=true persiste la sesión; false la mantiene solo en la pestaña.
  const login = (userData, authToken, recordar = true) => {
    const destino = recordar ? localStorage : sessionStorage;
    const otro = recordar ? sessionStorage : localStorage;
    ['token', 'user'].forEach((clave) => otro.removeItem(clave));
    destino.setItem('token', authToken);
    destino.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    ['token', 'user'].forEach((clave) => {
      localStorage.removeItem(clave);
      sessionStorage.removeItem(clave);
    });
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
