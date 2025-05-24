const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.get('/usuarios', usuarioController.getUsuarios);
router.get('/usuarios/:id', usuarioController.getUsuarioById);
router.post('/usuarios', usuarioController.createUsuario);
router.put('/usuarios/:id', usuarioController.updateUsuario);
router.delete('/usuarios/:id', usuarioController.deleteUsuario);
router.post('/register', usuarioController.register);
router.post('/login', usuarioController.login);
router.post('/logout', usuarioController.logout);
router.get('/check-auth', usuarioController.checkAuth);

module.exports = router;