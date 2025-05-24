const express = require('express');
const titularController = require('../controllers/titularController');

const router = express.Router();

router.get('/titularesAdmin', titularController.getTitulares);
router.get('/titulares', titularController.getTitularesByUsuario);
router.get('/titulares/:id', titularController.getTitularById);
router.post('/titulares', titularController.createTitular);
router.put('/titulares/:id', titularController.updateTitular);
router.delete('/titulares/:id', titularController.deleteTitular);
router.get('/titulares/usuario/:id', titularController.getUsuarioByTitular);
router.get('/titulares/:id/datos', titularController.getTitularDatos);
router.post('/titulares/:id/informe', titularController.generatePDF);

module.exports = router;