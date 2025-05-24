import { useEffect, useState } from "react";
import axios from "axios";

function EliminarUsuario() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/usuarios").then((res) => {
      setUsuarios(res.data);
    });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/usuarios/${id}`).then((res) => {
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    });
  };

  return (
    <div>
      <h1>Eliminar Usuario</h1>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.nombre_usuario}
            <button onClick={() => handleDelete(usuario.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EliminarUsuario;