import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from '../../context/AuthContext';
import './EliminarTitular.css';

/**
 * @description Componente para eliminar titulares.
 * Permite al usuario eliminar titulares asociados a su cuenta con confirmación doble.
 * @returns {JSX.Element} Interfaz para listar y eliminar titulares.
 */
function EliminarTitular() {
  const { isAuthenticated } = useContext(AuthContext);
  const [titulares, setTitulares] = useState([]);

  // Cargar titulares al montar el componente si el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated) {
    axios.get("http://localhost:5000/api/titulares", { withCredentials: true }).then((res) => {
      setTitulares(res.data);
    });
  }
  }, [isAuthenticated]);

  /**
   * @description Maneja la eliminación de un titular con confirmación doble.
   * @param {number} id ID del titular a eliminar.
   * @param {string} nombre Nombre del titular a eliminar.
   */
  const handleDelete = (id, nombre) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar el titular ${nombre}? Todos los datos asociados al titular serán eliminados.`);
    if (confirmDelete) {
      const doubleConfirm = prompt(`Para confirmar la eliminación del titular ${nombre}, escribe la palabra "eliminar".`);
      if (doubleConfirm && doubleConfirm.toLowerCase() === "eliminar") {
        axios.delete(`http://localhost:5000/api/titulares/${id}`).then((res) => {
          setTitulares(titulares.filter((titular) => titular.id !== id));
          alert(`El titular ${nombre} ha sido eliminado correctamente.`);
        });
      } else {
        alert("La eliminación ha sido cancelada. No escribiste la palabra correcta.");
      }
    }
  };

  return (
    <div className="eliminar-titular-container">
      <h1>Eliminar Titular</h1>
      <ul>
        {titulares.map((titular) => (
          <li key={titular.id}>
            {titular.nombre}
            <button onClick={() => handleDelete(titular.id, titular.nombre)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EliminarTitular;