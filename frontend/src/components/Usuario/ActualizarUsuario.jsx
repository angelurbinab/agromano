import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

/**
 * @description Componente para actualizar los datos de un usuario.
 * Permite al usuario modificar su información personal, como nombre, empresa, email y contraseña.
 * @returns {JSX.Element} Formulario para actualizar un usuario.
 */
function ActualizarUsuario() {
  const { id } = useParams();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    axios.get(`http://localhost:5000/api/usuarios/${id}`).then((res) => {
      const usuario = res.data;
      setNombreUsuario(usuario.nombre_usuario);
      setNombreEmpresa(usuario.nombre_empresa);
      setEmail(usuario.email);
      setContrasena(usuario.contrasena_hash);
    });
  }, [id]);

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/usuarios/${id}`, {
      nombre_usuario: nombreUsuario,
      nombre_empresa: nombreEmpresa,
      email: email,
      contrasena_hash: contrasena,
    }).then((res) => {
      console.log(res.data);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre de Usuario"
        value={nombreUsuario}
        onChange={(e) => setNombreUsuario(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nombre de Empresa"
        value={nombreEmpresa}
        onChange={(e) => setNombreEmpresa(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />
      <button type="submit">Actualizar Usuario</button>
    </form>
  );
}

export default ActualizarUsuario;