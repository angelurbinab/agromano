import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import './TitularDetalles.css';

/**
 * @description Componente para mostrar los detalles de un titular.
 * Permite al usuario ver información detallada de un titular y acceder a las explotaciones asociadas.
 * @returns {JSX.Element} Detalles del titular.
 */
function TitularDetalles() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [titular, setTitular] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Cargar los detalles del titular al montar el componente
  useEffect(() => {
    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    }).catch((error) => {
      setErrorMessage("Error al obtener los detalles del titular");
    });
  }, [id]);

  // Verificar si el usuario tiene acceso al titular
  if (!titular) {
    return  (<div className="titular-detalles-container">
            <h1>Cargando...</h1>
            </div>);
  }

  if (titular.id_usuario !== user.id) {
    return  (<div className="titular-detalles-container">
            <div className="error-message">
            <img src="/angry_farmer.png" alt="Angry Farmer" />
            <p>¡Vaya! Parece que has intentado acceder a un recurso que no es tuyo. Agromano vela por la seguridad del cliente, utiliza la aplicación con propiedad.</p>
            </div>
            </div>);
  }

  return (
    <div className="titular-detalles-container">
      <h1>Detalles del Titular</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ul className="titular-detalles-list">
        <li><strong>Nombre:</strong> {titular.nombre}</li>
        <li><strong>NIF:</strong> {titular.nif}</li>
        <li><strong>Domicilio:</strong> {titular.domicilio}</li>
        <li><strong>Localidad:</strong> {titular.localidad}</li>
        <li><strong>Provincia:</strong> {titular.provincia}</li>
        <li><strong>Código Postal:</strong> {titular.codigo_postal}</li>
        <li><strong>Teléfono:</strong> {titular.telefono}</li>
        <li><strong>Usuario:</strong> {user.nombre_usuario}</li>
      </ul>
      <div className="entidades-enlaces">
        <Link to={`/titulares/${id}/explotaciones`} className="entidad-enlace">Explotaciones</Link>
      </div>
    </div>
  );
}

export default TitularDetalles;