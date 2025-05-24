const movimientoModel = require('../models/movimiento');

/**
 * @description Obtiene todos los movimientos registrados en la base de datos.
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getMovimientos = async (req, res) => {
  const movimientos = await movimientoModel.getMovimientos();
  res.json(movimientos);
};

/**
 * @description Obtiene un movimiento específico por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getMovimientoById = async (req, res) => {
  const movimiento = await movimientoModel.getMovimientoById(req.params.id);
  res.json(movimiento);
};

/**
 * @description Crea un nuevo movimiento en la base de datos.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { tipo, fecha, motivo, procedencia_destino, id_animal } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const createMovimiento = async (req, res) => {
  const nuevoMovimiento = await movimientoModel.createMovimiento(req.body);
  res.status(201).json(nuevoMovimiento);
};

/**
 * @description Actualiza los datos de un movimiento existente.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y datos actualizados en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const updateMovimiento = async (req, res) => {
  const movimientoActualizado = await movimientoModel.updateMovimiento(req.params.id, req.body);
  res.json(movimientoActualizado);
};

/**
 * @description Elimina un movimiento específico por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const deleteMovimiento = async (req, res) => {
  await movimientoModel.deleteMovimiento(req.params.id);
  res.status(204).send();
};

module.exports = {
  getMovimientos,
  getMovimientoById,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
};