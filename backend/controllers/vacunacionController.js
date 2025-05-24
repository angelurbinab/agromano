const vacunacionModel = require('../models/vacunacion');

/**
 * @description Obtiene todas las vacunaciones registradas en la base de datos.
 * @param {Object} req Objeto de solicitud de Express
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getVacunaciones = async (req, res) => {
  const vacunaciones = await vacunacionModel.getVacunaciones();
  res.json(vacunaciones);
};

/**
 * @description Obtiene una vacunación específica por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getVacunacionById = async (req, res) => {
  const vacunacion = await vacunacionModel.getVacunacionById(req.params.id);
  res.json(vacunacion);
};

/**
 * @description Crea una nueva vacunación en la base de datos, validando que la combinación de fecha y tipo no exista para la misma explotación.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { fecha, tipo, id_explotacion } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const createVacunacion = async (req, res) => {
  const { fecha, tipo, id_explotacion } = req.body;

  // Comprobar si la combinación fecha-tipo ya existe para la explotación
  const vacunacionExistente = await vacunacionModel.getVacunacionByPareja(fecha, tipo, id_explotacion);
  if (vacunacionExistente) {
    return res.status(400).json({
      message: 'El tipo de vacuna ya existe para esa fecha. Accede a los animales afectados si quieres añadir animales a la vacuna.',
    });
  }

  // Crear la nueva vacuna si la combinación fecha-tipo no existe
  const nuevaVacunacion = await vacunacionModel.createVacunacion(req.body);
  res.status(201).json(nuevaVacunacion);
};

/**
 * @description Actualiza los datos de una vacunación existente.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y datos actualizados en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const updateVacunacion = async (req, res) => {
  const vacunacionActualizada = await vacunacionModel.updateVacunacion(req.params.id, req.body);
  res.json(vacunacionActualizada);
};

/**
 * @description Elimina una vacunación específica por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const deleteVacunacion = async (req, res) => {
  await vacunacionModel.deleteVacunacion(req.params.id);
  res.status(204).send();
};

module.exports = {
  getVacunaciones,
  getVacunacionById,
  createVacunacion,
  updateVacunacion,
  deleteVacunacion,
};