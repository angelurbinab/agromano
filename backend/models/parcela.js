const pool = require('./db');

/**
 * @description Obtiene todas las parcelas registradas en la base de datos.
 * @returns {Promise<Array>} Una lista de todas las parcelas.
 */
const getParcelas = async () => {
  const res = await pool.query('SELECT * FROM parcela');
  return res.rows;
};

/**
 * @description Obtiene una parcela específica por su ID.
 * @param {number} id ID de la parcela.
 * @returns {Promise<Object>} La parcela correspondiente al ID proporcionado.
 */
const getParcelaById = async (id) => {
  const res = await pool.query('SELECT * FROM parcela WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Crea una nueva parcela en la base de datos.
 * @param {Object} parcela Objeto con los datos de la parcela ({ coordenadas, extension, id_explotacion }).
 * @returns {Promise<Object>} La parcela creada.
 */
const createParcela = async (parcela) => {
  const { coordenadas, extension, id_explotacion } = parcela;
  const res = await pool.query(
    'INSERT INTO parcela (coordenadas, extension, id_explotacion) VALUES ($1, $2, $3) RETURNING *',
    [coordenadas, extension, id_explotacion]
  );
  return res.rows[0];
};

/**
 * @description Actualiza los datos de una parcela existente en la base de datos.
 * @param {number} id ID de la parcela a actualizar.
 * @param {Object} parcela Objeto con los datos actualizados de la parcela ({ coordenadas, extension, id_explotacion }).
 * @returns {Promise<Object>} La parcela actualizada.
 */
const updateParcela = async (id, parcela) => {
  const { coordenadas, extension, id_explotacion } = parcela;
  const res = await pool.query(
    'UPDATE parcela SET coordenadas = $1, extension = $2, id_explotacion = $3 WHERE id = $4 RETURNING *',
    [coordenadas, extension, id_explotacion, id]
  );
  return res.rows[0];
};

/**
 * @description Elimina una parcela específica por su ID.
 * @param {number} id ID de la parcela a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteParcela = async (id) => {
  await pool.query('DELETE FROM parcela WHERE id = $1', [id]);
};

module.exports = {
  getParcelas,
  getParcelaById,
  createParcela,
  updateParcela,
  deleteParcela,
};