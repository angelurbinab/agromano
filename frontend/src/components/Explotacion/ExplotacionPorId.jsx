import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import './ExplotacionPorId.css';

/**
 * @description Componente para mostrar los detalles de una explotación específica.
 * Permite al usuario acceder a secciones relacionadas como parcelas, medicamentos, alimentación, inspecciones, animales y vacunaciones.
 * @returns {JSX.Element} Detalles de la explotación y enlaces a secciones relacionadas.
 */
function ExplotacionPorId() {
  const { id } = useParams();
  const { idExplotacion } = useParams();
  const [explotacion, setExplotacion] = useState(null);
  const { user } = useContext(AuthContext);
  const [titular, setTitular] = useState(null);

  // Cargar datos de la explotación y del titular al montar el componente
  useEffect(() => {
    axios.get(`http://localhost:5000/api/explotaciones/${idExplotacion}`).then((res) => {
      setExplotacion(res.data);
    });

    axios.get(`http://localhost:5000/api/titulares/${id}`).then((res) => {
      setTitular(res.data);
    });
  }, [id, idExplotacion]);

  // Verificar si el usuario tiene acceso al titular
  if (!explotacion || !titular) {
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
    <div className = "explotacion-detalles-container">
      <h1>Detalles de la Explotación</h1>
      <ul className="explotacion-detalles-list">
        <li><strong>Código:</strong> {explotacion.codigo}</li>
        <li><strong>Nombre:</strong> {explotacion.nombre}</li>
        <li><strong>Dirección:</strong> {explotacion.direccion}</li>
        <li><strong>Localidad:</strong> {explotacion.localidad}</li>
        <li><strong>Provincia:</strong> {explotacion.provincia}</li>
        <li><strong>Código Postal:</strong> {explotacion.codigo_postal}</li>
        <li><strong>Especies:</strong> {explotacion.especies}</li>
        <li><strong>Coordenadas:</strong> {explotacion.coordenadas}</li>
        <li><strong>ID Titular:</strong> {explotacion.id_titular}</li>
      </ul>
      <div className="cards-container">
        <Link to={`/titulares/${id}/explotaciones/${idExplotacion}/parcelas`} className="card">
          <div className="card-icon">
            <img src="/parcelas.png" alt="Parcelas" />
          </div>
          <div className="card-content">
            <h3>Parcelas</h3>
            <p>Accede a las parcelas de esta explotación.</p>
          </div>
        </Link>
        <Link to={`/titulares/${id}/explotaciones/${idExplotacion}/medicamentos`} className="card">
          <div className="card-icon">
            <img src="/medicamentos.png" alt="Medicamentos" />
          </div>
          <div className="card-content">
            <h3>Medicamentos</h3>
            <p>Accede a los compras de medicamentos de esta explotación.</p>
          </div>
        </Link>
        <Link to={`/titulares/${id}/explotaciones/${idExplotacion}/alimentaciones`} className="card">
          <div className="card-icon">
            <img src="/alimentacion.png" alt="Alimentacion" />
          </div>
          <div className="card-content">
            <h3>Alimentación</h3>
            <p>Accede a las compras de alimentación de esta explotación.</p>
          </div>
        </Link>
        <Link to={`/titulares/${id}/explotaciones/${idExplotacion}/inspecciones`} className="card">
          <div className="card-icon">
            <img src="/inspeccion.png" alt="Inspeccion" />
          </div>
          <div className="card-content">
            <h3>Inspección</h3>
            <p>Accede al historial de inspecciones de esta explotación.</p>
          </div>
        </Link>
        <Link to={`/titulares/${id}/explotaciones/${idExplotacion}/animales`} className="card">
          <div className="card-icon">
            <img src="/animal.png" alt="Animal" />
          </div>
          <div className="card-content">
            <h3>Animales</h3>
            <p>Accede al registro animal de esta explotación.</p>
          </div>
        </Link>
        <Link to={`/titulares/${id}/explotaciones/${idExplotacion}/vacunaciones`} className="card">
          <div className="card-icon">
            <img src="/vacunacion.png" alt="Vacunacion" />
          </div>
          <div className="card-content">
            <h3>Vacunaciones</h3>
            <p>Accede al registro de vacunaciones de esta explotación.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ExplotacionPorId;