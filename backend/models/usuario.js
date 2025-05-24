const pool = require('./db');

/**
 * @description Obtiene todos los usuarios registrados en la base de datos.
 * @returns {Promise<Array>} Una lista de todos los usuarios.
 */
const getUsuarios = async () => {
  const res = await pool.query('SELECT * FROM usuario');
  return res.rows;
};

/**
 * @description Obtiene un usuario específico por su ID.
 * @param {number} id ID del usuario.
 * @returns {Promise<Object>} El usuario correspondiente al ID proporcionado.
 */
const getUsuarioById = async (id) => {
  const res = await pool.query('SELECT * FROM usuario WHERE id = $1', [id]);
  return res.rows[0];
};

/**
 * @description Obtiene un usuario específico por su correo electrónico.
 * @param {string} email Correo electrónico del usuario.
 * @returns {Promise<Object>} El usuario correspondiente al correo electrónico proporcionado.
 */
const getUsuarioByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
  return res.rows[0];
};

/**
 * @description Crea un nuevo usuario en la base de datos.
 * @param {Object} usuario Objeto con los datos del usuario ({ nombre_usuario, nombre_empresa, email, contrasena_hash }).
 * @returns {Promise<Object>} El usuario creado.
 */
const createUsuario = async (usuario) => {
  const { nombre_usuario, nombre_empresa, email, contrasena_hash } = usuario;
  const res = await pool.query(
    'INSERT INTO usuario (nombre_usuario, nombre_empresa, email, contrasena_hash) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre_usuario, nombre_empresa, email, contrasena_hash]
  );
  return res.rows[0];
};

/**
 * @description Actualiza los datos de un usuario existente en la base de datos.
 * @param {number} id ID del usuario a actualizar.
 * @param {Object} usuario Objeto con los datos actualizados del usuario ({ nombre_usuario, nombre_empresa, email, contrasena_hash }).
 * @returns {Promise<Object>} El usuario actualizado.
 */
const updateUsuario = async (id, usuario) => {
  const { nombre_usuario, nombre_empresa, email, contrasena_hash } = usuario;
  let query = 'UPDATE usuario SET nombre_usuario = $1, nombre_empresa = $2, email = $3';
  const values = [nombre_usuario, nombre_empresa, email];

  if (contrasena_hash) {
    query += ', contrasena_hash = $4 WHERE id = $5 RETURNING *';
    values.push(contrasena_hash, id);
  } else {
    query += ' WHERE id = $4 RETURNING *';
    values.push(id);
  }

  const res = await pool.query(query, values);
  return res.rows[0];
};

/**
 * @description Elimina un usuario específico por su ID.
 * @param {number} id ID del usuario a eliminar.
 * @returns {Promise<void>} No devuelve ningún valor.
 */
const deleteUsuario = async (id) => {
  await pool.query('DELETE FROM usuario WHERE id = $1', [id]);
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  getUsuarioByEmail,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};