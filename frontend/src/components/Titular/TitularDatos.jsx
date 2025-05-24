import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import './TitularDatos.css';

/**
 * @description Componente para generar datos e informes de titulares.
 * Permite al usuario descargar datos en formato JSON o generar informes en PDF para un titular seleccionado.
 * @returns {JSX.Element} Interfaz para gestionar la generación de datos e informes.
 */
function TitularDatos() {
  const [titulares, setTitulares] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const [selectedTitular, setSelectedTitular] = useState(null);
  const [selectedNombreTitular, setSelectedNombreTitular] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Cargar titulares al montar el componente si el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      axios.get('http://localhost:5000/api/titulares', { withCredentials: true })
        .then((res) => {
          setTitulares(res.data);
        })
        .catch((error) => {
          console.error('Error al obtener los titulares:', error);
        });
    }
  }, [isAuthenticated]);

  /**
   * @description Descarga los datos de un titular en formato JSON.
   * @param {number} titularId ID del titular.
   * @param {string} titularNombre Nombre del titular.
   */
  const handleDownloadJSON = async (titularId, titularNombre) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/titulares/${titularId}/datos`);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${titularNombre}_datos.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error('Error al descargar los datos:', error);
    }
  };

  /**
   * @description Genera un informe PDF para un titular en un rango de fechas.
   * @param {number} titularId ID del titular.
   * @param {string} titularNombre Nombre del titular.
   */
  const handleGeneratePDF = async (titularId, titularNombre) => {
    if (!startDate || !endDate) {
      alert('Por favor, selecciona ambas fechas.');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/titulares/${titularId}/informe`, {
        startDate,
        endDate,
      }, { responseType: 'blob' });

      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", pdfUrl);
      downloadAnchorNode.setAttribute("download", `Informe_${titularNombre}.pdf`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error('Error al generar el informe PDF:', error);
    }
  };

  return (
    <div className="titulares-container">
      <h1>Generar cuaderno</h1>
      <ul className="titulares-list">
        {titulares.map((titular) => (
          <li key={titular.id}>
            <div className="titular-options">
              <span>{titular.nombre}</span>
              <button
                className="add-titular-button"
                onClick={() => handleDownloadJSON(titular.id, titular.nombre)}
              >
                Generar JSON
              </button>
              <button
                className="add-titular-button"
                onClick={() => {setSelectedTitular(titular.id); setSelectedNombreTitular(titular.nombre);}}
              >
                Generar PDF
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedTitular && (
        <div className="pdf-options">
          <h2>Generar informe PDF</h2>
          <label>
            Fecha de inicio:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            Fecha de fin:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button
            className="generate-pdf-button"
            onClick={() => handleGeneratePDF(selectedTitular, selectedNombreTitular)}
          >
            Generar PDF
          </button>
          <button
            className="cancel-button"
            onClick={() => setSelectedTitular(null)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

export default TitularDatos;