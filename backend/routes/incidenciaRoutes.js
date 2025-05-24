const express = require('express');
const incidenciaController = require('../controllers/incidenciaController');

const router = express.Router();

router.get('/incidencias', incidenciaController.getIncidencias);
router.get('/incidencias/:id', incidenciaController.getIncidenciaById);
router.post('/incidencias', incidenciaController.createIncidencia);
router.put('/incidencias/:id', incidenciaController.updateIncidencia);
router.delete('/incidencias/:id', incidenciaController.deleteIncidencia);

module.exports = router;