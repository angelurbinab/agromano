import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Perfil.css';

/**
 * @description Componente para gestionar el perfil del usuario.
 * Permite al usuario actualizar su información personal, cerrar sesión o eliminar su cuenta.
 * @returns {JSX.Element} Interfaz para gestionar el perfil del usuario.
 */
function Perfil() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { setUser } = useContext(AuthContext);
  const [nombre_usuario, setNombreUsuario] = useState("");
  const [nombre_empresa, setNombreEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    axios.get(`http://localhost:5000/api/usuarios/${id}`).then((res) => {
      const usuario = res.data;
      setNombreUsuario(usuario.nombre_usuario);
      setNombreEmpresa(usuario.nombre_empresa);
      setEmail(usuario.email);
    });
  }, [id]);

  // Validar formulario antes de enviar
  const validateForm = () => {
    return nombre_usuario.length > 0 && nombre_empresa.length > 0 && email.length > 0;
  };

  // Manejar la actualización del perfil
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }
    setErrorMessage("");
    const usuarioData = {
        nombre_usuario,
        nombre_empresa,
        email,
      };
  
      if (contrasena) {
        usuarioData.contrasena = contrasena;
      }
    axios.put(`http://localhost:5000/api/usuarios/${id}`,usuarioData).then((res) => {
      console.log(res.data);
      navigate('/');
    }).catch((error) => {
      setErrorMessage(error.response.data.message);
    });
  };

  // Manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Manejar la eliminación del usuario
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar tu usuario? Todos los datos asociados al usuario serán eliminados.`);
    if (confirmDelete) {
      const doubleConfirm = prompt(`Para confirmar la eliminación del usuario, escribe la palabra "eliminar".`);
      if (doubleConfirm && doubleConfirm.toLowerCase() === "eliminar") {
    try{ 
    await axios.delete(`http://localhost:5000/api/usuarios/${id}`, {}, { withCredentials: true });
    handleLogout();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
    } else {
      alert("La eliminación ha sido cancelada. No escribiste la palabra correcta.");
    }
    }
  };

  // Verificar si el usuario tiene acceso a su perfil
  if (!user) {
    return (
      <div className="explotaciones-container">
        <h1>Cargando...</h1>
      </div>
    );
  }

  if (id !== String(user.id)) {
    return  (<div className="titular-detalles-container">
            <div className="error-message">
            <img src="/angry_farmer.png" alt="Angry Farmer" />
            <p>¡Vaya! Parece que has intentado acceder a un recurso que no es tuyo. Agromano vela por la seguridad del cliente, utiliza la aplicación con propiedad.</p>
            </div>
            </div>);
  }

  return (
    <div className="perfil-container">
    <h1>Actualizar Usuario</h1>
    {errorMessage && <p className="error-message">{errorMessage}</p>}
  <form onSubmit={handleSubmit} className="perfil-form">
    <input
      type="text"
      placeholder="Nombre de usuario"
      value={nombre_usuario}
      onChange={(e) => setNombreUsuario(e.target.value)}
    />
    <input
      type="text"
      placeholder="Nombre de la empresa"
      value={nombre_empresa}
      onChange={(e) => setNombreEmpresa(e.target.value)}
    />
    <input
      type="text"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      type="password"
      placeholder="Nueva Contraseña"
      value={contrasena}
      onChange={(e) => setContrasena(e.target.value)}
      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
      title="La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número."
    />
    <button type="submit">Actualizar Usuario</button>
  </form>

    <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>  
    <button onClick={() => handleDelete(id)} className="delete-button">Eliminar usuario</button>
  </div>
  );
}

export default Perfil;