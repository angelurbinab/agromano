const parcelaModel = require('../models/parcela');

/**
 * @description Obtiene todas las parcelas registradas en la base de datos.
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getParcelas = async (req, res) => {
  const parcelas = await parcelaModel.getParcelas();
  res.json(parcelas);
};

/**
 * @description Obtiene una parcela específica por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getParcelaById = async (req, res) => {
  const parcela = await parcelaModel.getParcelaById(req.params.id);
  res.json(parcela);
};

/**
 * @description Crea una nueva parcela en la base de datos.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { coordenadas, extension, id_explotacion } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const createParcela = async (req, res) => {
  const nuevaParcela = await parcelaModel.createParcela(req.body);
  res.status(201).json(nuevaParcela);
};

/**
 * @description Actualiza los datos de una parcela existente.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y datos actualizados en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const updateParcela = async (req, res) => {
  const parcelaActualizada = await parcelaModel.updateParcela(req.params.id, req.body);
  res.json(parcelaActualizada);
};

/**
 * @description Elimina una parcela específica por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const deleteParcela = async (req, res) => {
  await parcelaModel.deleteParcela(req.params.id);
  res.status(204).send();
};

module.exports = {
  getParcelas,
  getParcelaById,
  createParcela,
  updateParcela,
  deleteParcela,
};