import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import axios from "axios";
import './Animales.css';

/**
 * @description Componente para gestionar el registro de animales de una explotación.
 * Permite listar, buscar, añadir, editar y eliminar animales, además de navegar a incidencias y movimientos.
 * @returns {JSX.Element} Interfaz del registro de animales.
 */
function Animales() {
  const [animales, setAnimales] = useState([]);
  const [filteredAnimales, setFilteredAnimales] = useState([]);
  const { idExplotacion } = useParams();
  const [nuevoAnimal, setNuevoAnimal] = useState({ identificacion: "", especie: "", estado: "", fecha_nacimiento: "", fecha_alta: "", id_explotacion: idExplotacion });
  const [editAnimal, setEditAnimal] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [animalesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Cargar animales y titular al montar el componente
  useEffect(() => {
    axios.get("http://localhost:5000/api/animales").then((res) => {
      const filteredAnimales = res.data.filter(animal => String(animal.id_explotacion) === String(idExplotacion));
      setAnimales(filteredAnimales);
      setFilteredAnimales(filteredAnimales);
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });
  }, [id, idExplotacion]);

  // Eliminar un animal
  const handleDelete = (id, identificacion) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar el animal ${identificacion}?`);
    if (confirmDelete) {
      axios.delete(`http://localhost:5000/api/animales/${id}`).then(() => {
        const updatedAnimales = animales.filter((animal) => animal.id !== id);
        setAnimales(updatedAnimales);
        setFilteredAnimales(updatedAnimales);
      });
    }
  };

  // Validar formulario antes de añadir o editar
  const validateForm = (animal) => {
    return animal.identificacion && animal.especie && animal.estado && animal.fecha_nacimiento && animal.fecha_alta && animal.id_explotacion;
  };

  // Añadir un nuevo animal
  const handleAdd = () => {
    if (!validateForm(nuevoAnimal)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.post("http://localhost:5000/api/animales", nuevoAnimal).then((res) => {
      const updatedAnimales = [...animales, res.data];
      setAnimales(updatedAnimales);
      setFilteredAnimales(updatedAnimales);
      setNuevoAnimal({ identificacion: "", especie: "", estado: "", fecha_nacimiento: "", fecha_alta: "", id_explotacion: idExplotacion });
    }).catch((error) => {
      setError(error.response.data.message);
    });
  };

  // Editar un animal existente
  const handleEdit = (id) => {
    if (!validateForm(editAnimal)) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    axios.put(`http://localhost:5000/api/animales/${id}`, editAnimal).then((res) => {
      const updatedAnimales = animales.map((animal) => (animal.id === id ? res.data : animal));
      setAnimales(updatedAnimales);
      setFilteredAnimales(updatedAnimales);
      setEditAnimal(null);
    });
  };

  const handleEditClick = (animal) => {
    const dateNacimiento = new Date(animal.fecha_nacimiento);
    const dateAlta = new Date(animal.fecha_alta);
    dateNacimiento.setDate(dateNacimiento.getDate() + 1); // Sumar un día debido a la zona horaria
    dateAlta.setDate(dateAlta.getDate() + 1); // Sumar un día debido a la zona horaria
    setEditAnimal({
      ...animal,
      fecha_nacimiento: dateNacimiento.toISOString().split('T')[0],
      fecha_alta: dateAlta.toISOString().split('T')[0]
    });
  };

  // Buscar animales por identificación
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredAnimales(animales);
    } else {
      const filtered = animales.filter((animal) =>
        animal.identificacion.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredAnimales(filtered);
    }
  };

  // Navegar a incidencias o movimientos de un animal
  const handleNavigate1 = (animal_id) => {
    navigate(`/titulares/${id}/explotaciones/${idExplotacion}/animales/${animal_id}/incidencias`);
  }
  const handleNavigate2 = (animal_id) => {
    navigate(`/titulares/${id}/explotaciones/${idExplotacion}/animales/${animal_id}/movimientos`);
  }
  

  // Paginación
  const indexOfLastAnimal = currentPage * animalesPerPage;
  const indexOfFirstAnimal = indexOfLastAnimal - animalesPerPage;
  const currentAnimales = filteredAnimales.slice(indexOfFirstAnimal, indexOfLastAnimal);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Verificar si el usuario tiene acceso
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
    <div className="registro-animales-container">
      <h1>Registro de Animales</h1>
      <input
        type="text"
        placeholder="Buscar por identificación"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="registro-animales-table">
        <thead>
          <tr>
            <th>Identificación</th>
            <th>Especie</th>
            <th>Estado</th>
            <th>Fecha de nacimiento</th>
            <th>Fecha de alta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentAnimales.map((animal) => (
            <tr key={animal.id}>
              <td>{animal.identificacion}</td>
              <td>{animal.especie}</td>
              <td>{animal.estado}</td>
              <td>{new Date(animal.fecha_nacimiento).toLocaleDateString()}</td>
              <td>{new Date(animal.fecha_alta).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(animal.id, animal.identificacion)}>Eliminar</button>
                <button onClick={() => handleEditClick(animal)}>Editar</button>
                <button onClick={() => handleNavigate1(animal.id)}>Incidencias</button>
                <button onClick={() => handleNavigate2(animal.id)}>Movimientos</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredAnimales.length / animalesPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
      
      {error && <p className="error">{error}</p>}

      {editAnimal && (
        <div className="form-container">
            <input
            type="text"
            placeholder="Identificación"
            value={editAnimal.identificacion}
            onChange={(e) => setEditAnimal({ ...editAnimal, identificacion: e.target.value })}
          />
          <input
            type="text"
            placeholder="Especie"
            value={editAnimal.especie}
            onChange={(e) => setEditAnimal({ ...editAnimal, especie: e.target.value })}
          />
          <input
            type="text"
            placeholder="Estado"
            value={editAnimal.estado}
            onChange={(e) => setEditAnimal({ ...editAnimal, estado: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha de nacimiento"
            value={editAnimal.fecha_nacimiento}
            onChange={(e) => setEditAnimal({ ...editAnimal, fecha_nacimiento: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha de alta"
            value={editAnimal.fecha_alta}
            onChange={(e) => setEditAnimal({ ...editAnimal, fecha_alta: e.target.value })}
          />
          <button onClick={() => handleEdit(editAnimal.id)}>Guardar cambios</button>
        </div>
      )}

      {!editAnimal && (
        <div className="form-container">
            <input
            type="text"
            placeholder="Identificación"
            value={nuevoAnimal.identificacion}
            onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, identificacion: e.target.value })}
          />
          <input
            type="text"
            placeholder="Especie"
            value={nuevoAnimal.especie}
            onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, especie: e.target.value })}
          />
          <input
            type="text"
            placeholder="Estado"
            value={nuevoAnimal.estado}
            onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, estado: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha de nacimiento"
            value={nuevoAnimal.fecha_nacimiento}
            onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, fecha_nacimiento: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha de alta"
            value={nuevoAnimal.fecha_alta}
            onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, fecha_alta: e.target.value })}
          />
          <button onClick={handleAdd} >Añadir Animal</button>
        </div>
      )}
    </div>
  );
}

export default Animales;