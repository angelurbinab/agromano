const vacunacionAnimalModel = require('../models/vacunacion_animal');

/**
 * @description Obtiene todas las vacunaciones registradas para los animales en la base de datos.
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getVacunacionesAnimal = async (req, res) => {
  const vacunacionesAnimal = await vacunacionAnimalModel.getVacunacionesAnimal();
  res.json(vacunacionesAnimal);
};

/**
 * @description Obtiene una vacunación específica de un animal por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getVacunacionAnimalById = async (req, res) => {
  const vacunacionAnimal = await vacunacionAnimalModel.getVacunacionAnimalById(req.params.id);
  res.json(vacunacionAnimal);
};

/**
 * @description Crea una nueva vacunación para un animal en la base de datos.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { fecha, tipo, dosis, nombre_comercial, veterinario, id_animal } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const createVacunacionAnimal = async (req, res) => {
  const nuevaVacunacionAnimal = await vacunacionAnimalModel.createVacunacionAnimal(req.body);
  res.status(201).json(nuevaVacunacionAnimal);
};

/**
 * @description Actualiza los datos de una vacunación existente para un animal.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y datos actualizados en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const updateVacunacionAnimal = async (req, res) => {
  const vacunacionAnimalActualizada = await vacunacionAnimalModel.updateVacunacionAnimal(req.params.id, req.body);
  res.json(vacunacionAnimalActualizada);
};

/**
 * @description Elimina una vacunación específica de un animal por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const deleteVacunacionAnimal = async (req, res) => {
  await vacunacionAnimalModel.deleteVacunacionAnimal(req.params.id);
  res.status(204).send();
};

module.exports = {
  getVacunacionesAnimal,
  getVacunacionAnimalById,
  createVacunacionAnimal,
  updateVacunacionAnimal,
  deleteVacunacionAnimal,
};