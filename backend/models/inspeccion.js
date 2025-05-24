const pool = require('./db');

/**
 * @description Obtiene todas las inspecciones registradas en la base de datos.
 * @returns {Promise<Array>} Una lista de todas las inspecciones.
 */
const getInspecciones = async () => {
  const res = await pool.query('SELECT * FROM inspeccion');
  return res.rows;
};

/**
 * @description Obtiene una inspección específica por su ID.
 * @param {number} id ID de la inspección.
 * @returns {Promise<Object>} La inspección correspondiente al ID proporcionado.
 */
const getInspeccionById = async (id) => {
  const res = await pool.query('SELECT * FROM inspeccion WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Obtiene una inspección específica por su número de acta y explotación.
 * @param {string} numero_acta Número de acta de la inspección.
 * @param {number} id_explotacion ID de la explotación asociada.
 * @returns {Promise<Object>} La inspección correspondiente al número de acta y explotación.
 */
const getInspeccionByActa = async (numero_acta, id_explotacion) => {
  const query = 'SELECT * FROM inspeccion WHERE numero_acta = $1 AND id_explotacion = $2';
  const result = await pool.query(query, [numero_acta, id_explotacion]);
  return result.rows[0];
};

/**
 * @description Crea una nueva inspección en la base de datos.
 * @param {Object} inspeccion Objeto con los datos de la inspección ({ fecha, oficial, tipo, numero_acta, id_explotacion }).
 * @returns {Promise<Object>} La inspección creada.
 */
const createInspeccion = async (inspeccion) => {
  const { fecha, oficial, tipo, numero_acta, id_explotacion } = inspeccion;
  const res = await pool.query(
    'INSERT INTO inspeccion (fecha, oficial, tipo, numero_acta, id_explotacion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [fecha, oficial, tipo, numero_acta, id_explotacion]
  );
  return res.rows[0];
};

/**
 * @description Actualiza los datos de una inspección existente en la base de datos.
 * @param {number} id ID de la inspección a actualizar.
 * @param {Object} inspeccion Objeto con los datos actualizados de la inspección ({ fecha, oficial, tipo, numero_acta, id_explotacion }).
 * @returns {Promise<Object>} La inspección actualizada.
 */
const updateInspeccion = async (id, inspeccion) => {
  const { fecha, oficial, tipo, numero_acta, id_explotacion } = inspeccion;
  const res = await pool.query(
    'UPDATE inspeccion SET fecha = $1, oficial = $2, tipo = $3, numero_acta = $4, id_explotacion = $5 WHERE id = $6 RETURNING *',
    [fecha, oficial, tipo, numero_acta, id_explotacion, id]
  );
  return res.rows[0];
};

/**
 * @description Elimina una inspección específica por su ID.
 * @param {number} id ID de la inspección a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteInspeccion = async (id) => {
  await pool.query('DELETE FROM inspeccion WHERE id = $1', [id]);
};

module.exports = {
  getInspecciones,
  getInspeccionById,
  getInspeccionByActa,
  createInspeccion,
  updateInspeccion,
  deleteInspeccion,
};