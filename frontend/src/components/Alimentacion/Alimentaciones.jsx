import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import axios from "axios";
import './Alimentaciones.css';

/**
 * @description Componente para gestionar el registro de alimentaciones de una explotación.
 * Permite listar, buscar, añadir, editar y eliminar registros de alimentaciones.
 * @returns {JSX.Element} Interfaz del registro de alimentaciones.
 */
function Alimentaciones() {
  const [alimentaciones, setAlimentaciones] = useState([]);
  const [filteredAlimentaciones, setFilteredAlimentaciones] = useState([]);
  const { idExplotacion } = useParams();
  const [nuevoAlimentacion, setNuevoAlimentacion] = useState({ fecha: "", tipo: "", cantidad: "", lote: "", factura: "", id_explotacion: idExplotacion });
  const [editAlimentacion, setEditAlimentacion] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [alimentacionesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Cargar alimentaciones y titular al montar el componente
  useEffect(() => {
    axios.get("http://localhost:5000/api/alimentaciones").then((res) => {
      const filteredAlimentaciones = res.data.filter(alimentacion => String(alimentacion.id_explotacion) === String(idExplotacion));
      setAlimentaciones(filteredAlimentaciones);
      setFilteredAlimentaciones(filteredAlimentaciones);
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });
  }, [id, idExplotacion]);

  // Eliminar una alimentación
  const handleDelete = (id, tipo) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar la alimentacion ${tipo}?`);
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/alimentaciones/${id}`).then(() => {
        const updatedAlimentaciones = alimentaciones.filter((alimentacion) => alimentacion.id !== id);
        setAlimentaciones(updatedAlimentaciones);
        setFilteredAlimentaciones(updatedAlimentaciones);
      });
    }
  };

  const validateForm = (alimentacion) => {
    return alimentacion.fecha && alimentacion.tipo && alimentacion.cantidad && alimentacion.lote && alimentacion.factura &&alimentacion.id_explotacion;
  };

  // Añadir una nueva alimentación
  const handleAdd = () => {
    if (!validateForm(nuevoAlimentacion)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.post("http://localhost:5000/api/alimentaciones", nuevoAlimentacion).then((res) => {
      const updatedAlimentaciones = [...alimentaciones, res.data];
      setAlimentaciones(updatedAlimentaciones);
      setFilteredAlimentaciones(updatedAlimentaciones);
      setNuevoAlimentacion({ fecha: "", tipo: "", cantidad: "", lote: "", factura: "", id_explotacion: idExplotacion });
    }).catch((error) => {
      setError(error.response.data.message);
    });
  };

  // Editar una alimentación existente
  const handleEdit = (id) => {
    if (!validateForm(editAlimentacion)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.put(`http://localhost:5000/api/alimentaciones/${id}`, editAlimentacion).then((res) => {
      const updatedAlimentaciones = alimentaciones.map((alimentacion) => (alimentacion.id === id ? res.data : alimentacion));
      setAlimentaciones(updatedAlimentaciones);
      setFilteredAlimentaciones(updatedAlimentaciones);
      setEditAlimentacion(null);
    });
  };

  const handleEditClick = (alimentacion) => {
    const date = new Date(alimentacion.fecha);
    date.setDate(date.getDate() + 1); // Sumar un día debido a la zona horaria
    setEditAlimentacion({
      ...alimentacion,
      fecha: date.toISOString().split('T')[0]
    });
  };

  // Buscar alimentaciones por tipo
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredAlimentaciones(alimentaciones);
    } else {
      const filtered = alimentaciones.filter((alimentacion) =>
        alimentacion.tipo.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredAlimentaciones(filtered);
    }
  };

  // Paginación
  const indexOfLastAlimentacion = currentPage * alimentacionesPerPage;
  const indexOfFirstAlimentacion = indexOfLastAlimentacion - alimentacionesPerPage;
  const currentAlimentaciones = filteredAlimentaciones.slice(indexOfFirstAlimentacion, indexOfLastAlimentacion);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Comprobar si el usuario es el titular de la explotación
  if (!titular) {
    return (
      <div className="explotaciones-container">
        <h1>Cargando...</h1>
      </div>
    );
  }

  if (user.id !== titular.id_usuario) {
    return (
      <div className="explotacion-detalles-container">
        <div className="error-message">
          <img src="/angry_farmer.png" alt="Angry Farmer" />
          <p>¡Vaya! Parece que has intentado acceder a un recurso que no es tuyo. Agromano vela por la seguridad del cliente, utiliza la aplicación con propiedad.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-alimentaciones-container">
      <h1>Registro de Alimentaciones</h1>
      <input
        type="text"
        placeholder="Buscar por tipo"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="registro-alimentaciones-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Lote</th>
            <th>Factura</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentAlimentaciones.map((alimentacion) => (
            <tr key={alimentacion.id}>
              <td>{new Date(alimentacion.fecha).toLocaleDateString()}</td>
              <td>{alimentacion.tipo}</td>
              <td>{alimentacion.cantidad}</td>
              <td>{alimentacion.lote}</td>
              <td>{alimentacion.factura}</td>
              <td>
                <button onClick={() => handleDelete(alimentacion.id, alimentacion.tipo)}>Eliminar</button>
                <button onClick={() => handleEditClick(alimentacion)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredAlimentaciones.length / alimentacionesPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
      
      {error && <p className="error">{error}</p>}

      {editAlimentacion && (
        <div className="form-container">
          <input
            type="date"
            placeholder="Fecha"
            value={editAlimentacion.fecha}
            onChange={(e) => setEditAlimentacion({ ...editAlimentacion, fecha: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tipo"
            value={editAlimentacion.tipo}
            onChange={(e) => setEditAlimentacion({ ...editAlimentacion, tipo: e.target.value })}
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={editAlimentacion.cantidad}
            onChange={(e) => setEditAlimentacion({ ...editAlimentacion, cantidad: e.target.value })}
          />
          <input
            type="text"
            placeholder="Lote"
            value={editAlimentacion.lote}
            onChange={(e) => setEditAlimentacion({ ...editAlimentacion, lote: e.target.value })}
          />
          <input
            type="text"
            placeholder="Factura"
            value={editAlimentacion.factura}
            onChange={(e) => setEditAlimentacion({ ...editAlimentacion, factura: e.target.value })}
          />
          <button onClick={() => handleEdit(editAlimentacion.id)}>Guardar cambios</button>
        </div>
      )}

      {!editAlimentacion && (
        <div className="form-container">
          <input
            type="date"
            placeholder="Fecha"
            value={nuevoAlimentacion.fecha}
            onChange={(e) => setNuevoAlimentacion({ ...nuevoAlimentacion, fecha: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tipo"
            value={nuevoAlimentacion.tipo}
            onChange={(e) => setNuevoAlimentacion({ ...nuevoAlimentacion, tipo: e.target.value })}
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={nuevoAlimentacion.alimentacion}
            onChange={(e) => setNuevoAlimentacion({ ...nuevoAlimentacion, cantidad: e.target.value })}
          />
          <input
            type="text"
            placeholder="Lote"
            value={nuevoAlimentacion.alimentacion}
            onChange={(e) => setNuevoAlimentacion({ ...nuevoAlimentacion, lote: e.target.value })}
          />
          <input
            type="text"
            placeholder="Factura"
            value={nuevoAlimentacion.factura}
            onChange={(e) => setNuevoAlimentacion({ ...nuevoAlimentacion, factura: e.target.value })}
          />
          <button onClick={handleAdd} >Añadir Alimentacion</button>
        </div>
      )}
    </div>
  );
}

export default Alimentaciones;