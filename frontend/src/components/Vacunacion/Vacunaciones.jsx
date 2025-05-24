import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import axios from "axios";
import './Vacunaciones.css';

/**
 * @description Componente para gestionar el registro de vacunaciones de una explotación.
 * Permite listar, buscar, añadir, editar y eliminar vacunaciones asociadas a una explotación.
 * @returns {JSX.Element} Interfaz del registro de vacunaciones.
 */
function Vacunaciones() {
  const { idExplotacion } = useParams();
  const [vacunaciones, setVacunaciones] = useState([]);
  const [filteredVacunaciones, setFilteredVacunaciones] = useState([]);
  const [nuevoVacunacion, setNuevoVacunacion] = useState({ fecha: "", tipo: "", dosis: "", nombre_comercial: "", veterinario: "", id_explotacion: idExplotacion });
  const [editVacunacion, setEditVacunacion] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [vacunacionesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Cargar vacunaciones y titular al montar el componente
  useEffect(() => {
    axios.get("http://localhost:5000/api/vacunaciones").then((res) => {
      const filteredVacunaciones = res.data.filter(vacunacion => String(vacunacion.id_explotacion) === String(idExplotacion));
      setVacunaciones(filteredVacunaciones);
      setFilteredVacunaciones(filteredVacunaciones);
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });
  }, [id, idExplotacion]);

  // Eliminar una vacunación
  const handleDelete = (id, fecha) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar la vacunacion del ${new Date(fecha).toLocaleDateString()}?`);
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/vacunaciones/${id}`).then(() => {
        const updatedVacunaciones = vacunaciones.filter((vacunacion) => vacunacion.id !== id);
        setVacunaciones(updatedVacunaciones);
        setFilteredVacunaciones(updatedVacunaciones);
      });
    }
  };

  // Validar formulario antes de añadir o editar
  const validateForm = (vacunacion) => {
    return vacunacion.fecha && vacunacion.tipo && vacunacion.dosis && vacunacion.nombre_comercial && vacunacion.veterinario;
  };

  // Añadir una nueva vacunación
  const handleAdd = () => {
    if (!validateForm(nuevoVacunacion)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.post("http://localhost:5000/api/vacunaciones", nuevoVacunacion).then((res) => {
      const updatedVacunaciones = [...vacunaciones, res.data];
      setVacunaciones(updatedVacunaciones);
      setFilteredVacunaciones(updatedVacunaciones);
      setNuevoVacunacion({ fecha: "", tipo: "", dosis: "", nombre_comercial: "", veterinario: "", id_explotacion: idExplotacion });
    }).catch((error) => {
      setError(error.response.data.message);
    });
  };

  // Editar una vacunación existente
  const handleEdit = (id) => {
    if (!validateForm(editVacunacion)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.put(`http://localhost:5000/api/vacunaciones/${id}`, editVacunacion).then((res) => {
      const updatedVacunaciones = vacunaciones.map((vacunacion) => (vacunacion.id === id ? res.data : vacunacion));
      setVacunaciones(updatedVacunaciones);
      setFilteredVacunaciones(updatedVacunaciones);
      setEditVacunacion(null);
    });
  };

  const handleEditClick = (vacunacion) => {
    const date = new Date(vacunacion.fecha);
    date.setDate(date.getDate() + 1); // Sumar un día debido a la zona horaria
    setEditVacunacion({
      ...vacunacion,
      fecha: date.toISOString().split('T')[0]
    });
  };

  // Buscar vacunaciones por tipo
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredVacunaciones(vacunaciones);
    } else {
      const filtered = vacunaciones.filter((vacunacion) =>
        vacunacion.tipo.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredVacunaciones(filtered);
    }
  };

  // Navegar a animales afectados
  const handleNavigate = (vacunacion_id) => {
    navigate(`/titulares/${id}/explotaciones/${idExplotacion}/vacunaciones/${vacunacion_id}/animales`);
  }

  // Paginación
  const indexOfLastVacunacion = currentPage * vacunacionesPerPage;
  const indexOfFirstVacunacion = indexOfLastVacunacion - vacunacionesPerPage;
  const currentVacunaciones = filteredVacunaciones.slice(indexOfFirstVacunacion, indexOfLastVacunacion);
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
    <div className="registro-vacunaciones-container">
      <h1>Registro de Vacunaciones</h1>
      <input
        type="text"
        placeholder="Buscar por tipo de vacuna"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="registro-vacunaciones-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>dosis</th>
            <th>Nombre comercial</th>
            <th>Veterinario responsable</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentVacunaciones.map((vacunacion) => (
            <tr key={vacunacion.id}>
              <td>{new Date(vacunacion.fecha).toLocaleDateString()}</td>
              <td>{vacunacion.tipo}</td>
              <td>{vacunacion.dosis}</td>
              <td>{vacunacion.nombre_comercial}</td>
              <td>{vacunacion.veterinario}</td>
              <td>
                <button onClick={() => handleDelete(vacunacion.id, vacunacion.fecha)}>Eliminar</button>
                <button onClick={() => handleEditClick(vacunacion)}>Editar</button>
                <button onClick={() => handleNavigate(vacunacion.id)}>Animales afectados</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredVacunaciones.length / vacunacionesPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
      
      {error && <p className="error">{error}</p>}

      {editVacunacion && (
        <div className="form-container">
          <input
            type="date"
            placeholder="Fecha"
            value={editVacunacion.fecha}
            onChange={(e) => setEditVacunacion({ ...editVacunacion, fecha: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tipo de vacuna"
            value={editVacunacion.tipo}
            onChange={(e) => setEditVacunacion({ ...editVacunacion, tipo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Dosis"
            value={editVacunacion.dosis}
            onChange={(e) => setEditVacunacion({ ...editVacunacion, dosis: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nombre comercial"
            value={editVacunacion.nombre_comercial}
            onChange={(e) => setEditVacunacion({ ...editVacunacion, nombre_comercial: e.target.value })}
          />
          <input
            type="text"
            placeholder="Veterinario responsable"
            value={editVacunacion.veterinario}
            onChange={(e) => setEditVacunacion({ ...editVacunacion, veterinario: e.target.value })}
          />
          <button onClick={() => handleEdit(editVacunacion.id)}>Guardar cambios</button>
        </div>
      )}

      {!editVacunacion && (
        <div className="form-container">
          <input
            type="date"
            placeholder="Fecha"
            value={nuevoVacunacion.fecha}
            onChange={(e) => setNuevoVacunacion({ ...nuevoVacunacion, fecha: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tipo"
            value={nuevoVacunacion.tipo}
            onChange={(e) => setNuevoVacunacion({ ...nuevoVacunacion, tipo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Dosis"
            value={nuevoVacunacion.dosis}
            onChange={(e) => setNuevoVacunacion({ ...nuevoVacunacion, dosis: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nombre Comercial"
            value={nuevoVacunacion.nombre_comercial}
            onChange={(e) => setNuevoVacunacion({ ...nuevoVacunacion, nombre_comercial: e.target.value })}
          />
          <input
            type="text"
            placeholder="Veterinario responsable"
            value={nuevoVacunacion.veterinario}
            onChange={(e) => setNuevoVacunacion({ ...nuevoVacunacion, veterinario: e.target.value })}
          />
          <button onClick={handleAdd} >Añadir Vacunacion</button>
        </div>
      )}
    </div>
  );
}

export default Vacunaciones;