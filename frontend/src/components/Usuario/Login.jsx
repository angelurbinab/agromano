// filepath: /c:/Users/angel/Desktop/Escuela/TFG/Agromano/frontend/src/components/Usuario/Login.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Login.css';

/**
 * @description Componente para el inicio de sesión de usuarios.
 * Permite a los usuarios autenticarse proporcionando su email y contraseña.
 * @returns {JSX.Element} Formulario de inicio de sesión.
 */
function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  /**
   * @description Maneja el envío del formulario de inicio de sesión.
   * Realiza una solicitud al servidor para autenticar al usuario.
   * @param {Event} e Evento del formulario.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, contrasena }, { withCredentials: true });
      setMessage(res.data.message);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Inicio de sesión</h1>
      <form onSubmit={handleLogin} className="login-form">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
        <button type="submit">iniciar sesión</button>
      </form>
      {message && <p className="login-message">{message}</p>}
    </div>
  );
}

export default Login;