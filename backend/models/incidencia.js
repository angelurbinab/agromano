const pool = require('./db');

/**
 * @description Obtiene todas las incidencias registradas en la base de datos.
 * @returns {Promise<Array>} Una lista de todas las incidencias.
 */
const getIncidencias = async () => {
  const res = await pool.query('SELECT * FROM incidencia');
  return res.rows;
};

/**
 * @description Obtiene una incidencia específica por su ID.
 * @param {number} id ID de la incidencia.
 * @returns {Promise<Object>} La incidencia correspondiente al ID proporcionado.
 */
const getIncidenciaById = async (id) => {
  const res = await pool.query('SELECT * FROM incidencia WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Crea una nueva incidencia en la base de datos.
 * @param {Object} incidencia Objeto con los datos de la incidencia ({ fecha, descripcion, codigo_anterior, codigo_actual, id_animal }).
 * @returns {Promise<Object>} La incidencia creada.
 */
const createIncidencia = async (incidencia) => {
  const { fecha, descripcion, codigo_anterior, codigo_actual, id_animal } = incidencia;
  const res = await pool.query(
    'INSERT INTO incidencia (fecha, descripcion, codigo_anterior, codigo_actual, id_animal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [fecha, descripcion, codigo_anterior, codigo_actual, id_animal]
  );
  return res.rows[0];
};

/**
 * @description Actualiza los datos de una incidencia existente en la base de datos.
 * @param {number} id ID de la incidencia a actualizar.
 * @param {Object} incidencia Objeto con los datos actualizados de la incidencia ({ fecha, descripcion, codigo_anterior, codigo_actual, id_animal }).
 * @returns {Promise<Object>} La incidencia actualizada.
 */
const updateIncidencia = async (id, incidencia) => {
  const { fecha, descripcion, codigo_anterior, codigo_actual, id_animal } = incidencia;
  const res = await pool.query(
    'UPDATE incidencia SET fecha = $1, descripcion = $2, codigo_anterior = $3, codigo_actual = $4, id_animal = $5 WHERE id = $6 RETURNING *',
    [fecha, descripcion, codigo_anterior, codigo_actual, id_animal, id]
  );
  return res.rows[0];
};

/**
 * @description Elimina una incidencia específica por su ID.
 * @param {number} id ID de la incidencia a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteIncidencia = async (id) => {
  await pool.query('DELETE FROM incidencia WHERE id = $1', [id]);
};

module.exports = {
  getIncidencias,
  getIncidenciaById,
  createIncidencia,
  updateIncidencia,
  deleteIncidencia,
};