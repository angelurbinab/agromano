import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import axios from "axios";
import './Movimientos.css';

/**
 * @description Componente para gestionar el registro de movimientos de un animal.
 * Permite listar, buscar, añadir, editar y eliminar movimientos asociados a un animal.
 * @returns {JSX.Element} Interfaz del registro de movimientos.
 */
function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [filteredMovimientos, setFilteredMovimientos] = useState([]);
  const { idAnimal } = useParams();
  const [animal, setAnimal] = useState(null);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({ tipo: "", fecha: "",  motivo: "", procedencia_destino: "", id_animal: idAnimal });
  const [editMovimiento, setEditMovimiento] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [movimientosPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Cargar movimientos, titular y datos del animal al montar el componente
  useEffect(() => {
    axios.get("http://localhost:5000/api/movimientos").then((res) => {
      const filteredMovimientos = res.data.filter(movimiento => String(movimiento.id_animal) === String(idAnimal));
      setMovimientos(filteredMovimientos);
      setFilteredMovimientos(filteredMovimientos);
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });

    axios.get(`http://localhost:5000/api/animales/${idAnimal}`).then((res) => {
      setAnimal(res.data);
    });
  }, [id, idAnimal]);

  // Eliminar un movimiento
  const handleDelete = (id, fecha) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar el movimiento del ${new Date(fecha).toLocaleDateString()}?`);
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/movimientos/${id}`).then(() => {
        const updatedMovimientos = movimientos.filter((movimiento) => movimiento.id !== id);
        setMovimientos(updatedMovimientos);
        setFilteredMovimientos(updatedMovimientos);
      });
    }
  };

  // Validar formulario antes de añadir o editar
  const validateForm = (movimiento) => {
    return movimiento.tipo && movimiento.fecha && movimiento.motivo;
  };

  // Añadir un nuevo movimiento
  const handleAdd = () => {
    if (!validateForm(nuevoMovimiento)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.post("http://localhost:5000/api/movimientos", nuevoMovimiento).then((res) => {
      const updatedMovimientos = [...movimientos, res.data];
      setMovimientos(updatedMovimientos);
      setFilteredMovimientos(updatedMovimientos);
      setNuevoMovimiento({ tipo: "", fecha: "",  motivo: "", procedencia_destino: "", id_animal: idAnimal });
    });
  };

  // Editar un movimiento existente
  const handleEdit = (id) => {
    if (!validateForm(editMovimiento)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.put(`http://localhost:5000/api/movimientos/${id}`, editMovimiento).then((res) => {
      const updatedMovimientos = movimientos.map((movimiento) => (movimiento.id === id ? res.data : movimiento));
      setMovimientos(updatedMovimientos);
      setFilteredMovimientos(updatedMovimientos);
      setEditMovimiento(null);
    });
  };

  const handleEditClick = (movimiento) => {
    const date = new Date(movimiento.fecha);
    date.setDate(date.getDate() + 1); // Sumar un día debido a la zona horaria
    setEditMovimiento({
      ...movimiento,
      fecha: date.toISOString().split('T')[0]
    });
  };

  // Buscar movimientos por motivo
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredMovimientos(movimientos);
    } else {
      const filtered = movimientos.filter((movimiento) =>
        movimiento.motivo.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMovimientos(filtered);
    }
  };

  // Paginación
  const indexOfLastMovimiento = currentPage * movimientosPerPage;
  const indexOfFirstMovimiento = indexOfLastMovimiento - movimientosPerPage;
  const currentMovimientos = filteredMovimientos.slice(indexOfFirstMovimiento, indexOfLastMovimiento);
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
    <div className="registro-movimientos-container">
      <h1>Registro de movimientos del animal {animal.identificacion}</h1>
      <input
        type="text"
        placeholder="Buscar por motivo"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="registro-movimientos-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Motivo</th>
            <th>Procedencia-Destino</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentMovimientos.map((movimiento) => (
            <tr key={movimiento.id}>
              <td>{movimiento.tipo}</td>
              <td>{new Date(movimiento.fecha).toLocaleDateString()}</td>
              <td>{movimiento.motivo}</td>
              <td>{movimiento.procedencia_destino}</td>
              <td>
                <button onClick={() => handleDelete(movimiento.id, movimiento.fecha)}>Eliminar</button>
                <button onClick={() => handleEditClick(movimiento)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredMovimientos.length / movimientosPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
      
      {error && <p className="error">{error}</p>}

      {editMovimiento && (
        <div className="form-container">
          <input
            type="text"
            placeholder="Tipo"
            value={editMovimiento.tipo}
            onChange={(e) => setEditMovimiento({ ...editMovimiento, tipo: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha"
            value={editMovimiento.fecha}
            onChange={(e) => setEditMovimiento({ ...editMovimiento, fecha: e.target.value })}
          />
          <input
            type="text"
            placeholder="Motivo"
            value={editMovimiento.motivo}
            onChange={(e) => setEditMovimiento({ ...editMovimiento, motivo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Procedencia-Destino"
            value={editMovimiento.procedencia_destino}
            onChange={(e) => setEditMovimiento({ ...editMovimiento, procedencia_destino: e.target.value })}
          />
          <button onClick={() => handleEdit(editMovimiento.id)}>Guardar cambios</button>
        </div>
      )}

      {!editMovimiento && (
        <div className="form-container">
          <input
            type="text"
            placeholder="Tipo"
            value={nuevoMovimiento.tipo}
            onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, tipo: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha"
            value={nuevoMovimiento.fecha}
            onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, fecha: e.target.value })}
          />
          <input
            type="text"
            placeholder="Motivo"
            value={nuevoMovimiento.motivo}
            onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, motivo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Procedencia-Destino"
            value={nuevoMovimiento.procedencia_destino}
            onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, procedencia_destino: e.target.value })}
          />
          <button onClick={handleAdd} >Añadir Movimiento</button>
        </div>
      )}
    </div>
  );
}

export default Movimientos;