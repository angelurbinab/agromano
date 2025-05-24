const usuarioModel = require('../models/usuario');
const bcrypt = require('bcryptjs');

/**
 * @description Registra un nuevo usuario en la base de datos, validando que el correo electrónico no esté en uso.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { nombre_usuario, nombre_empresa, email, contrasena } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const register = async (req, res) => {
  const { nombre_usuario, nombre_empresa, email, contrasena } = req.body;

  const usuarioExistente = await usuarioModel.getUsuarioByEmail(email);
  if (usuarioExistente) {
    return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
  }

  const contrasena_hash = await bcrypt.hash(contrasena, 10);
  const nuevoUsuario = await usuarioModel.createUsuario({ nombre_usuario, nombre_empresa, email, contrasena_hash });
  res.status(201).json(nuevoUsuario);
};

/**
 * @description Inicia sesión para un usuario, validando el correo electrónico y la contraseña.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { email, contrasena } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const login = async (req, res) => {
  const { email, contrasena } = req.body;
  const usuario = await usuarioModel.getUsuarioByEmail(email);
  if (usuario && await bcrypt.compare(contrasena, usuario.contrasena_hash)) {
    req.session.user = usuario;
    res.json({ message: 'Login exitoso' });
  } else {
    res.status(401).json({ message: 'Email o contraseña incorrectos' });
  }
};

/**
 * @description Cierra la sesión del usuario actual.
 * @param {Object} req Objeto de solicitud de Express
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout exitoso' });
};

/**
 * @description Verifica si el usuario actual está autenticado.
 * @param {Object} req Objeto de solicitud de Express
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const checkAuth = (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false, user: null });
  }
};

/**
 * @description Obtiene todos los usuarios registrados en la base de datos.
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getUsuarios = async (res) => {
  const usuarios = await usuarioModel.getUsuarios();
  res.json(usuarios);
};

/**
 * @description Obtiene un usuario específico por su ID.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const getUsuarioById = async (req, res) => {
  const usuario = await usuarioModel.getUsuarioById(req.params.id);
  res.json(usuario);
};

/**
 * @description Crea un nuevo usuario en la base de datos.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { nombre_usuario, nombre_empresa, email, contrasena } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const createUsuario = async (req, res) => {
  const nuevoUsuario = await usuarioModel.createUsuario(req.body);
  res.status(201).json(nuevoUsuario);
};

/**
 * @description Actualiza los datos de un usuario existente.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params y { nombre_usuario, nombre_empresa, email, contrasena } en body)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const updateUsuario = async (req, res) => {
  const { nombre_usuario, nombre_empresa, email, contrasena } = req.body;
  let contrasena_hash;

  if (contrasena) {
    contrasena_hash = await bcrypt.hash(contrasena, 10);
  }

  const usuarioActualizado = await usuarioModel.updateUsuario(req.params.id, {
    nombre_usuario,
    nombre_empresa,
    email,
    contrasena_hash
  });

  res.json(usuarioActualizado);
};

/**
 * @description Elimina un usuario específico por su ID y cierra su sesión.
 * @param {Object} req Objeto de solicitud de Express (debe incluir { id } en params)
 * @param {Object} res Objeto de respuesta de Express
 * @returns {void}
 */
const deleteUsuario = async (req, res) => {
  await usuarioModel.deleteUsuario(req.params.id);
  logout(req, res);
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  register,
  login,
  logout,
  checkAuth,
};