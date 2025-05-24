import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './ActualizarExplotacion.css';

/**
 * @description Componente para actualizar los datos de una explotación.
 * Permite al usuario modificar los datos de una explotación existente si tiene acceso.
 * @returns {JSX.Element} Formulario para actualizar la explotación.
 */
function ActualizarExplotacion() {
  const { id } = useParams();
  const { idExplotacion } = useParams();
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [especies, setEspecies] = useState("");
  const [coordenadas, setCoordenadas] = useState("");
  const [idTitular, setIdTitular] = useState("");
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Cargar datos de la explotación y del titular al montar el componente
  useEffect(() => {
    axios.get(`http://localhost:5000/api/explotaciones/${idExplotacion}`).then((res) => {
      const explotacion = res.data;
      setCodigo(explotacion.codigo);
      setNombre(explotacion.nombre);
      setDireccion(explotacion.direccion);
      setLocalidad(explotacion.localidad);
      setProvincia(explotacion.provincia);
      setCodigoPostal(explotacion.codigo_postal);
      setEspecies(explotacion.especies);
      setCoordenadas(explotacion.coordenadas);
      setIdTitular(explotacion.id_titular);
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });
  }, [id, idExplotacion]);

  // Validar formulario antes de enviar
  const validateForm = () => {
    return codigo && nombre && direccion && localidad && provincia && codigoPostal && especies && coordenadas;
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }
    setErrorMessage("");
    axios.put(`http://localhost:5000/api/explotaciones/${idExplotacion}`, {
      codigo,
      nombre,
      direccion,
      localidad,
      provincia,
      codigoPostal,
      especies,
      coordenadas,
      id_titular: idTitular,
    }).then((res) => {
      console.log(res.data);
      navigate(`/titulares/${idTitular}/explotaciones`);
    });
  };
  
  // Verificar si el usuario tiene acceso a la explotación
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
    <div className="actualizar-explotacion-container">
      <h1>Actualizar Explotación</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    <form onSubmit={handleSubmit} className="actualizar-explotacion-form">
      <input
        type="text"
        placeholder="Código"
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
      <input
        type="text"
        placeholder="ID Titular"
        value={idTitular}
        onChange={(e) => setIdTitular(e.target.value)}
        readOnly
      />
      <button type="submit">Actualizar Explotación</button>
    </form>
    </div>
  );
}

export default ActualizarExplotacion;