import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import axios from "axios";
import './Medicamentos.css';

/**
 * @description Componente para gestionar el registro de medicamentos de una explotación.
 * Permite listar, buscar, añadir, editar y eliminar medicamentos asociados a una explotación.
 * @returns {JSX.Element} Interfaz del registro de medicamentos.
 */
function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [filteredMedicamentos, setFilteredMedicamentos] = useState([]);
  const { idExplotacion } = useParams();
  const [nuevoMedicamento, setNuevoMedicamento] = useState({ fecha: "", receta: "", medicamento: "", factura: "", id_explotacion: idExplotacion });
  const [editMedicamento, setEditMedicamento] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [medicamentosPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Cargar medicamentos y titular al montar el componente
  useEffect(() => {
    axios.get("http://localhost:5000/api/medicamentos").then((res) => {
      const filteredMedicamentos = res.data.filter(medicamento => String(medicamento.id_explotacion) === String(idExplotacion));
      setMedicamentos(filteredMedicamentos);
      setFilteredMedicamentos(filteredMedicamentos);
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });
  }, [id, idExplotacion]);

  // Eliminar un medicamento
  const handleDelete = (id, receta) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar la medicamento ${receta}?`);
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/medicamentos/${id}`).then(() => {
        const updatedMedicamentos = medicamentos.filter((medicamento) => medicamento.id !== id);
        setMedicamentos(updatedMedicamentos);
        setFilteredMedicamentos(updatedMedicamentos);
      });
    }
  };

  // Validar formulario antes de añadir o editar
  const validateForm = (medicamento) => {
    return medicamento.fecha && medicamento.receta && medicamento.medicamento && medicamento.factura && medicamento.id_explotacion;
  };

  // Añadir un nuevo medicamento
  const handleAdd = () => {
    if (!validateForm(nuevoMedicamento)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.post("http://localhost:5000/api/medicamentos", nuevoMedicamento).then((res) => {
      const updatedMedicamentos = [...medicamentos, res.data];
      setMedicamentos(updatedMedicamentos);
      setFilteredMedicamentos(updatedMedicamentos);
      setNuevoMedicamento({ fecha: "", receta: "", medicamento: "", factura: "", id_explotacion: idExplotacion });
    }).catch((error) => {
      setError(error.response.data.message);
    });
  };

  // Editar un medicamento existente
  const handleEdit = (id) => {
    if (!validateForm(editMedicamento)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.put(`http://localhost:5000/api/medicamentos/${id}`, editMedicamento).then((res) => {
      const updatedMedicamentos = medicamentos.map((medicamento) => (medicamento.id === id ? res.data : medicamento));
      setMedicamentos(updatedMedicamentos);
      setFilteredMedicamentos(updatedMedicamentos);
      setEditMedicamento(null);
    });
  };

  const handleEditClick = (medicamento) => {
    const date = new Date(medicamento.fecha);
    date.setDate(date.getDate() + 1);
    setEditMedicamento({
      ...medicamento,
      fecha: date.toISOString().split('T')[0]
    });
  };

  // Buscar medicamentos por receta
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredMedicamentos(medicamentos);
    } else {
      const filtered = medicamentos.filter((medicamento) =>
        medicamento.receta.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMedicamentos(filtered);
    }
  };

  // Paginación
  const indexOfLastMedicamento = currentPage * medicamentosPerPage;
  const indexOfFirstMedicamento = indexOfLastMedicamento - medicamentosPerPage;
  const currentMedicamentos = filteredMedicamentos.slice(indexOfFirstMedicamento, indexOfLastMedicamento);
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
    <div className="registro-medicamentos-container">
      <h1>Registro de Medicamentos</h1>
      <input
        type="text"
        placeholder="Buscar por receta"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="registro-medicamentos-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Receta</th>
            <th>Medicamento</th>
            <th>Factura</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentMedicamentos.map((medicamento) => (
            <tr key={medicamento.id}>
              <td>{new Date(medicamento.fecha).toLocaleDateString()}</td>
              <td>{medicamento.receta}</td>
              <td>{medicamento.medicamento}</td>
              <td>{medicamento.factura}</td>
              <td>
                <button onClick={() => handleDelete(medicamento.id, medicamento.receta)}>Eliminar</button>
                <button onClick={() => handleEditClick(medicamento)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredMedicamentos.length / medicamentosPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
      
      {error && <p className="error">{error}</p>}

      {editMedicamento && (
        <div className="form-container">
          <input
            type="date"
            placeholder="Fecha"
            value={editMedicamento.fecha}
            onChange={(e) => setEditMedicamento({ ...editMedicamento, fecha: e.target.value })}
          />
          <input
            type="text"
            placeholder="Receta"
            value={editMedicamento.receta}
            onChange={(e) => setEditMedicamento({ ...editMedicamento, receta: e.target.value })}
          />
          <input
            type="text"
            placeholder="Medicamento"
            value={editMedicamento.medicamento}
            onChange={(e) => setEditMedicamento({ ...editMedicamento, medicamento: e.target.value })}
          />
          <input
            type="text"
            placeholder="Factura"
            value={editMedicamento.factura}
            onChange={(e) => setEditMedicamento({ ...editMedicamento, factura: e.target.value })}
          />
          <button onClick={() => handleEdit(editMedicamento.id)}>Guardar cambios</button>
        </div>
      )}

      {!editMedicamento && (
        <div className="form-container">
          <input
            type="date"
            placeholder="Fecha"
            value={nuevoMedicamento.fecha}
            onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, fecha: e.target.value })}
          />
          <input
            type="text"
            placeholder="Receta"
            value={nuevoMedicamento.receta}
            onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, receta: e.target.value })}
          />
          <input
            type="text"
            placeholder="Medicamento"
            value={nuevoMedicamento.medicamento}
            onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, medicamento: e.target.value })}
          />
          <input
            type="text"
            placeholder="Factura"
            value={nuevoMedicamento.factura}
            onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, factura: e.target.value })}
          />
          <button onClick={handleAdd} >Añadir Medicamento</button>
        </div>
      )}
    </div>
  );
}

export default Medicamentos;