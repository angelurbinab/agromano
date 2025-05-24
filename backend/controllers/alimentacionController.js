const alimentacionModel = require('../models/alimentacion');

/**
 * @description Obtiene todas las alimentaciones de la base de datos.
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getAlimentaciones = async (req, res) => {
  const alimentaciones = await alimentacionModel.getAlimentaciones();
  res.json(alimentaciones);
};

/**
 * @description Obtiene una alimentación específica por su ID.
 * @param {Object} req Objeto de solicitud de Express
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getAlimentacionById = async (req, res) => {
  const alimentacion = await alimentacionModel.getAlimentacionById(req.params.id);
  res.json(alimentacion);
};

/**
 * @description Crea una nueva alimentación, validando que la factura no exista.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { factura, id_explotacion, ... })
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const createAlimentacion = async (req, res) => {
  const { factura, id_explotacion } = req.body;
  // Comprobar si la factura ya existe
  const alimentacionExistente = await alimentacionModel.getAlimentacionByFactura(factura, id_explotacion);
  if (alimentacionExistente) {
    return res.status(400).json({ message: 'La factura ya está en uso, no se pueden duplicar facturas' });
  }
  // Crear la nueva alimentación si la factura no existe
  const nuevaAlimentacion = await alimentacionModel.createAlimentacion(req.body);
  res.status(201).json(nuevaAlimentacion);
};

/**
 * @description Actualiza la información de una alimentación existente.
 * @param {Object} req Objeto de solicitud de Express (contiene { id } en params y datos en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const updateAlimentacion = async (req, res) => {
  const alimentacionActualizada = await alimentacionModel.updateAlimentacion(req.params.id, req.body);
  res.json(alimentacionActualizada);
};

/**
 * @description Elimina una alimentación según su ID.
 * @param {Object} req Objeto de solicitud de Express (contiene { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const deleteAlimentacion = async (req, res) => {
  await alimentacionModel.deleteAlimentacion(req.params.id);
  res.status(204).send();
};

module.exports = {
  getAlimentaciones,
  getAlimentacionById,
  createAlimentacion,
  updateAlimentacion,
  deleteAlimentacion,
};