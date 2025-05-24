const pool = require('./db');

/**
 * @description Obtiene todas las explotaciones registradas en la base de datos.
 * @returns {Promise<Array>} Una lista de todas las explotaciones.
 */
const getExplotaciones = async () => {
  const res = await pool.query('SELECT * FROM explotacion');
  return res.rows;
};

/**
 * @description Obtiene una explotación específica por su ID.
 * @param {number} id ID de la explotación.
 * @returns {Promise<Object>} La explotación correspondiente al ID proporcionado.
 */
const getExplotacionById = async (id) => {
  const res = await pool.query('SELECT * FROM explotacion WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Crea una nueva explotación en la base de datos.
 * @param {Object} explotacion Objeto con los datos de la explotación ({ codigo, nombre, direccion, localidad, provincia, codigo_postal, especies, coordenadas, id_titular }).
 * @returns {Promise<Object>} La explotación creada.
 */
const createExplotacion = async (explotacion) => {
  const { codigo, nombre, direccion, localidad, provincia, codigo_postal, especies, coordenadas, id_titular } = explotacion;
  const res = await pool.query(
    'INSERT INTO explotacion (codigo, nombre, direccion, localidad, provincia, codigo_postal, especies, coordenadas, id_titular) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [codigo, nombre, direccion, localidad, provincia, codigo_postal, especies, coordenadas, id_titular]
  );
  return res.rows[0];
};

/**
 * @description Actualiza los datos de una explotación existente en la base de datos.
 * @param {number} id ID de la explotación a actualizar.
 * @param {Object} explotacion Objeto con los datos actualizados de la explotación ({ codigo, nombre, direccion, localidad, provincia, codigo_postal, especies, coordenadas, id_titular }).
 * @returns {Promise<Object>} La explotación actualizada.
 */
const updateExplotacion = async (id, explotacion) => {
  const { codigo, nombre, direccion, localidad, provincia, codigo_postal, especies, coordenadas, id_titular } = explotacion;
  const res = await pool.query(
    'UPDATE explotacion SET codigo = $1, nombre = $2, direccion = $3, localidad = $4, provincia = $5, codigo_postal = $6, especies = $7, coordenadas = $8, id_titular = $9 WHERE id = $10 RETURNING *',
    [codigo, nombre, direccion, localidad, provincia, codigo_postal, especies, coordenadas, id_titular, id]
  );
  return res.rows[0];
};

/**
 * @description Elimina una explotación específica por su ID.
 * @param {number} id ID de la explotación a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteExplotacion = async (id) => {
  await pool.query('DELETE FROM explotacion WHERE id = $1', [id]);
};

module.exports = {
  getExplotaciones,
  getExplotacionById,
  createExplotacion,
  updateExplotacion,
  deleteExplotacion,
};