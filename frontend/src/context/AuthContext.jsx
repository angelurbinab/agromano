import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto de autenticación
const AuthContext = createContext();

/**
 * @description Proveedor de contexto para manejar la autenticación en la aplicación.
 * Proporciona el estado de autenticación, el usuario actual y funciones para actualizar estos estados.
 * @param {Object} props Propiedades del componente.
 * @param {React.ReactNode} props.children Componentes hijos que tendrán acceso al contexto.
 * @returns {JSX.Element} Proveedor del contexto de autenticación.
 */
export const AuthProvider = ({ children }) => {
  // Estado para verificar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Estado para almacenar los datos del usuario autenticado
  const [user, setUser] = useState(null);

  // Estado para manejar el estado de carga mientras se verifica la autenticación
  const [loading, setLoading] = useState(true);

  /**
   * @description Efecto que se ejecuta al montar el componente para verificar la autenticación del usuario.
   * Realiza una solicitud al backend para comprobar si el usuario está autenticado.
   */
  useEffect(() => {
    axios.get('http://localhost:5000/api/check-auth', { withCredentials: true })
      .then((res) => {
        // Si el usuario está autenticado, actualiza los estados correspondientes
        setIsAuthenticated(res.data.isAuthenticated);
        setUser(res.data.user);
      })
      .catch((error) => {
        // Si ocurre un error, establece el usuario como no autenticado
        setIsAuthenticated(false);
        setUser(null);
      }).finally(() => {
        // Finaliza el estado de carga
        setLoading(false);
      });
  }, []);

  return (
    /**
     * @description Proveedor del contexto que expone los estados y funciones relacionadas con la autenticación.
     */
    <AuthContext.Provider value={{ isAuthenticated, user, loading, setIsAuthenticated, setUser, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;