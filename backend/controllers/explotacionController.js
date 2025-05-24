const explotacionModel = require('../models/explotacion');

/**
 * @description Obtiene todas las explotaciones registradas en la base de datos.
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getExplotaciones = async (req, res) => {
  const explotaciones = await explotacionModel.getExplotaciones();
  res.json(explotaciones);
};

/**
 * @description Obtiene una explotación específica por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getExplotacionById = async (req, res) => {
  const explotacion = await explotacionModel.getExplotacionById(req.params.id);
  res.json(explotacion);
};

/**
 * @description Crea una nueva explotación en la base de datos.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { nombre, direccion, codigo, especies, coordenadas, id_titular } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const createExplotacion = async (req, res) => {
  const nuevaExplotacion = await explotacionModel.createExplotacion(req.body);
  res.status(201).json(nuevaExplotacion);
};

/**
 * @description Actualiza los datos de una explotación existente.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y datos actualizados en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const updateExplotacion = async (req, res) => {
  const explotacionActualizada = await explotacionModel.updateExplotacion(req.params.id, req.body);
  res.json(explotacionActualizada);
};

/**
 * @description Elimina una explotación específica por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const deleteExplotacion = async (req, res) => {
  await explotacionModel.deleteExplotacion(req.params.id);
  res.status(204).send();
};

module.exports = {
  getExplotaciones,
  getExplotacionById,
  createExplotacion,
  updateExplotacion,
  deleteExplotacion,
};