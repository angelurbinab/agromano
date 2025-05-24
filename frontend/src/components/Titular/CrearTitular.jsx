import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CrearTitular.css';

/**
 * @description Componente para crear un nuevo titular.
 * Permite al usuario registrar un titular asociado a su cuenta.
 * @returns {JSX.Element} Formulario para crear un titular.
 */
function CrearTitular() {
  const { user } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [nif, setNif] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Validar formulario antes de enviar
  const validateForm = () => {
    return nombre && domicilio && nif && localidad && provincia && codigoPostal && telefono;
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }
    setErrorMessage("");
    axios.post("http://localhost:5000/api/titulares", {
      nombre,
      nif,
      domicilio,
      localidad,
      provincia,
      codigoPostal,
      telefono,
      id_usuario: user.id,
    }).then((res) => {
      console.log(res.data);
      navigate('/titulares');
    }).catch((error) => {
      setErrorMessage(error.response.data.message);
    });
  };

  return (
    <div className="crear-titular-container">
      <h1>Crear Titular</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="crear-titular-form">
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
        onChange={(e) => setNif(e.target.value)}
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
      <button type="submit">Crear Titular</button>
    </form>
  </div>
  );
}

export default CrearTitular;