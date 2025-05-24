import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './ActualizarTitular.css';

/**
 * @description Componente para actualizar los datos de un titular.
 * Permite al usuario modificar los datos de un titular si tiene acceso.
 * @returns {JSX.Element} Formulario para actualizar un titular.
 */
function ActualizarTitular() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [nif, setNif] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [telefono, setTelefono] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Cargar datos del titular al montar el componente
  useEffect(() => {
    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      const titular = res.data;
      setNombre(titular.nombre);
      setNif(titular.nif);
      setDomicilio(titular.domicilio);
      setLocalidad(titular.localidad);
      setProvincia(titular.provincia);
      setCodigoPostal(titular.codigo_postal);
      setTelefono(titular.telefono);
      setIdUsuario(titular.id_usuario);
    });
  }, [id]);

  // Validar formulario antes de enviar
  const validateForm = () => {
    return nombre && domicilio && nif && localidad && provincia && codigoPostal && telefono && idUsuario;
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }
    setErrorMessage("");
    axios.put(`http://localhost:5000/api/titulares/${id}`, {
      nombre,
      nif,
      domicilio,
      localidad,
      provincia,
      codigo_postal: codigoPostal,
      telefono,
      id_usuario: idUsuario,
    }).then((res) => {
      console.log(res.data);
      navigate('/titulares');
    }).catch((error) => {
      setErrorMessage(error.response.data.message);
    });
  };

  // Verificar si el usuario tiene acceso al titular
  if (idUsuario !== user.id) {
    return  (<div className="titular-detalles-container">
            <div className="error-message">
            <img src="/angry_farmer.png" alt="Angry Farmer" />
            <p>¡Vaya! Parece que has intentado acceder a un recurso que no es tuyo. Agromano vela por la seguridad del cliente, utiliza la aplicación con propiedad.</p>
            </div>
            </div>);
  }

  return (
    <div className="actualizar-titular-container">
      <h1>Actualizar Titular</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    <form onSubmit={handleSubmit} className="actualizar-titular-form">
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="text"
        placeholder="NIF"
        value={nif}
        readOnly
      />
      <input
        type="text"
        placeholder="Domicilio"
        value={domicilio}
        onChange={(e) => setDomicilio(e.target.value)}
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
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <input
        type="text"
        placeholder="ID Usuario"
        value={idUsuario}
        onChange={(e) => setIdUsuario(e.target.value)}
        readOnly
      />
      <button type="submit">Actualizar Titular</button>
    </form>
    </div>
  );
}

export default ActualizarTitular;