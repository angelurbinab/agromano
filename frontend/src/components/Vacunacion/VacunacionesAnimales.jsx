import { useEffect, useState, useContext } from "react";
import AuthContext from '../../context/AuthContext';
import { useParams } from "react-router-dom";
import axios from "axios";
import './VacunacionesAnimales.css';

/**
 * @description Componente para gestionar los animales vacunados y no vacunados de una explotación.
 * Permite listar, buscar, añadir y eliminar animales de una vacunación específica.
 * @returns {JSX.Element} Interfaz para gestionar animales vacunados.
 */
function VacunacionAnimales() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);
  const { idVacunacion, idExplotacion } = useParams();
  const [vacuna, setVacuna] = useState(null);
  const [filteredAnimales, setFilteredAnimales] = useState([]);
  const [filteredAnimalesVacunados, setFilteredAnimalesVacunados] = useState([]);
  const [allAnimales, setAllAnimales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageVacunados, setCurrentPageVacunados] = useState(1);
  const [currentPageNoVacunados, setCurrentPageNoVacunados] = useState(1);
  const [error, setError] = useState("");
  const itemsPerPage = 5;

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    // Obtener los animales que han recibido la vacunación
    axios.get(`http://localhost:5000/api/vacunaciones_animal`).then((res) => {
      const filteredAnimalesVacunados = res.data.filter(animalvacunado => String(animalvacunado.id_vacunacion) === String(idVacunacion));
      setFilteredAnimalesVacunados(filteredAnimalesVacunados);

      // Obtener todos los animales de la explotación después de obtener los animales vacunados
      axios.get("http://localhost:5000/api/animales").then((res) => {
        const filteredAnimales = res.data.filter(animal => {
          return String(animal.id_explotacion) === String(idExplotacion) &&
                 filteredAnimalesVacunados.some(av => av.id_animal === animal.id);
        });
        setFilteredAnimales(filteredAnimales);

        const allAnimales = res.data.filter(animal => {
          return String(animal.id_explotacion) === String(idExplotacion) &&
                 !filteredAnimalesVacunados.some(av => av.id_animal === animal.id);
        });
        setAllAnimales(allAnimales);
      });
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });

    axios.get(`http://localhost:5000/api/vacunaciones/${idVacunacion}`).then((res) => {
      setVacuna(res.data);
    });
  }, [idVacunacion, idExplotacion]);

  /**
   * @description Añadir un animal a la vacunación.
   * @param {number} idAnimal ID del animal a añadir.
   */
  const handleAddAnimal = (idAnimal) => {
    axios.post("http://localhost:5000/api/vacunaciones_animal", {
      id_vacunacion: idVacunacion,
      id_animal: idAnimal,
    }).then((res) => {
      // Obtener el animal añadido de la lista de todos los animales
      const addedAnimal = allAnimales.find(animal => animal.id === idAnimal);

      // Actualizar la lista de animales vacunados
      setFilteredAnimales([...filteredAnimales, addedAnimal]);

      // Actualizar la lista de todos los animales de la explotación
      setAllAnimales(allAnimales.filter(animal => animal.id !== idAnimal));

      // Actualizar la lista de animales vacunados en la relación
      setFilteredAnimalesVacunados([...filteredAnimalesVacunados, res.data]);

      setError("");
    }).catch((err) => {
      setError("Error al añadir el animal.");
    });
  };

  /**
   * @description Eliminar un animal de la vacunación.
   * @param {number} idAnimal ID del animal a eliminar.
   */
  const handleRemoveAnimal = (idAnimal) => {
    const relacion = filteredAnimalesVacunados.find(av => av.id_vacunacion === parseInt(idVacunacion) && av.id_animal === idAnimal);
    if (!relacion) {
      setError("No se encontró la relación de vacunación.");
      return;
    }

    axios.delete(`http://localhost:5000/api/vacunaciones_animal/${relacion.id}`).then((res) => {
      // Obtener el animal eliminado de la lista de animales vacunados
      const removedAnimal = filteredAnimales.find(animal => animal.id === idAnimal);

      // Actualizar la lista de animales vacunados
      setFilteredAnimales(filteredAnimales.filter(animal => animal.id !== idAnimal));

      // Actualizar la lista de todos los animales de la explotación
      setAllAnimales([...allAnimales, removedAnimal]);

      // Actualizar la lista de animales vacunados en la relación
      setFilteredAnimalesVacunados(filteredAnimalesVacunados.filter(av => av.id_animal !== idAnimal));

      setError("");
    }).catch((err) => {
      setError("Error al eliminar el animal.");
    });
  };

  // Manejar búsqueda de animales
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAnimalesVacunadosSearch = filteredAnimales.filter(animal =>
    animal.identificacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAnimalesNoVacunadosSearch = allAnimales.filter(animal =>
    animal.identificacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastVacunado = currentPageVacunados * itemsPerPage;
  const indexOfFirstVacunado = indexOfLastVacunado - itemsPerPage;
  const currentVacunados = filteredAnimalesVacunadosSearch.slice(indexOfFirstVacunado, indexOfLastVacunado);

  const indexOfLastNoVacunado = currentPageNoVacunados * itemsPerPage;
  const indexOfFirstNoVacunado = indexOfLastNoVacunado - itemsPerPage;
  const currentNoVacunados = filteredAnimalesNoVacunadosSearch.slice(indexOfFirstNoVacunado, indexOfLastNoVacunado);

  const paginateVacunados = (pageNumber) => setCurrentPageVacunados(pageNumber);
  const paginateNoVacunados = (pageNumber) => setCurrentPageNoVacunados(pageNumber);

  // Verificar si el usuario tiene acceso al titular
  if (!titular || !vacuna) {
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
      <h1>Animales vacunados por {vacuna.nombre_comercial}</h1>
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
          {currentVacunados.map((animal) => (
            <tr key={animal.id}>
              <td>{animal.identificacion}</td>
              <td>{animal.especie}</td>
              <td>{animal.estado}</td>
              <td>{new Date(animal.fecha_nacimiento).toLocaleDateString()}</td>
              <td>{new Date(animal.fecha_alta).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleRemoveAnimal(animal.id)}>Eliminar de vacunación</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredAnimalesVacunadosSearch.length / itemsPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginateVacunados(i + 1)} className={currentPageVacunados === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>

      <h1>Animales sin la vacuna {vacuna.nombre_comercial}</h1>
      <table className="animales-explotacion-table">
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
          {currentNoVacunados.map((animal) => (
            <tr key={animal.id}>
              <td>{animal.identificacion}</td>
              <td>{animal.especie}</td>
              <td>{animal.estado}</td>
              <td>{new Date(animal.fecha_nacimiento).toLocaleDateString()}</td>
              <td>{new Date(animal.fecha_alta).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleAddAnimal(animal.id)}>Añadir a vacunación</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredAnimalesNoVacunadosSearch.length / itemsPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginateNoVacunados(i + 1)} className={currentPageNoVacunados === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default VacunacionAnimales;