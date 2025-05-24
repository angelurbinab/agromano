const inspeccionModel = require('../models/inspeccion');

/**
 * @description Obtiene todas las inspecciones registradas en la base de datos.
 * @param {Object} req Objeto de solicitud de Express
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void} Devuelve un JSON con todas las inspecciones.
 */
const getInspecciones = async (req, res) => {
  const inspecciones = await inspeccionModel.getInspecciones();
  res.json(inspecciones);
};

/**
 * @description Obtiene una inspección específica por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void} Devuelve un JSON con los datos de la inspección.
 */
const getInspeccionById = async (req, res) => {
  const inspeccion = await inspeccionModel.getInspeccionById(req.params.id);
  res.json(inspeccion);
};

/**
 * @description Crea una nueva inspección en la base de datos y comprueba que su número de acta no esté ya en uso.
 * @param {Object} req Objeto de solicitud de Express (debe incluir los datos de la inspección en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void} Devuelve un JSON con los datos de la inspección creada.
 */
const createInspeccion = async (req, res) => {
  const { numero_acta, id_explotacion } = req.body;

  // Comprobar si existe una inspección con el mismo número de acta
  const inspeccionExistente = await inspeccionModel.getInspeccionByActa(numero_acta, id_explotacion);
  if (inspeccionExistente) {
    return res.status(400).json({
      message: 'El número de acta ya está registrado para esta explotación.',
    });
  }

  const nuevaInspeccion = await inspeccionModel.createInspeccion(req.body);
  res.status(201).json(nuevaInspeccion);
};

/**
 * @description Actualiza los datos de una inspección existente.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y los datos actualizados en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void} Devuelve un JSON con los datos de la inspección actualizada.
 */
const updateInspeccion = async (req, res) => {
  const inspeccionActualizada = await inspeccionModel.updateInspeccion(req.params.id, req.body);
  res.json(inspeccionActualizada);
};

/**
 * @description Elimina una inspección específica por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void} Devuelve un estado 204 si la eliminación fue exitosa.
 */
const deleteInspeccion = async (req, res) => {
  await inspeccionModel.deleteInspeccion(req.params.id);
  res.status(204).send();
};

module.exports = {
  getInspecciones,
  getInspeccionById,
  createInspeccion,
  updateInspeccion,
  deleteInspeccion,
};