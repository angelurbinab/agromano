const pool = require('./db');

/**
 * @description Obtiene todos los medicamentos registrados en la base de datos.
 * @returns {Promise<Array>} Una lista de todos los medicamentos.
 */
const getMedicamentos = async () => {
  const res = await pool.query('SELECT * FROM medicamento');
  return res.rows;
};

/**
 * @description Obtiene un medicamento específico por su ID.
 * @param {number} id ID del medicamento.
 * @returns {Promise<Object>} El medicamento correspondiente al ID proporcionado.
 */
const getMedicamentoById = async (id) => {
  const res = await pool.query('SELECT * FROM medicamento WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Obtiene un medicamento específico por su factura y explotación.
 * @param {string} factura Número de factura del medicamento.
 * @param {number} id_explotacion ID de la explotación asociada.
 * @returns {Promise<Object>} El medicamento correspondiente a la factura y explotación.
 */
const getMedicamentoByFactura = async (factura, id_explotacion) => {
  const query = 'SELECT * FROM medicamento WHERE factura = $1 AND id_explotacion = $2';
  const result = await pool.query(query, [factura, id_explotacion]);
  return result.rows[0];
};

/**
 * @description Crea un nuevo medicamento en la base de datos.
 * @param {Object} medicamentoData Objeto con los datos del medicamento ({ fecha, receta, medicamento, id_explotacion, factura }).
 * @returns {Promise<Object>} El medicamento creado.
 */
const createMedicamento = async (medicamentoData) => {
  const { fecha, receta, medicamento, id_explotacion, factura } = medicamentoData;
  const res = await pool.query(
    'INSERT INTO medicamento (fecha, receta, medicamento, id_explotacion, factura) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [fecha, receta, medicamento, id_explotacion, factura]
  );
  return res.rows[0];
};

/**
 * @description Actualiza los datos de un medicamento existente en la base de datos.
 * @param {number} id ID del medicamento a actualizar.
 * @param {Object} medicamentoData Objeto con los datos actualizados del medicamento ({ fecha, receta, medicamento, id_explotacion, factura }).
 * @returns {Promise<Object>} El medicamento actualizado.
 */
const updateMedicamento = async (id, medicamentoData) => {
  const { fecha, receta, medicamento, id_explotacion, factura } = medicamentoData;
  const res = await pool.query(
    'UPDATE medicamento SET fecha = $1, receta = $2, medicamento = $3, id_explotacion = $4, factura = $5 WHERE id = $6 RETURNING *',
    [fecha, receta, medicamento, id_explotacion, factura, id]
  );
  return res.rows[0];
};

/**
 * @description Elimina un medicamento específico por su ID.
 * @param {number} id ID del medicamento a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteMedicamento = async (id) => {
  await pool.query('DELETE FROM medicamento WHERE id = $1', [id]);
};

module.exports = {
  getMedicamentos,
  getMedicamentoById,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento,
  getMedicamentoByFactura,
};