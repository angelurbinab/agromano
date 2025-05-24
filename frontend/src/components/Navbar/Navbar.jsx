import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import AuthContext from '../../context/AuthContext';

/**
 * @description Componente de la barra de navegación.
 * Muestra enlaces de navegación según el estado de autenticación del usuario.
 * @returns {JSX.Element} Barra de navegación.
 */
function Navbar() {
  const { isAuthenticated } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src= "/farmer_blanco.png" alt="Agromano Logo" className="logo-image" />
          <img src= "/letras_blanco.png" alt="Agromano Logo" className="logo-image2" />
        </Link>
      </div>
      
      {isAuthenticated && user && (
        <ul className="navbar-links">
          <li><Link to="/titulares">Titulares</Link></li>
          <li><Link to="/datostitular">Generar documento</Link></li>
          <li><Link to={`/profile/${user.id}`}>Perfil</Link></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;