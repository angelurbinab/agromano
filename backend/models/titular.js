const pool = require('./db');

/**
 * @description Obtiene todos los titulares registrados en la base de datos.
 * @returns {Promise<Array>} Una lista de todos los titulares.
 */
const getTitulares = async () => {
  const res = await pool.query('SELECT * FROM titular');
  return res.rows;
};

/**
 * @description Obtiene todos los titulares asociados a un usuario específico.
 * @param {number} usuarioId ID del usuario.
 * @returns {Promise<Array>} Una lista de titulares asociados al usuario.
 */
const getTitularesByUsuarioId = async (usuarioId) => {
  const res = await pool.query('SELECT * FROM titular WHERE id_usuario = $1', [usuarioId]);
  return res.rows;
};

/**
 * @description Obtiene un titular específico por su ID.
 * @param {number} id ID del titular.
 * @returns {Promise<Object>} El titular correspondiente al ID proporcionado.
 */
const getTitularById = async (id) => {
  const res = await pool.query('SELECT * FROM titular WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Obtiene un titular específico por su NIF.
 * @param {string} nif NIF del titular.
 * @returns {Promise<Object>} El titular correspondiente al NIF proporcionado.
 */
const getTitularByNif = async (nif) => {
  const res = await pool.query('SELECT * FROM titular WHERE nif = $1', [nif]);
  return res.rows[0];
};

/**
 * @description Obtiene el usuario asociado a un titular específico.
 * @param {number} id ID del titular.
 * @returns {Promise<Object>} El usuario asociado al titular.
 */
const getUsuarioByTitularId = async (id) => {
  const res = await pool.query('SELECT id_usuario FROM titular WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Crea un nuevo titular en la base de datos.
 * @param {Object} titular Objeto con los datos del titular ({ nombre, nif, domicilio, localidad, provincia, codigo_postal, telefono, id_usuario }).
 * @returns {Promise<Object>} El titular creado.
 */
const createTitular = async (titular) => {
  const { nombre, nif, domicilio, localidad, provincia, codigo_postal, telefono, id_usuario } = titular;
  const res = await pool.query(
    'INSERT INTO titular (nombre, nif, domicilio, localidad, provincia, codigo_postal, telefono, id_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [nombre, nif, domicilio, localidad, provincia, codigo_postal, telefono, id_usuario]
  );
  return res.rows[0];
};

/**
 * @description Actualiza los datos de un titular existente en la base de datos.
 * @param {number} id ID del titular a actualizar.
 * @param {Object} titular Objeto con los datos actualizados del titular ({ nombre, nif, domicilio, localidad, provincia, codigo_postal, telefono, id_usuario }).
 * @returns {Promise<Object>} El titular actualizado.
 */
const updateTitular = async (id, titular) => {
  const { nombre, nif, domicilio, localidad, provincia, codigo_postal, telefono, id_usuario } = titular;
  const res = await pool.query(
    'UPDATE titular SET nombre = $1, nif = $2, domicilio = $3, localidad = $4, provincia = $5, codigo_postal = $6, telefono = $7, id_usuario = $8 WHERE id = $9 RETURNING *',
    [nombre, nif, domicilio, localidad, provincia, codigo_postal, telefono, id_usuario, id]
  );
  return res.rows[0];
};

/**
 * @description Elimina un titular específico por su ID.
 * @param {number} id ID del titular a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteTitular = async (id) => {
  await pool.query('DELETE FROM titular WHERE id = $1', [id]);
};

//------------------------------------------------------------

/**
 * @description Obtiene todas las explotaciones asociadas a un titular.
 * @param {number} titularId ID del titular.
 * @returns {Promise<Array>} Una lista de explotaciones asociadas al titular.
 */
const getExplotacionesByTitularId = async (titularId) => {
  const query = 'SELECT * FROM explotacion WHERE id_titular = $1';
  const res = await pool.query(query, [titularId]);
  return res.rows;
};

/**
 * @description Obtiene todas las parcelas asociadas a una explotación.
 * @param {number} explotacionId ID de la explotación.
 * @returns {Promise<Array>} Una lista de parcelas asociadas a la explotación.
 */
const getParcelasByExplotacionId = async (explotacionId) => {
  const query = 'SELECT * FROM parcela WHERE id_explotacion = $1';
  const res = await pool.query(query, [explotacionId]);
  return res.rows;
};

/**
 * @description Obtiene todos los animales asociados a una explotación.
 * @param {number} explotacionId ID de la explotación.
 * @returns {Promise<Array>} Una lista de animales asociados a la explotación.
 */
const getAnimalesByExplotacionId = async (explotacionId) => {
  const query = 'SELECT * FROM animal WHERE id_explotacion = $1';
  const res = await pool.query(query, [explotacionId]);
  return res.rows;
};

/**
 * @description Obtiene todos los movimientos asociados a un animal.
 * @param {number} animalId ID del animal.
 * @returns {Promise<Array>} Una lista de movimientos asociados al animal.
 */
const getMovimientosByAnimalId = async (animalId) => {
  const query = 'SELECT * FROM movimiento WHERE id_animal = $1';
  const res = await pool.query(query, [animalId]);
  return res.rows;
};

/**
 * @description Obtiene todas las incidencias asociadas a un animal.
 * @param {number} animalId ID del animal.
 * @returns {Promise<Array>} Una lista de incidencias asociadas al animal.
 */
const getIncidenciasByAnimalId = async (animalId) => {
  const query = 'SELECT * FROM incidencia WHERE id_animal = $1';
  const res = await pool.query(query, [animalId]);
  return res.rows;
};

/**
 * @description Obtiene todas las vacunaciones asociadas a un animal.
 * @param {number} animalId ID del animal.
 * @returns {Promise<Array>} Una lista de vacunaciones asociadas al animal.
 */
const getVacunacionesByAnimalId = async (animalId) => {
  const query = `
    SELECT v.*
    FROM vacunacion v
    JOIN vacunacion_animal va ON v.id = va.id_vacunacion
    WHERE va.id_animal = $1
  `;
  const res = await pool.query(query, [animalId]);
  return res.rows;
};

/**
 * @description Obtiene toda la alimentación asociada a una explotación.
 * @param {number} explotacionId ID de la explotación.
 * @returns {Promise<Array>} Una lista de registros de alimentación asociados a la explotación.
 */
const getAlimentacionByExplotacionId = async (explotacionId) => {
  const query = 'SELECT * FROM alimentacion WHERE id_explotacion = $1';
  const res = await pool.query(query, [explotacionId]);
  return res.rows;
};

/**
 * @description Obtiene todos los medicamentos asociados a una explotación.
 * @param {number} explotacionId ID de la explotación.
 * @returns {Promise<Array>} Una lista de medicamentos asociados a la explotación.
 */
const getMedicamentosByExplotacionId = async (explotacionId) => {
  const query = 'SELECT * FROM medicamento WHERE id_explotacion = $1';
  const res = await pool.query(query, [explotacionId]);
  return res.rows;
};

/**
 * @description Obtiene todas las inspecciones asociadas a una explotación.
 * @param {number} explotacionId ID de la explotación.
 * @returns {Promise<Array>} Una lista de inspecciones asociadas a la explotación.
 */
const getInspeccionesByExplotacionId = async (explotacionId) => {
  const query = 'SELECT * FROM inspeccion WHERE id_explotacion = $1';
  const res = await pool.query(query, [explotacionId]);
  return res.rows;
};

//------------------------------------------------------------

module.exports = {
  getTitulares,
  getTitularesByUsuarioId,
  getTitularByNif,
  getTitularById,
  getUsuarioByTitularId,
  createTitular,
  updateTitular,
  deleteTitular,
  getExplotacionesByTitularId,
  getParcelasByExplotacionId,
  getAnimalesByExplotacionId,
  getMovimientosByAnimalId,
  getIncidenciasByAnimalId,
  getVacunacionesByAnimalId,
  getAlimentacionByExplotacionId,
  getMedicamentosByExplotacionId,
  getInspeccionesByExplotacionId,
};