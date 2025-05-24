import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import axios from "axios";
import './Parcelas.css';

/**
 * @description Componente para gestionar el registro de parcelas de una explotación.
 * Permite listar, buscar, añadir, editar y eliminar parcelas asociadas a una explotación.
 * @returns {JSX.Element} Interfaz del registro de parcelas.
 */
function Parcelas() {
  const [parcelas, setParcelas] = useState([]);
  const [filteredParcelas, setFilteredParcelas] = useState([]);
  const { idExplotacion } = useParams();
  const [nuevaParcela, setNuevaParcela] = useState({ coordenadas: "", extension: "", id_explotacion: idExplotacion });
  const [editParcela, setEditParcela] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [parcelasPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Cargar parcelas y titular al montar el componente  
  useEffect(() => {
    axios.get("http://localhost:5000/api/parcelas").then((res) => {
      const filteredParcelas = res.data.filter(parcela => String(parcela.id_explotacion) === String(idExplotacion));
      setParcelas(filteredParcelas);
      setFilteredParcelas(filteredParcelas);
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });
  }, [id, idExplotacion]);

  // Eliminar una parcela
  const handleDelete = (id, coordenadas) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar la parcela ${coordenadas}?`);
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/parcelas/${id}`).then(() => {
        const updatedParcelas = parcelas.filter((parcela) => parcela.id !== id);
        setParcelas(updatedParcelas);
        setFilteredParcelas(updatedParcelas);
      });
    }
  };

  // Validar formulario antes de añadir o editar
  const validateForm = (parcela) => {
    return parcela.coordenadas && parcela.extension && parcela.id_explotacion;
  };

  // Añadir una nueva parcela
  const handleAdd = () => {
    if (!validateForm(nuevaParcela)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.post("http://localhost:5000/api/parcelas", nuevaParcela).then((res) => {
      const updatedParcelas = [...parcelas, res.data];
      setParcelas(updatedParcelas);
      setFilteredParcelas(updatedParcelas);
      setNuevaParcela({ coordenadas: "", extension: "", id_explotacion: idExplotacion });
    });
  };

  // Editar una parcela existente
  const handleEdit = (id) => {
    if (!validateForm(editParcela)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.put(`http://localhost:5000/api/parcelas/${id}`, editParcela).then((res) => {
      const updatedParcelas = parcelas.map((parcela) => (parcela.id === id ? res.data : parcela));
      setParcelas(updatedParcelas);
      setFilteredParcelas(updatedParcelas);
      setEditParcela(null);
    });
  };

  // Buscar parcelas por coordenadas
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredParcelas(parcelas);
    } else {
      const filtered = parcelas.filter((parcela) =>
        parcela.coordenadas.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredParcelas(filtered);
    }
  };

  // Paginación
  const indexOfLastParcela = currentPage * parcelasPerPage;
  const indexOfFirstParcela = indexOfLastParcela - parcelasPerPage;
  const currentParcelas = filteredParcelas.slice(indexOfFirstParcela, indexOfLastParcela);
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
    <div className="registro-parcelas-container">
      <h1>Registro de Parcelas</h1>
      <input
        type="text"
        placeholder="Buscar por coordenadas"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="registro-parcelas-table">
        <thead>
          <tr>
            <th>Coordenadas</th>
            <th>Extensión</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentParcelas.map((parcela) => (
            <tr key={parcela.id}>
              <td>{parcela.coordenadas}</td>
              <td>{parcela.extension}</td>
              <td>
                <button onClick={() => handleDelete(parcela.id, parcela.coordenadas)}>Eliminar</button>
                <button onClick={() => setEditParcela(parcela)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredParcelas.length / parcelasPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      {editParcela && (
        <div className="form-container">
          <input
            type="text"
            placeholder="Coordenadas"
            value={editParcela.coordenadas}
            onChange={(e) => setEditParcela({ ...editParcela, coordenadas: e.target.value })}
          />
          <input
            type="number"
            placeholder="Extensión"
            value={editParcela.extension}
            onChange={(e) => setEditParcela({ ...editParcela, extension: e.target.value })}
          />
          <button onClick={() => handleEdit(editParcela.id)}>Guardar cambios</button>
        </div>
      )}

      {!editParcela && (
        <div className="form-container">
          <input
            type="text"
            placeholder="Coordenadas"
            value={nuevaParcela.coordenadas}
            onChange={(e) => setNuevaParcela({ ...nuevaParcela, coordenadas: e.target.value })}
          />
          <input
            type="number"
            placeholder="Extensión"
            value={nuevaParcela.extension}
            onChange={(e) => setNuevaParcela({ ...nuevaParcela, extension: e.target.value })}
          />
          <button onClick={handleAdd}>Añadir Parcela</button>
        </div>
      )}
    </div>
  );
}

export default Parcelas;