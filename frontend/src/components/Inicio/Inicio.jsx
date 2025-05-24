import React, { useContext, useEffect } from 'react';
import './Inicio.css';
import { Link, useLocation } from "react-router-dom";
import AuthContext from '../../context/AuthContext';

/**
 * @description Componente de la página de inicio.
 * Muestra un mensaje de bienvenida personalizado si el usuario está autenticado, o enlaces para iniciar sesión o registrarse si no lo está.
 * También maneja errores de acceso no autorizado.
 * @returns {JSX.Element} Página de inicio.
 */
function Inicio() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const error = params.get("error");

  // Manejar recarga para sincronizar el estado del usuario después de autenticarse
  useEffect(() => {
    if (!user && isAuthenticated && !sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }
  }, [isAuthenticated, user]);


  return (
    <div className="inicio-page">
    <div className="inicio-container">
      <div className="inicio-imagen">
      <img src="/farmer.png" alt="Imagen Grande" />
      </div>
      <div className="inicio-texto">
      {error && (
          <div className="error-message">
            <img src="/angry_farmer.png" alt="Angry Farmer" />
            <p>¡Vaya! Parece que has intentado acceder donde no debías. Agromano vela por la seguridad del cliente, utiliza la aplicación con propiedad.</p>
          </div>
        )}
      {(isAuthenticated && user) ? (
        <div>
          <h1>¡Bienvenido de nuevo {user.nombre_usuario}!</h1>
          <p>Accede a tus titulares para ver los datos.</p>
          <Link to="/titulares" className="inicio-button">Acceder a titulares</Link>
        </div>
      ) : (
        <div>
          <h1>¡Bienvenido a Agromano!</h1>
          <h2>Tu cuaderno ganadero digital</h2>
          <p>Por favor, inicia sesión o regístrate para continuar.</p>
          <a href="/login" className="inicio-button">Iniciar Sesión</a>
          <a href="/register" className="inicio-button">Registrarse</a>
        </div>
      )}
      </div>
    </div>
    
      </div>
  );
}

export default Inicio;