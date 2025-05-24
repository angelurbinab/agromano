const pool = require('./db');

/**
 * @description Obtiene todas las alimentaciones registradas en la base de datos.
 * @returns {Promise<Array>} Una lista de todas las alimentaciones.
 */
const getAlimentaciones = async () => {
  const res = await pool.query('SELECT * FROM alimentacion');
  return res.rows;
};

/**
 * @description Obtiene una alimentación específica por su ID.
 * @param {number} id ID de la alimentación.
 * @returns {Promise<Object>} La alimentación correspondiente al ID proporcionado.
 */
const getAlimentacionById = async (id) => {
  const res = await pool.query('SELECT * FROM alimentacion WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Obtiene una alimentación específica por su factura y explotación.
 * @param {string} factura Número de factura de la alimentación.
 * @param {number} id_explotacion ID de la explotación asociada.
 * @returns {Promise<Object>} La alimentación correspondiente a la factura y explotación.
 */
const getAlimentacionByFactura = async (factura, id_explotacion) => {
  const query = 'SELECT * FROM alimentacion WHERE factura = $1 AND id_explotacion = $2';
  const result = await pool.query(query, [factura, id_explotacion]);
  return result.rows[0];
};

/**
 * @description Crea una nueva alimentación en la base de datos.
 * @param {Object} alimentacion Objeto con los datos de la alimentación ({ fecha, tipo, cantidad, lote, id_explotacion, factura }).
 * @returns {Promise<Object>} La alimentación creada.
 */
const createAlimentacion = async (alimentacion) => {
  const { fecha, tipo, cantidad, lote, id_explotacion, factura } = alimentacion;
  const res = await pool.query(
    'INSERT INTO alimentacion (fecha, tipo, cantidad, lote, id_explotacion, factura) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [fecha, tipo, cantidad, lote, id_explotacion, factura]
  );
  return res.rows[0];
};

/**
 * @description Actualiza una alimentación existente en la base de datos.
 * @param {number} id ID de la alimentación a actualizar.
 * @param {Object} alimentacion Objeto con los datos actualizados de la alimentación ({ fecha, tipo, cantidad, lote, id_explotacion, factura }).
 * @returns {Promise<Object>} La alimentación actualizada.
 */
const updateAlimentacion = async (id, alimentacion) => {
  const { fecha, tipo, cantidad, lote, id_explotacion, factura } = alimentacion;
  const res = await pool.query(
    'UPDATE alimentacion SET fecha = $1, tipo = $2, cantidad = $3, lote = $4, id_explotacion = $5, factura = $6 WHERE id = $7 RETURNING *',
    [fecha, tipo, cantidad, lote, id_explotacion, factura, id]
  );
  return res.rows[0];
};

/**
 * @description Elimina una alimentación específica por su ID.
 * @param {number} id ID de la alimentación a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteAlimentacion = async (id) => {
  await pool.query('DELETE FROM alimentacion WHERE id = $1', [id]);
};

module.exports = {
  getAlimentaciones,
  getAlimentacionById,
  createAlimentacion,
  updateAlimentacion,
  deleteAlimentacion,
  getAlimentacionByFactura,
};