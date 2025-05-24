import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './CrearExplotacion.css';

/**
 * @description Componente para crear una nueva explotación.
 * Permite al usuario registrar una explotación si tiene acceso.
 * @returns {JSX.Element} Formulario para crear una explotación.
 */
function CrearExplotacion() {
  const { id } = useParams();
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [especies, setEspecies] = useState("");
  const [coordenadas, setCoordenadas] = useState("");
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Cargar datos del titular al montar el componente
  useEffect(() => {   
    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });
  }, [id]);

  // Validar formulario antes de enviar
  const validateForm = () => {
    const codigoRegex = /^ES\d{12}$/;
    if (!codigoRegex.test(codigo)) {
      return "El código debe comenzar con 'ES' seguido de 12 dígitos.";
    }
    if (!codigo || !nombre || !direccion || !localidad || !provincia || !codigoPostal || !especies || !coordenadas) {
      return "Todos los campos son obligatorios.";
    }
    return ""; // Sin errores
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setErrorMessage(error); // Mostrar el mensaje de error devuelto por validateForm
      return;
    }
    setErrorMessage("");
    axios.post("http://localhost:5000/api/explotaciones", {
      codigo,
      nombre,
      direccion,
      localidad,
      provincia,
      codigoPostal,
      especies,
      coordenadas,
      id_titular: titular.id,
    }).then((res) => {
      console.log(res.data);
      navigate(`/titulares/${titular.id}/explotaciones`);
    });
  };

  // Verificar si el usuario tiene acceso al titular
  if (!titular) {
    return  (<div className="explotaciones-container">
      <h1>Cargando...</h1>
      </div>);
  }

  if(user.id !== titular.id_usuario){
    return  (<div className="explotacion-detalles-container">
      <div className="error-message">
      <img src="/angry_farmer.png" alt="Angry Farmer" />
      <p>¡Vaya! Parece que has intentado acceder a un recurso que no es tuyo. Agromano vela por la seguridad del cliente, utiliza la aplicación con propiedad.</p>
      </div>
      </div>);
  }

  return (
    <div className="crear-explotacion-container">
      <h1>Crear Explotación</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className = "crear-explotacion-form">
        <input
          type="text"
          placeholder="Código REGA"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Localidad"
          value={localidad}
          onChange={(e) => setLocalidad(e.target.value)}
        />
        <input
          type="text"
          placeholder="Provincia"
          value={provincia}
          onChange={(e) => setProvincia(e.target.value)}
        />
        <input
          type="text"
          placeholder="Código Postal"
          value={codigoPostal}
          onChange={(e) => setCodigoPostal(e.target.value)}
        />
        <input
          type="text"
          placeholder="Especies"
          value={especies}
          onChange={(e) => setEspecies(e.target.value)}
        />
        <input
          type="text"
          placeholder="Coordenadas"
          value={coordenadas}
          onChange={(e) => setCoordenadas(e.target.value)}
        />
        <button type="submit">Crear Explotación</button>
      </form>
  </div>
  );
}

export default CrearExplotacion;