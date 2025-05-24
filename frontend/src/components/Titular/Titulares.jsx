import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import './Titulares.css';

/**
 * @description Componente para listar los titulares asociados al usuario autenticado.
 * Permite al usuario ver, editar, agregar o eliminar titulares.
 * @returns {JSX.Element} Interfaz para gestionar titulares.
 */
function Titulares() {
  const { isAuthenticated } = useContext(AuthContext);
  const [titulares, setTitulares] = useState([]);

  // Cargar titulares al montar el componente si el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://localhost:5000/api/titulares', { withCredentials: true })
        .then((res) => {
          setTitulares(res.data);
        })
        .catch((error) => {
          console.error('Error al obtener los titulares:', error);
        });
    }
  }, [isAuthenticated]);

  return (
    <div className="titulares-container">
      <h1>Titulares</h1>
      {titulares.length > 0 ? (
        <ul>
          {titulares.map((titular) => (
            <li key={titular.id}>
            <Link to={`/titulares/${titular.id}`} className="titular-link">
              {titular.nombre}
            </Link>
            <Link to={`/titulares/actualizar/${titular.id}`} className="add-titular-button">Editar</Link></li>
          ))}
        </ul>
      ) : (
        <p>No tienes titulares asignados.</p>
      )}
      <Link to="/titulares/crear" className="add-titular-button">Agregar nuevo titular</Link>
      <Link to="/titulares/eliminar" className="add-titular-button">Eliminar un titular</Link>
    </div>
  );
}

export default Titulares;