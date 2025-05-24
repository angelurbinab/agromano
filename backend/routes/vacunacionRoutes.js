const express = require('express');
const vacunacionController = require('../controllers/vacunacionController');

const router = express.Router();

router.get('/vacunaciones', vacunacionController.getVacunaciones);
router.get('/vacunaciones/:id', vacunacionController.getVacunacionById);
router.post('/vacunaciones', vacunacionController.createVacunacion);
router.put('/vacunaciones/:id', vacunacionController.updateVacunacion);
router.delete('/vacunaciones/:id', vacunacionController.deleteVacunacion);

module.exports = router;