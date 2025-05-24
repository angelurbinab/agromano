import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import axios from "axios";
import './Inspecciones.css';

/**
 * @description Componente para gestionar el registro de inspecciones de una explotación.
 * Permite listar, buscar, añadir, editar y eliminar inspecciones asociadas a una explotación.
 * @returns {JSX.Element} Interfaz del registro de inspecciones.
 */
function Inspecciones() {
  const [inspecciones, setInspecciones] = useState([]);
  const [filteredInspecciones, setFilteredInspecciones] = useState([]);
  const { idExplotacion } = useParams();
  const [nuevoInspeccion, setNuevoInspeccion] = useState({ fecha: "", oficial: false, tipo: "",  numero_acta: "", id_explotacion: idExplotacion });
  const [editInspeccion, setEditInspeccion] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inspeccionesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Cargar inspecciones y titular al montar el componente
  useEffect(() => {
    axios.get("http://localhost:5000/api/inspecciones").then((res) => {
      const filteredInspecciones = res.data.filter(inspeccion => String(inspeccion.id_explotacion) === String(idExplotacion));
      setInspecciones(filteredInspecciones);
      setFilteredInspecciones(filteredInspecciones);
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });
  }, [id, idExplotacion]);

  // Eliminar una inspección
  const handleDelete = (id, numero_acta) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar la inspeccion ${numero_acta}?`);
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/inspecciones/${id}`).then(() => {
        const updatedInspecciones = inspecciones.filter((inspeccion) => inspeccion.id !== id);
        setInspecciones(updatedInspecciones);
        setFilteredInspecciones(updatedInspecciones);
      });
    }
  };

  // Validar formulario antes de añadir o editar
  const validateForm = (inspeccion) => {
    return inspeccion.fecha && inspeccion.tipo && inspeccion.numero_acta && inspeccion.id_explotacion;
  };

  // Añadir una nueva inspección
  const handleAdd = () => {
    if (!validateForm(nuevoInspeccion)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.post("http://localhost:5000/api/inspecciones", nuevoInspeccion).then((res) => {
      const updatedInspecciones = [...inspecciones, res.data];
      setInspecciones(updatedInspecciones);
      setFilteredInspecciones(updatedInspecciones);
      setNuevoInspeccion({ fecha: "", oficial: "no", tipo: "",  numero_acta: "", id_explotacion: idExplotacion });
    }).catch((error) => {
      setError(error.response.data.message);
    });
  };

  // Editar una inspección existente
  const handleEdit = (id) => {
    if (!validateForm(editInspeccion)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.put(`http://localhost:5000/api/inspecciones/${id}`, editInspeccion).then((res) => {
      const updatedInspecciones = inspecciones.map((inspeccion) => (inspeccion.id === id ? res.data : inspeccion));
      setInspecciones(updatedInspecciones);
      setFilteredInspecciones(updatedInspecciones);
      setEditInspeccion(null);
    });
  };

  const handleEditClick = (inspeccion) => {
    const date = new Date(inspeccion.fecha);
    date.setDate(date.getDate() + 1); // Sumar un día debido a la zona horaria
    setEditInspeccion({
      ...inspeccion,
      fecha: date.toISOString().split('T')[0]
    });
  };

  // Buscar inspecciones por número de acta
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredInspecciones(inspecciones);
    } else {
      const filtered = inspecciones.filter((inspeccion) =>
        inspeccion.numero_acta.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredInspecciones(filtered);
    }
  };

  // Paginación
  const indexOfLastInspeccion = currentPage * inspeccionesPerPage;
  const indexOfFirstInspeccion = indexOfLastInspeccion - inspeccionesPerPage;
  const currentInspecciones = filteredInspecciones.slice(indexOfFirstInspeccion, indexOfLastInspeccion);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Verificar si el usuario tiene acceso al titular
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
    <div className="registro-inspecciones-container">
      <h1>Registro de Inspecciones</h1>
      <input
        type="text"
        placeholder="Buscar por numero de acta"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="registro-inspecciones-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Oficial</th>
            <th>Tipo</th>
            <th>Numero de acta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentInspecciones.map((inspeccion) => (
            <tr key={inspeccion.id}>
              <td>{new Date(inspeccion.fecha).toLocaleDateString()}</td>
              <td>{inspeccion.oficial ? "sí" : "no"}</td>
              <td>{inspeccion.tipo}</td>
              <td>{inspeccion.numero_acta}</td>
              <td>
                <button onClick={() => handleDelete(inspeccion.id, inspeccion.numero_acta)}>Eliminar</button>
                <button onClick={() => handleEditClick(inspeccion)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredInspecciones.length / inspeccionesPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
      
      {error && <p className="error">{error}</p>}

      {editInspeccion && (
        <div className="form-container">
          <input
            type="date"
            placeholder="Fecha"
            value={editInspeccion.fecha}
            onChange={(e) => setEditInspeccion({ ...editInspeccion, fecha: e.target.value })}
          />
          <select
            value={editInspeccion.oficial ? "sí" : "no"}
            onChange={(e) => setEditInspeccion({ ...editInspeccion, oficial: e.target.value === "sí" })}
            >
            <option value="sí">Sí</option>
            <option value="no">No</option>
            </select>
          <input
            type="text"
            placeholder="Tipo"
            value={editInspeccion.tipo}
            onChange={(e) => setEditInspeccion({ ...editInspeccion, tipo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Numero de acta"
            value={editInspeccion.numero_acta}
            onChange={(e) => setEditInspeccion({ ...editInspeccion, numero_acta: e.target.value })}
          />
          <button onClick={() => handleEdit(editInspeccion.id)}>Guardar cambios</button>
        </div>
      )}

      {!editInspeccion && (
        <div className="form-container">
          <input
            type="date"
            placeholder="Fecha"
            value={nuevoInspeccion.fecha}
            onChange={(e) => setNuevoInspeccion({ ...nuevoInspeccion, fecha: e.target.value })}
          />
          <select
            value={nuevoInspeccion.oficial ? "sí" : "no"}
            onChange={(e) => setNuevoInspeccion({ ...nuevoInspeccion, oficial: e.target.value === "sí" })}
            >
            <option value="sí">Sí</option>
            <option value="no">No</option>
            </select>
          <input
            type="text"
            placeholder="Tipo"
            value={nuevoInspeccion.tipo}
            onChange={(e) => setNuevoInspeccion({ ...nuevoInspeccion, tipo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Numero de acta"
            value={nuevoInspeccion.numero_acta}
            onChange={(e) => setNuevoInspeccion({ ...nuevoInspeccion, numero_acta: e.target.value })}
          />
          <button onClick={handleAdd} >Añadir Inspeccion</button>
        </div>
      )}
    </div>
  );
}

export default Inspecciones;