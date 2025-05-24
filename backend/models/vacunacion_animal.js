const pool = require('./db');

/**
 * @description Obtiene todas las relaciones entre vacunaciones y animales registradas en la base de datos.
 * @returns {Promise<Array>} Una lista de todas las relaciones entre vacunaciones y animales.
 */
const getVacunacionesAnimal = async () => {
  const res = await pool.query('SELECT * FROM vacunacion_animal');
  return res.rows;
};

/**
 * @description Obtiene una relación específica entre una vacunación y un animal por su ID.
 * @param {number} id ID de la relación.
 * @returns {Promise<Object>} La relación correspondiente al ID proporcionado.
 */
const getVacunacionAnimalById = async (id) => {
  const res = await pool.query('SELECT * FROM vacunacion_animal WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Crea una nueva relación entre una vacunación y un animal en la base de datos.
 * @param {Object} vacunacion_animal Objeto con los datos de la relación ({ id_vacunacion, id_animal }).
 * @returns {Promise<Object>} La relación creada.
 */
const createVacunacionAnimal = async (vacunacion_animal) => {
  const { id_vacunacion, id_animal } = vacunacion_animal;
  const res = await pool.query(
    'INSERT INTO vacunacion_animal (id_vacunacion, id_animal) VALUES ($1, $2) RETURNING *',
    [id_vacunacion, id_animal]
  );
  return res.rows[0];
};

/**
 * @description Actualiza los datos de una relación existente entre una vacunación y un animal.
 * @param {number} id ID de la relación a actualizar.
 * @param {Object} vacunacion_animal Objeto con los datos actualizados de la relación ({ id_vacunacion, id_animal }).
 * @returns {Promise<Object>} La relación actualizada.
 */
const updateVacunacionAnimal = async (id, vacunacion_animal) => {
  const { id_vacunacion, id_animal } = vacunacion_animal;
  const res = await pool.query(
    'UPDATE vacunacion_animal SET id_vacunacion = $1, id_animal = $2 WHERE id = $3 RETURNING *',
    [id_vacunacion, id_animal, id]
  );
  return res.rows[0];
};

/**
 * @description Elimina una relación específica entre una vacunación y un animal por su ID.
 * @param {number} id ID de la relación a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteVacunacionAnimal = async (id) => {
  await pool.query('DELETE FROM vacunacion_animal WHERE id = $1', [id]);
};

module.exports = {
  getVacunacionesAnimal,
  getVacunacionAnimalById,
  createVacunacionAnimal,
  updateVacunacionAnimal,
  deleteVacunacionAnimal,
};