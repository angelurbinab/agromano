const pool = require('./db');

/**
 * @description Obtiene todos los movimientos registrados en la base de datos.
 * @returns {Promise<Array>} Una lista de todos los movimientos.
 */
const getMovimientos = async () => {
  const res = await pool.query('SELECT * FROM movimiento');
  return res.rows;
};

/**
 * @description Obtiene un movimiento específico por su ID.
 * @param {number} id ID del movimiento.
 * @returns {Promise<Object>} El movimiento correspondiente al ID proporcionado.
 */
const getMovimientoById = async (id) => {
  const res = await pool.query('SELECT * FROM movimiento WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Crea un nuevo movimiento en la base de datos.
 * @param {Object} movimiento Objeto con los datos del movimiento ({ tipo, fecha, motivo, procedencia_destino, id_animal }).
 * @returns {Promise<Object>} El movimiento creado.
 */
const createMovimiento = async (movimiento) => {
  const { tipo, fecha, motivo, procedencia_destino, id_animal } = movimiento;
  const res = await pool.query(
    'INSERT INTO movimiento (tipo, fecha, motivo, procedencia_destino, id_animal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [tipo, fecha, motivo, procedencia_destino, id_animal]
  );
  return res.rows[0];
};

/**
 * @description Actualiza los datos de un movimiento existente en la base de datos.
 * @param {number} id ID del movimiento a actualizar.
 * @param {Object} movimiento Objeto con los datos actualizados del movimiento ({ tipo, fecha, motivo, procedencia_destino, id_animal }).
 * @returns {Promise<Object>} El movimiento actualizado.
 */
const updateMovimiento = async (id, movimiento) => {
  const { tipo, fecha, motivo, procedencia_destino, id_animal } = movimiento;
  const res = await pool.query(
    'UPDATE movimiento SET tipo = $1, fecha = $2, motivo = $3, procedencia_destino = $4, id_animal = $5 WHERE id = $6 RETURNING *',
    [tipo, fecha, motivo, procedencia_destino, id_animal, id]
  );
  return res.rows[0];
};

/**
 * @description Elimina un movimiento específico por su ID.
 * @param {number} id ID del movimiento a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteMovimiento = async (id) => {
  await pool.query('DELETE FROM movimiento WHERE id = $1', [id]);
};

module.exports = {
  getMovimientos,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
};