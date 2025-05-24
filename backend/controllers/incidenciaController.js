const incidenciaModel = require('../models/incidencia');

/**
 * @description Obtiene todas las incidencias registradas en la base de datos.
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getIncidencias = async (req, res) => {
  const incidencias = await incidenciaModel.getIncidencias();
  res.json(incidencias);
};

/**
 * @description Obtiene una incidencia específica por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getIncidenciaById = async (req, res) => {
  const incidencia = await incidenciaModel.getIncidenciaById(req.params.id);
  res.json(incidencia);
};

/**
 * @description Crea una nueva incidencia en la base de datos.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { fecha, descripcion, id_animal, codigo_anterior, codigo_actual } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const createIncidencia = async (req, res) => {
  const nuevaIncidencia = await incidenciaModel.createIncidencia(req.body);
  res.status(201).json(nuevaIncidencia);
};

/**
 * @description Actualiza los datos de una incidencia existente.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y datos actualizados en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const updateIncidencia = async (req, res) => {
  const incidenciaActualizada = await incidenciaModel.updateIncidencia(req.params.id, req.body);
  res.json(incidenciaActualizada);
};

/**
 * @description Elimina una incidencia específica por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const deleteIncidencia = async (req, res) => {
  await incidenciaModel.deleteIncidencia(req.params.id);
  res.status(204).send();
};

module.exports = {
  getIncidencias,
  getIncidenciaById,
  createIncidencia,
  updateIncidencia,
  deleteIncidencia,
};