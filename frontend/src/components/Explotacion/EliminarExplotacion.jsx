import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import axios from "axios";
import './EliminarExplotacion.css';

/**
 * @description Componente para eliminar explotaciones asociadas a un titular.
 * Permite al usuario eliminar explotaciones si tiene acceso.
 * @returns {JSX.Element} Interfaz para listar y eliminar explotaciones.
 */
function EliminarExplotacion() {
  const [explotaciones, setExplotaciones] = useState([]);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
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

  /**
   * @description Maneja la eliminación de una explotación con confirmación doble.
   * @param {number} id ID de la explotación a eliminar.
   * @param {string} nombre Nombre de la explotación a eliminar.
   */
  const handleDelete = (id, nombre) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar la explotación ${nombre}? Todos los datos asociados a esta explotación serán eliminados.`);
    if (confirmDelete) {
      const doubleConfirm = prompt(`Para confirmar la eliminación de la explotación ${nombre}, escribe la palabra "eliminar".`);
      if (doubleConfirm && doubleConfirm.toLowerCase() === "eliminar") {
        axios.delete(`http://localhost:5000/api/explotaciones/${id}`).then((res) => {
          setExplotaciones(explotaciones.filter((explotacion) => explotacion.id !== id));
          alert(`La explotación ${nombre} ha sido eliminada correctamente.`);
        });
      } else {
        alert("La eliminación ha sido cancelada. No escribiste la palabra correcta.");
      }
    }
  };

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
    <div className = "eliminar-explotacion-container">
      <h1>Eliminar Explotación</h1>
      <ul>
        {explotaciones.map((explotacion) => (
          <li key={explotacion.id}>
            {explotacion.nombre}
            <button onClick={() => handleDelete(explotacion.id, explotacion.nombre)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EliminarExplotacion;