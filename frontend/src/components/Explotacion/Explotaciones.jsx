import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import './Explotaciones.css';

/**
 * @description Componente para listar las explotaciones asociadas a un titular.
 * Permite al usuario ver, editar, agregar o eliminar explotaciones si tiene acceso.
 * @returns {JSX.Element} Interfaz para gestionar las explotaciones.
 */
function Explotaciones() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [explotaciones, setExplotaciones] = useState([]);
  const [titular, setTitular] = useState(null);

  // Cargar explotaciones y titular al montar el componente
  useEffect(() => {
    axios.get("http://localhost:5000/api/explotaciones").then((res) => {
      const filteredExplotaciones = res.data.filter(explotacion => String(explotacion.id_titular) === String(id));
      setExplotaciones(filteredExplotaciones);
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });    
  }, [id]);

  // Verificar si el usuario tiene acceso al titular
  if (!titular) {
    return  (<div className="explotaciones-container">
            <h1>Cargando...</h1>
            </div>);
  }

  if(user.id !== titular.id_usuario){
    return  (<div className="explotaciones-container">
      <div className="error-message">
      <img src="/angry_farmer.png" alt="Angry Farmer" />
      <p>¡Vaya! Parece que has intentado acceder a un recurso que no es tuyo. Agromano vela por la seguridad del cliente, utiliza la aplicación con propiedad.</p>
      </div>
      </div>);
  }

  return (
    <div className="explotaciones-container">
      <h1>Lista de Explotaciones</h1>
      {explotaciones.length === 0 ? (
        <p>No hay explotaciones disponibles.</p>
      ) : (
        <ul>
          {explotaciones.map((explotacion) => (
            <li key={explotacion.id}>
              <Link to={`/titulares/${id}/explotaciones/${explotacion.id}`} className="explotacion-link">{explotacion.nombre}</Link>
              <Link to={`/titulares/${id}/explotaciones/actualizar/${explotacion.id}`} className="add-explotacion-button">Editar</Link>
            </li>
          ))}
        </ul>
      )}
      <Link to={`/titulares/${id}/explotaciones/crear`} className="add-explotacion-button">Agregar nueva explotación</Link>
      <Link to={`/titulares/${id}/explotaciones/eliminar`} className="add-explotacion-button">Eliminar una explotación</Link>
    </div>
  );
}

export default Explotaciones;