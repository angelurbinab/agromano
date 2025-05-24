const pool = require('./db');

/**
 * @description Obtiene todas las vacunaciones registradas en la base de datos.
 * @returns {Promise<Array>} Una lista de todas las vacunaciones.
 */
const getVacunaciones = async () => {
  const res = await pool.query('SELECT * FROM vacunacion');
  return res.rows;
};

/**
 * @description Obtiene una vacunación específica por su ID.
 * @param {number} id ID de la vacunación.
 * @returns {Promise<Object>} La vacunación correspondiente al ID proporcionado.
 */
const getVacunacionById = async (id) => {
  const res = await pool.query('SELECT * FROM vacunacion WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Obtiene una vacunación específica por su combinación de fecha, tipo y explotación.
 * @param {string} fecha Fecha de la vacunación.
 * @param {string} tipo Tipo de la vacunación.
 * @param {number} id_explotacion ID de la explotación asociada.
 * @returns {Promise<Object>} La vacunación correspondiente a la combinación proporcionada.
 */
const getVacunacionByPareja = async (fecha, tipo, id_explotacion) => {
  const query = 'SELECT * FROM vacunacion WHERE fecha = $1 AND tipo = $2 AND id_explotacion = $3';
  const result = await pool.query(query, [fecha, tipo, id_explotacion]);
  return result.rows[0];
};

/**
 * @description Crea una nueva vacunación en la base de datos.
 * @param {Object} vacunacion Objeto con los datos de la vacunación ({ fecha, tipo, dosis, nombre_comercial, veterinario, id_explotacion }).
 * @returns {Promise<Object>} La vacunación creada.
 */
const createVacunacion = async (vacunacion) => {
  const { fecha, tipo, dosis, nombre_comercial, veterinario, id_explotacion } = vacunacion;
  const res = await pool.query(
    'INSERT INTO vacunacion (fecha, tipo, dosis, nombre_comercial, veterinario, id_explotacion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [fecha, tipo, dosis, nombre_comercial, veterinario, id_explotacion]
  );
  return res.rows[0];
};

/**
 * @description Actualiza los datos de una vacunación existente en la base de datos.
 * @param {number} id ID de la vacunación a actualizar.
 * @param {Object} vacunacion Objeto con los datos actualizados de la vacunación ({ fecha, tipo, dosis, nombre_comercial, veterinario, id_explotacion }).
 * @returns {Promise<Object>} La vacunación actualizada.
 */
const updateVacunacion = async (id, vacunacion) => {
  const { fecha, tipo, dosis, nombre_comercial, veterinario, id_explotacion } = vacunacion;
  const res = await pool.query(
    'UPDATE vacunacion SET fecha = $1, tipo = $2, dosis = $3, nombre_comercial = $4, veterinario = $5, id_explotacion = $6 WHERE id = $7 RETURNING *',
    [fecha, tipo, dosis, nombre_comercial, veterinario, id_explotacion, id]
  );
  return res.rows[0];
};

/**
 * @description Elimina una vacunación específica por su ID.
 * @param {number} id ID de la vacunación a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteVacunacion = async (id) => {
  await pool.query('DELETE FROM vacunacion WHERE id = $1', [id]);
};

module.exports = {
  getVacunaciones,
  getVacunacionById,
  getVacunacionByPareja,
  createVacunacion,
  updateVacunacion,
  deleteVacunacion,
};