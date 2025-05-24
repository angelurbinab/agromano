const animalModel = require('../models/animal');

/**
 * @description Obtiene todos los animales registrados en la base de datos.
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getAnimales = async (req, res) => {
  const animales = await animalModel.getAnimales();
  res.json(animales);
};

/**
 * @description Obtiene un animal específico por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getAnimalById = async (req, res) => {
  const animal = await animalModel.getAnimalById(req.params.id);
  res.json(animal);
};

/**
 * @description Crea un nuevo animal, validando que el número de identificación no exista.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { identificacion, especie, estado, fecha_nacimiento, fecha_alta, id_explotacion } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const createAnimal = async (req, res) => {
  const { identificacion } = req.body;

  // Comprobar si el número de identificación ya existe
  const animalExistente = await animalModel.getAnimalByIdentificacion(identificacion);
  if (animalExistente) {
    return res.status(400).json({ message: 'El número de identificación ya está en uso, no se pueden duplicar números de identificación' });
  }

  // Crear el nuevo animal si el número de identificación no existe
  const nuevoAnimal = await animalModel.createAnimal(req.body);
  res.status(201).json(nuevoAnimal);
};

/**
 * @description Actualiza la información de un animal existente.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y datos actualizados en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const updateAnimal = async (req, res) => {
  const animalActualizado = await animalModel.updateAnimal(req.params.id, req.body);
  res.json(animalActualizado);
};

/**
 * @description Elimina un animal según su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const deleteAnimal = async (req, res) => {
  await animalModel.deleteAnimal(req.params.id);
  res.status(204).send();
};

module.exports = {
  getAnimales,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
};