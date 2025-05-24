import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

/**
 * @description Componente que protege rutas restringidas. Redirige a la página principal si el usuario no está autenticado.
 * @param {Object} props Propiedades del componente.
 * @param {React.ReactNode} props.children Componentes hijos que se renderizan si el usuario está autenticado.
 * @returns {JSX.Element} Los hijos si el usuario está autenticado, o una redirección si no lo está.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (<div className="titular-detalles-container">
      <h1>Cargando...</h1>
      </div>);
  }

  if (!isAuthenticated) {
    return <Navigate to="/?error=not-found" />;
  }

  return children;
};

export default ProtectedRoute;