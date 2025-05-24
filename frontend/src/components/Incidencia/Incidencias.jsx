import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import axios from "axios";
import './Incidencias.css';

/**
 * @description Componente para gestionar el registro de incidencias de un animal.
 * Permite listar, buscar, añadir, editar y eliminar incidencias asociadas a un animal.
 * @returns {JSX.Element} Interfaz del registro de incidencias.
 */
function Incidencias() {
  const [incidencias, setIncidencias] = useState([]);
  const [filteredIncidencias, setFilteredIncidencias] = useState([]);
  const { idAnimal } = useParams();
  const [animal, setAnimal] = useState(null);
  const [nuevoIncidencia, setNuevoIncidencia] = useState({ fecha: "", descripcion: "", codigo_anterior: "", codigo_actual: "", id_animal: idAnimal });
  const [editIncidencia, setEditIncidencia] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [incidenciasPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Cargar incidencias, titular y datos del animal al montar el componente
  useEffect(() => {
    axios.get("http://localhost:5000/api/incidencias").then((res) => {
      const filteredIncidencias = res.data.filter(incidencia => String(incidencia.id_animal) === String(idAnimal));
      setIncidencias(filteredIncidencias);
      setFilteredIncidencias(filteredIncidencias);
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });

    axios.get(`http://localhost:5000/api/animales/${idAnimal}`).then((res) => {
      setAnimal(res.data);
    });
  }, [id, idAnimal]);

  // Eliminar una incidencia
  const handleDelete = (id, fecha) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar la incidencia del ${new Date(fecha).toLocaleDateString()}?`);
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/incidencias/${id}`).then(() => {
        const updatedIncidencias = incidencias.filter((incidencia) => incidencia.id !== id);
        setIncidencias(updatedIncidencias);
        setFilteredIncidencias(updatedIncidencias);
      });
    }
  };

  // Validar formulario antes de añadir o editar
  const validateForm = (incidencia) => {
    return incidencia.fecha && incidencia.descripcion;
  };

  // Añadir una nueva incidencia
  const handleAdd = () => {
    if (!validateForm(nuevoIncidencia)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.post("http://localhost:5000/api/incidencias", nuevoIncidencia).then((res) => {
      const updatedIncidencias = [...incidencias, res.data];
      setIncidencias(updatedIncidencias);
      setFilteredIncidencias(updatedIncidencias);
      setNuevoIncidencia({ fecha: "", descripcion: "", codigo_anterior: "", codigo_actual: "", id_animal: idAnimal });
    });
  };

  // Editar una incidencia existente
  const handleEdit = (id) => {
    if (!validateForm(editIncidencia)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.put(`http://localhost:5000/api/incidencias/${id}`, editIncidencia).then((res) => {
      const updatedIncidencias = incidencias.map((incidencia) => (incidencia.id === id ? res.data : incidencia));
      setIncidencias(updatedIncidencias);
      setFilteredIncidencias(updatedIncidencias);
      setEditIncidencia(null);
    });
  };

  const handleEditClick = (incidencia) => {
    const date = new Date(incidencia.fecha);
    date.setDate(date.getDate() + 1); // Sumar un día debido a la zona horaria
    setEditIncidencia({
      ...incidencia,
      fecha: date.toISOString().split('T')[0]
    });
  };

  // Buscar incidencias por descripción
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredIncidencias(incidencias);
    } else {
      const filtered = incidencias.filter((incidencia) =>
        incidencia.descripcion.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredIncidencias(filtered);
    }
  };

  // Paginación
  const indexOfLastIncidencia = currentPage * incidenciasPerPage;
  const indexOfFirstIncidencia = indexOfLastIncidencia - incidenciasPerPage;
  const currentIncidencias = filteredIncidencias.slice(indexOfFirstIncidencia, indexOfLastIncidencia);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Verificar si el usuario tiene acceso al titular
  if (!titular || !animal) {
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
    <div className="registro-incidencias-container">
      <h1>Registro de incidencias del animal {animal.identificacion}</h1>
      <input
        type="text"
        placeholder="Buscar por descripcion"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="registro-incidencias-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Código anterior</th>
            <th>Código actual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentIncidencias.map((incidencia) => (
            <tr key={incidencia.id}>
              <td>{new Date(incidencia.fecha).toLocaleDateString()}</td>
              <td>{incidencia.descripcion}</td>
              <td>{incidencia.codigo_anterior}</td>
              <td>{incidencia.codigo_actual}</td>
              <td>
                <button onClick={() => handleDelete(incidencia.id, incidencia.fecha)}>Eliminar</button>
                <button onClick={() => handleEditClick(incidencia)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredIncidencias.length / incidenciasPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
      
      {error && <p className="error">{error}</p>}

      {editIncidencia && (
        <div className="form-container">
          <input
            type="date"
            placeholder="Fecha"
            value={editIncidencia.fecha}
            onChange={(e) => setEditIncidencia({ ...editIncidencia, fecha: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={editIncidencia.descripcion}
            onChange={(e) => setEditIncidencia({ ...editIncidencia, descripcion: e.target.value })}
          />
          <input
            type="text"
            placeholder="Código anterior"
            value={editIncidencia.codigo_anterior}
            onChange={(e) => setEditIncidencia({ ...editIncidencia, codigo_anterior: e.target.value })}
          />
          <input
            type="text"
            placeholder="Código actual"
            value={editIncidencia.codigo_actual}
            onChange={(e) => setEditIncidencia({ ...editIncidencia, codigo_actual: e.target.value })}
          />
          <button onClick={() => handleEdit(editIncidencia.id)}>Guardar cambios</button>
        </div>
      )}

      {!editIncidencia && (
        <div className="form-container">
          <input
            type="date"
            placeholder="Fecha"
            value={nuevoIncidencia.fecha}
            onChange={(e) => setNuevoIncidencia({ ...nuevoIncidencia, fecha: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoIncidencia.descripcion}
            onChange={(e) => setNuevoIncidencia({ ...nuevoIncidencia, descripcion: e.target.value })}
          />
          <input
            type="text"
            placeholder="Código anterior"
            value={nuevoIncidencia.codigo_anterior}
            onChange={(e) => setNuevoIncidencia({ ...nuevoIncidencia, codigo_anterior: e.target.value })}
          />
          <input
            type="text"
            placeholder="Código actual"
            value={nuevoIncidencia.codigo_actual}
            onChange={(e) => setNuevoIncidencia({ ...nuevoIncidencia, codigo_actual: e.target.value })}
          />
          <button onClick={handleAdd} >Añadir Incidencia</button>
        </div>
      )}
    </div>
  );
}

export default Incidencias;