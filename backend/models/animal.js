const pool = require('./db');

/**
 * @description Obtiene todos los animales registrados en la base de datos.
 * @returns {Promise<Array>} Una lista de todos los animales.
 */
const getAnimales = async () => {
  const res = await pool.query('SELECT * FROM animal');
  return res.rows;
};

/**
 * @description Obtiene un animal específico por su ID.
 * @param {number} id ID del animal.
 * @returns {Promise<Object>} El animal correspondiente al ID proporcionado.
 */
const getAnimalById = async (id) => {
  const res = await pool.query('SELECT * FROM animal WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Obtiene un animal específico por su identificación única.
 * @param {string} identificacion Identificación única del animal.
 * @returns {Promise<Object>} El animal correspondiente a la identificación proporcionada.
 */
const getAnimalByIdentificacion = async (identificacion) => {
  const query = 'SELECT * FROM animal WHERE identificacion = $1';
  const result = await pool.query(query, [identificacion]);
  return result.rows[0];
};

/**
 * @description Crea un nuevo animal en la base de datos.
 * @param {Object} animal Objeto con los datos del animal ({ identificacion, especie, estado, fecha_nacimiento, fecha_alta, id_explotacion }).
 * @returns {Promise<Object>} El animal creado.
 */
const createAnimal = async (animal) => {
  const { identificacion, especie, estado, fecha_nacimiento, fecha_alta, id_explotacion } = animal;
  const res = await pool.query(
    'INSERT INTO animal (identificacion, especie, estado, fecha_nacimiento, fecha_alta, id_explotacion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [identificacion, especie, estado, fecha_nacimiento, fecha_alta, id_explotacion]
  );
  return res.rows[0];
};

/**
 * @description Actualiza los datos de un animal existente en la base de datos.
 * @param {number} id ID del animal a actualizar.
 * @param {Object} animal Objeto con los datos actualizados del animal ({ identificacion, especie, estado, fecha_nacimiento, fecha_alta, id_explotacion }).
 * @returns {Promise<Object>} El animal actualizado.
 */
const updateAnimal = async (id, animal) => {
  const { identificacion, especie, estado, fecha_nacimiento, fecha_alta, id_explotacion } = animal;
  const res = await pool.query(
    'UPDATE animal SET identificacion = $1, especie = $2, estado = $3, fecha_nacimiento = $4, fecha_alta = $5, id_explotacion = $6 WHERE id = $7 RETURNING *',
    [identificacion, especie, estado, fecha_nacimiento, fecha_alta, id_explotacion, id]
  );
  return res.rows[0];
};

/**
 * @description Elimina un animal específico por su ID.
 * @param {number} id ID del animal a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteAnimal = async (id) => {
  await pool.query('DELETE FROM animal WHERE id = $1', [id]);
};

module.exports = {
  getAnimales,
  getAnimalById,
  getAnimalByIdentificacion,
  createAnimal,
  updateAnimal,
  deleteAnimal,
};