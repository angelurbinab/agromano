// filepath: /c:/Users/angel/Desktop/Escuela/TFG/Agromano/frontend/src/components/Usuario/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

/**
 * @description Componente para el registro de nuevos usuarios.
 * Permite a los usuarios crear una cuenta proporcionando su nombre, empresa, email y contraseña.
 * @returns {JSX.Element} Formulario de registro.
 */
function Register() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  /**
   * @description Maneja el envío del formulario de registro.
   * Realiza una solicitud al servidor para registrar un nuevo usuario.
   * @param {Event} e Evento del formulario.
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', { nombre_usuario: nombreUsuario, nombre_empresa: nombreEmpresa, email, contrasena });
      setMessage(res.data.message);
      navigate('/login');
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="register-container">
      <h1>Registro</h1>
      <form onSubmit={handleRegister} className="register-form">
        <input type="text" placeholder="Nombre de Usuario" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
        <input type="text" placeholder="Nombre de Empresa" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} 
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número."
          required/>
        <button type="submit">Registrarse</button>
      </form>
      {message && <p className="register-message">{message}</p>}
    </div>
  );
}

export default Register;